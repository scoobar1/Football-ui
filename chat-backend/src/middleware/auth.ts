import { NextFunction, Request, Response } from 'express'

export interface AuthRequest extends Request {
  userId?: string
}

/**
 * Middleware بسيط — بياخد الـ userId من الـ headers
 *
 * Production:  x-clerk-user-id  (بيجي من التطبيق الأم عبر Clerk)
 * Development: x-user-id        (guest ID تلقائي من النيتف — للتيم فقط)
 *
 * الأولوية: x-clerk-user-id أولاً، لو مش موجود يجرب x-user-id
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const userId =
    (req.headers['x-clerk-user-id'] as string) ||
    (req.headers['x-user-id'] as string)

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized — missing x-clerk-user-id or x-user-id header' })
    return
  }

  req.userId = userId
  next()
}
