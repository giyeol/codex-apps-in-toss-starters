import { Hono } from "hono";
import { allowedOrigin, corsHeaders } from "./cors";
import { parseGiftQuery, recommendGifts } from "./recommend";

type RateLimit = (key: string) => Promise<boolean>;
type Options = { limit?: number; rateLimit?: RateLimit };
type Env = { GIFT_RATE_LIMITER: { limit(input: { key: string }): Promise<{ success: boolean }> } };

function memoryRateLimit(limit: number): RateLimit {
  const entries = new Map<string, { count: number; startedAt: number }>();
  return async (key) => {
    const now = Date.now(); const entry = entries.get(key);
    if (!entry || now - entry.startedAt >= 60_000) { entries.set(key, { count: 1, startedAt: now }); return true; }
    entry.count += 1; return entry.count <= limit;
  };
}

export function createApp(options: Options = {}) {
  const app = new Hono();
  const rateLimit = options.rateLimit ?? memoryRateLimit(options.limit ?? 120);
  app.use("*", async (context, next) => {
    context.header("Vary", "Origin");
    const rawOrigin = context.req.header("Origin");
    if (rawOrigin) {
      const origin = allowedOrigin(rawOrigin);
      if (!origin) return context.json({ error: "Origin is not allowed" }, 403);
      Object.entries(corsHeaders(origin)).forEach(([key, value]) => context.header(key, value));
    }
    if (context.req.method === "OPTIONS") {
      if (!rawOrigin) return context.json({ error: "Origin is required" }, 403);
      if (new URL(context.req.url).pathname === "/v1/gifts") return context.body(null, 204);
    }
    await next();
  });
  app.get("/health", (context) => context.json({ ok: true }));
  app.get("/v1/gifts", async (context) => {
    const key = context.req.header("Origin") ?? "originless";
    if (!(await rateLimit(key))) return context.json({ error: "Too many requests" }, 429);
    const input = parseGiftQuery(new URL(context.req.url).searchParams);
    if (!input) return context.json({ error: "recipient, budget, and occasion must use course values" }, 400);
    return context.json({ items: recommendGifts(input) });
  });
  return app;
}

export default { async fetch(request: Request, env: Env): Promise<Response> {
  return createApp({ rateLimit: async (key) => (await env.GIFT_RATE_LIMITER.limit({ key })).success }).fetch(request);
} } satisfies ExportedHandler<Env>;
