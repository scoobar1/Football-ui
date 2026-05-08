import Redis from 'ioredis';
import { env } from '../config/env.js';

const redis = new Redis(env.REDIS_URL);

export class LimitService {
  static async getStatus(userId: string) {
    const key = `limit:${userId}`;
    const countStr = await redis.get(key);
    const count = countStr ? parseInt(countStr, 10) : 0;

    let remaining = env.DAILY_MESSAGE_LIMIT - count;
    if (remaining < 0) remaining = 0;

    let resetAt = null;
    if (remaining === 0) {
      const ttl = await redis.ttl(key);
      resetAt = new Date(Date.now() + (ttl > 0 ? ttl : 24 * 60 * 60) * 1000);
    }

    return { remaining, resetAt };
  }

  static async canSend(userId: string): Promise<boolean> {
    const { remaining } = await this.getStatus(userId);
    return remaining > 0;
  }

  static async increment(userId: string) {
    const key = `limit:${userId}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 24 * 60 * 60);
    }
    return count;
  }
}
