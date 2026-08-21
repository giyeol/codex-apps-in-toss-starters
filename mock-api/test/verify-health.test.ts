import { describe, expect, it } from "vitest";
// @ts-expect-error The Worker workflow executes this JavaScript module directly.
import { verifyHealth } from "../scripts/verify-health.mjs";

describe("deployment health receipt", () => {
  it("accepts a credential-free HTTPS deployment and emits a health receipt", async () => {
    const receipt = await verifyHealth({
      deploymentUrl: "https://course.example.workers.dev/",
      commitSha: "abc123",
      now: () => new Date("2026-08-21T00:00:00.000Z"),
      fetcher: async (_url: RequestInfo | URL) => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } }),
    });
    expect(receipt).toEqual({ commitSha: "abc123", deploymentUrl: "https://course.example.workers.dev", healthUrl: "https://course.example.workers.dev/health", giftsUrl: "https://course.example.workers.dev/v1/gifts", verifiedAt: "2026-08-21T00:00:00.000Z" });
  });
  it("fails closed for an absent, credentialed, or unhealthy deployment", async () => {
    await expect(verifyHealth({ deploymentUrl: "", commitSha: "abc", fetcher: fetch })).rejects.toThrow();
    await expect(verifyHealth({ deploymentUrl: "https://user" + ":pa" + "ss" + "@example.test", commitSha: "abc", fetcher: fetch })).rejects.toThrow();
    await expect(verifyHealth({ deploymentUrl: "https://example.test", commitSha: "abc", fetcher: async () => new Response("{}", { status: 200 }) })).rejects.toThrow();
  });
});
