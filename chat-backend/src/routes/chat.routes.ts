import { PrismaClient } from '@prisma/client';
import { Response, Router } from 'express';
import Redis from 'ioredis';
import { env } from '../config/env.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { chatRateLimiter } from '../middleware/rateLimit.middleware.js';
import { aiOrchestrator } from '../services/ai.orchestrator.js';
import { cacheService } from '../services/cache.service.js';
import { LimitService } from '../services/limit.service.js';
import { logger } from '../services/logger.service.js';
import { queueService } from '../services/queue.service.js';
import { detectCategory } from '../utils/category.utils.js';
import { estimateCostSaved } from '../utils/cost.utils.js';

export const chatRouter = Router();
const prisma = new PrismaClient();

// Create a dedicated Redis subscriber for SSE
const subscriber = new Redis(env.REDIS_URL);
// Create a publisher for the worker
const publisher = new Redis(env.REDIS_URL);

/**
 * Worker Processor setup.
 */
queueService.startWorker(async (job) => {
  const { question, history, systemPrompt, conversationId } = job.data;
  const channel = `stream:${job.id}`;
  let fullAnswer = '';
  let usedModel = '';

  try {
    const stream = aiOrchestrator.streamChat(question, history, systemPrompt);

    for await (const chunk of stream) {
      if (chunk.modelUsed) {
        usedModel = chunk.modelUsed;
      }

      await publisher.publish(channel, JSON.stringify(chunk));

      if (!chunk.done) {
        fullAnswer += chunk.token;
      }
    }

    const category = detectCategory(question);
    await cacheService.saveAnswer(question, fullAnswer);

    if (conversationId) {
      await prisma.message.create({
        data: {
          conversationId,
          role: 'ai',
          text: fullAnswer,
          category,
          modelUsed: usedModel,
          fromCache: false,
        },
      });
    }

    await prisma.analytics.create({
      data: {
        fromCache: false,
        modelUsed: usedModel,
        category,
        costSaved: 0,
      },
    });
  } catch (error: any) {
    logger.error(`❌ Worker failed for job ${job.id}`, error);
    await publisher.publish(
      channel,
      JSON.stringify({ token: 'حدث خطأ غير متوقع. حاول مرة أخرى.', done: true })
    );
    throw error;
  }
});

/**
 * GET /api/chat/limit
 * Returns remaining daily messages for the authenticated user
 */
chatRouter.get('/limit', authMiddleware, async (req: AuthRequest, res: Response) => {
  const status = await LimitService.getStatus(req.userId!);
  res.json(status);
});

/**
 * POST /api/chat/stream
 * Streaming endpoint using SSE — requires x-clerk-user-id header
 */
chatRouter.post('/stream', authMiddleware, chatRateLimiter, async (req: AuthRequest, res: Response) => {
  const { conversationId, message, history, systemPrompt = 'أنت مساعد رياضي متخصص.' } = req.body;
  const userId = req.userId!;
  const startTime = Date.now();

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Check User Limit
  const canSend = await LimitService.canSend(userId);
  if (!canSend) {
    const status = await LimitService.getStatus(userId);
    return res.status(429).json({
      error: 'انتهت رسائلك اليومية.',
      resetAt: status.resetAt,
    });
  }

  await LimitService.increment(userId);

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    // Check Cache (Layers 1 & 2)
    const cacheResult = await cacheService.findAnswer(message);

    if (cacheResult.source !== 'none') {
      logger.info(`✅ Cache Hit (${cacheResult.source}) for user ${userId}`);

      const words = cacheResult.answer.split(' ');
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ token: word + ' ', done: false })}\n\n`);
        await new Promise((r) => setTimeout(r, 20));
      }
      res.write(`data: ${JSON.stringify({ token: '', done: true })}\n\n`);
      res.end();

      const responseTime = Date.now() - startTime;
      const category = detectCategory(message);

      if (conversationId) {
        await prisma.message.create({
          data: { conversationId, role: 'user', text: message, category },
        });
        await prisma.message.create({
          data: {
            conversationId,
            role: 'ai',
            text: cacheResult.answer,
            category,
            fromCache: true,
            responseTimeMs: responseTime,
          },
        });
      }

      await prisma.analytics.create({
        data: {
          fromCache: true,
          category,
          responseMs: responseTime,
          costSaved: estimateCostSaved(message, cacheResult.answer),
        },
      });
      return;
    }

    // Cache Miss → Queue for AI processing
    logger.info(`⏳ Cache Miss. Queuing AI job for user ${userId}`);

    if (conversationId) {
      await prisma.message.create({
        data: { conversationId, role: 'user', text: message, category: detectCategory(message) },
      });
    }

    const wordCount = message.trim().split(/\s+/).length;
    const priority = wordCount < 5 ? 1 : 2;

    const job = await queueService.aiQueue.add(
      'process_chat',
      { userId, conversationId, question: message, history: history || [], systemPrompt },
      { priority }
    );

    const channel = `stream:${job.id}`;

    const messageHandler = (ch: string, messageStr: string) => {
      if (ch === channel) {
        const data = JSON.parse(messageStr);
        res.write(`data: ${JSON.stringify(data)}\n\n`);

        if (data.done) {
          subscriber.unsubscribe(channel);
          subscriber.removeListener('message', messageHandler);
          res.end();
        }
      }
    };

    subscriber.on('message', messageHandler);
    await subscriber.subscribe(channel);

    req.on('close', () => {
      logger.warn(`⚠️ Client disconnected prematurely. Job ${job.id} continues in background.`);
      subscriber.unsubscribe(channel);
      subscriber.removeListener('message', messageHandler);
    });
  } catch (error) {
    logger.error('❌ Chat stream endpoint error', error);
    res.write(`data: ${JSON.stringify({ token: 'حدث خطأ، يرجى المحاولة.', done: true })}\n\n`);
    res.end();
  }
});
