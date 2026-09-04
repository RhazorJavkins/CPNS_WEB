// Simple in-memory token bucket for Vercel/Next.js
// Note: per-instance only (serverless resets), good enough as first gate before Redis.
// Keys: user:<id> or ip:<addr>

const buckets = new Map<string, { count: number; resetAt: number }>();

// Cleanup every 5 min to avoid leak
let lastCleanup = 0;
function cleanup(now: number) {
  if (now - lastCleanup < 300_000) return;
  lastCleanup = now;
  for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
}

export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  cleanup(now);
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (entry.count < limit) {
    entry.count += 1;
    return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
  }
  return { allowed: false, remaining: 0, resetAt: entry.resetAt };
}

export function getClientKey(req: Request, userId?: string): string {
  if (userId) return `user:${userId}`;
  const xf = req.headers.get("x-forwarded-for");
  const ip = xf ? xf.split(",")[0].trim() : req.headers.get("x-real-ip") || "unknown";
  return `ip:${ip}`;
}

export function rateLimitHeaders(remaining: number, resetAt: number, limit: number) {
  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(Math.max(0, remaining)),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
  } as Record<string, string>;
}
