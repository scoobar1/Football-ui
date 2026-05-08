import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { prisma } from './config/database.js'
import { env } from './config/env.js'
import { logger } from './services/logger.service.js'
import { queueService } from './services/queue.service.js'
import { redisService } from './services/redis.service.js'
import { createWebSocketServer } from './websocket/ChatWebSocket.js'

import { analyticsRouter } from './routes/analytics.routes.js'
import { chatRouter } from './routes/chat.routes.js'
import conversationsRouter from './routes/conversations.js'
import { healthRouter } from './routes/health.routes.js'

import { errorHandler } from './middleware/errorHandler.middleware.js'
import { globalRateLimiter } from './middleware/rateLimit.middleware.js'

const app = express()

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [env.FRONTEND_URL, 'http://localhost:8081'], // 8081 for Expo
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(globalRateLimiter)

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/health', healthRouter)
app.use('/api/conversations', conversationsRouter)
app.use('/api/chat', chatRouter)
app.use('/api/analytics', analyticsRouter)

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler)

// ─── HTTP + WebSocket Server ──────────────────────────────────────────────────
const server = createServer(app)
createWebSocketServer(server)

// ─── Start ────────────────────────────────────────────────────────────────────
async function main() {
  try {
    await prisma.$connect()
    logger.info('✅ Database connected')

    server.listen(env.PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${env.PORT}`)
      logger.info(`🔌 WebSocket ready on ws://localhost:${env.PORT}/ws`)
      logger.info(`📊 Environment: ${process.env.NODE_ENV ?? 'development'}`)
    })
  } catch (err) {
    logger.error('❌ Failed to start server:', err)
    process.exit(1)
  }
}

main()

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received — shutting down gracefully')
  await queueService.close()
  await redisService.disconnect()
  await prisma.$disconnect()
  server.close(() => process.exit(0))
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received — shutting down gracefully')
  await queueService.close()
  await redisService.disconnect()
  await prisma.$disconnect()
  server.close(() => process.exit(0))
})
