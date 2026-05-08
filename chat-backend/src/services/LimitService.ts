import { prisma } from '../config/database.js'
import { env } from '../config/env.js'

/**
 * بيرجع تاريخ النهارده كـ string "YYYY-MM-DD"
 */
function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * يضمن إن الـ user موجود في الـ DB بالـ clerkId
 * بيتعمل upsert تلقائي عند أول استخدام
 */
async function ensureUser(userId: string): Promise<void> {
  // upsert بالـ clerkId — الـ schema الجديد مش محتاج name/email/passwordHash
  await prisma.$executeRaw`
    INSERT INTO "User" (id, "createdAt")
    VALUES (${userId}, NOW())
    ON CONFLICT (id) DO NOTHING
  `
}

export const LimitService = {
  async getRemaining(userId: string): Promise<number> {
    const date = todayString()
    const record = await prisma.dailyLimit.findUnique({
      where: { userId_date: { userId, date } },
    })
    const used = record?.count ?? 0
    return Math.max(0, env.DAILY_MESSAGE_LIMIT - used)
  },

  async canSend(userId: string): Promise<boolean> {
    const remaining = await this.getRemaining(userId)
    return remaining > 0
  },

  async increment(userId: string): Promise<void> {
    const date = todayString()
    await ensureUser(userId)
    await prisma.dailyLimit.upsert({
      where: { userId_date: { userId, date } },
      create: { userId, date, count: 1 },
      update: { count: { increment: 1 } },
    })
  },

  getResetTime(): Date {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  },

  async getStatus(userId: string): Promise<{
    remaining: number
    used: number
    limit: number
    resetAt: Date
  }> {
    const remaining = await this.getRemaining(userId)
    return {
      remaining,
      used: env.DAILY_MESSAGE_LIMIT - remaining,
      limit: env.DAILY_MESSAGE_LIMIT,
      resetAt: this.getResetTime(),
    }
  },
}
