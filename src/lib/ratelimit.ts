import { NextRequest } from 'next/server';

// ─── Types ───────────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

interface RateLimitConfig {
  /** Maximum number of requests allowed per window */
  max: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

// ─── In-Memory Store ─────────────────────────────────────────────────────────
// NOTE: This in-memory store works for single-instance deployments.
// For multi-instance / serverless deployments, replace with Upstash Redis:
//   import { Ratelimit } from '@upstash/ratelimit';
//   import { Redis } from '@upstash/redis';

const stores = new Map<string, Map<string, RateLimitEntry>>();

/** Periodic cleanup to prevent unbounded memory growth */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanup(): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    stores.forEach((store) => {
      store.forEach((entry, key) => {
        if (now - entry.windowStart > 30 * 60 * 1000) {
          store.delete(key);
        }
      });
    });
  }, CLEANUP_INTERVAL_MS);
  // Allow process to exit without waiting for cleanup timer
  if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref();
  }
}

// ─── Rate Limiter Factory ────────────────────────────────────────────────────

/**
 * Creates a named rate limiter with the given configuration.
 * Each limiter has its own isolated store keyed by identifier (typically IP).
 */
export function createRateLimiter(name: string, config: RateLimitConfig) {
  if (!stores.has(name)) {
    stores.set(name, new Map<string, RateLimitEntry>());
  }
  const store = stores.get(name)!;
  ensureCleanup();

  return {
    /**
     * Check if the identifier is rate-limited.
     * Returns `{ limited: true }` if the limit is exceeded.
     */
    check(identifier: string): { limited: boolean; remaining: number } {
      const now = Date.now();
      const entry = store.get(identifier);

      if (!entry || now - entry.windowStart > config.windowMs) {
        store.set(identifier, { count: 1, windowStart: now });
        return { limited: false, remaining: config.max - 1 };
      }

      if (entry.count >= config.max) {
        return { limited: true, remaining: 0 };
      }

      entry.count++;
      return { limited: false, remaining: config.max - entry.count };
    },

    /** Reset the counter for a given identifier (e.g. after successful login) */
    reset(identifier: string): void {
      store.delete(identifier);
    },
  };
}

// ─── Pre-configured Limiters ─────────────────────────────────────────────────

/** Login: 10 attempts per 15 minutes per IP */
export const loginLimiter = createRateLimiter('login', {
  max: 10,
  windowMs: 15 * 60 * 1000,
});

/** Registration: 5 submissions per hour per IP */
export const registerLimiter = createRateLimiter('register', {
  max: 5,
  windowMs: 60 * 60 * 1000,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extract client IP from request headers (respects reverse proxies) */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}
