import { describe, expect, it } from "vitest";
import { createApp } from "../src/index";

const allowed = "http://localhost:5173";
const url = "https://api.test/v1/gifts?recipient=friend&budget=under-30000&occasion=birthday";

describe("gift HTTP API", () => {
  it("returns health and allows originless server calls without CORS headers", async () => {
    const response = await createApp().request("https://api.test/health");
    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
    expect(response.headers.get("vary")).toBe("Origin");
  });
  it("returns 204 for an allowed preflight", async () => {
    const response = await createApp().request(url, { method: "OPTIONS", headers: { Origin: allowed } });
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe(allowed);
    expect(response.headers.get("vary")).toBe("Origin");
  });
  it("rejects originless and wrong-path preflights without bypassing routing", async () => {
    expect((await createApp().request(url, { method: "OPTIONS" })).status).toBe(403);
    expect((await createApp().request("https://api.test/health", { method: "OPTIONS", headers: { Origin: allowed } })).status).toBe(404);
  });
  it("rejects explicit disallowed origins and malformed queries", async () => {
    expect((await createApp().request(url, { headers: { Origin: "https://evil.test" } })).status).toBe(403);
    expect((await createApp().request("https://api.test/v1/gifts?recipient=friend", { headers: { Origin: allowed } })).status).toBe(400);
  });
  it("returns 429 when the origin key has exceeded its limit", async () => {
    const app = createApp({ limit: 1 });
    expect((await app.request(url, { headers: { Origin: allowed } })).status).toBe(200);
    expect((await app.request(url, { headers: { Origin: allowed } })).status).toBe(429);
  });
  it("applies the rate limit before malformed query parsing", async () => {
    const app = createApp({ rateLimit: async () => false });
    expect((await app.request("https://api.test/v1/gifts?recipient=bad", { headers: { Origin: allowed } })).status).toBe(429);
  });
  it("uses the rate limiter binding in the default Worker handler", async () => {
    const module = (await import("../src/index")).default;
    const response = await module.fetch(new Request(url, { headers: { Origin: allowed } }), {
      GIFT_RATE_LIMITER: { limit: async ({ key }) => ({ success: key === allowed }) },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("vary")).toBe("Origin");
    const body = (await response.json()) as { items: unknown[] };
    expect(body.items[0]).toMatchObject({ id: expect.any(String), name: expect.any(String), reason: expect.any(String), priceRange: expect.any(String), emoji: expect.any(String) });
  });
});
