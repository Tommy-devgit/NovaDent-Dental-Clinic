import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
}

// --- In-memory fallback (dev, tests, single long-running process) -------------
// ponytail: per-process fixed window. Correct on one dyno; on multi-instance
// serverless it only limits per-instance — set UPSTASH_REDIS_REST_URL/TOKEN there
// to get the shared-store path below instead.
const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

export function memoryRateLimit(key: string, limit: number, windowMs: number, now: number): RateLimitResult {
  if (memoryBuckets.size > 10_000) {
    for (const [bucketKey, bucket] of memoryBuckets) {
      if (now >= bucket.resetAt) memoryBuckets.delete(bucketKey);
    }
  }

  const bucket = memoryBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) {
    return { success: false, remaining: 0 };
  }
  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count };
}

// --- Upstash (shared store, serverless-safe) ----------------------------------
const upstashLimiters = new Map<string, Ratelimit>();

function getUpstashLimiter(limit: number, windowSeconds: number): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  const cacheKey = `${limit}:${windowSeconds}`;
  let limiter = upstashLimiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
      prefix: "novadent:rl",
    });
    upstashLimiters.set(cacheKey, limiter);
  }
  return limiter;
}

export async function rateLimit(
  identifier: string,
  options: { limit: number; windowSeconds: number },
): Promise<RateLimitResult> {
  const upstash = getUpstashLimiter(options.limit, options.windowSeconds);
  if (upstash) {
    const result = await upstash.limit(identifier);
    return { success: result.success, remaining: result.remaining };
  }
  return memoryRateLimit(identifier, options.limit, options.windowSeconds * 1000, Date.now());
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
