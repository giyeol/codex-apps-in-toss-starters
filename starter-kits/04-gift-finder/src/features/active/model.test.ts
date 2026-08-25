import { describe, expect, it, vi } from "vitest";
import { fallbackGifts } from "../../content/fallback-gifts";
import {
  findGifts,
  localRecommendations,
  nextGiftStep,
  previousGiftStep,
  type GiftInput,
} from "./model";

describe("gifts", () => {
  const input: GiftInput = {
    recipient: "friend",
    budget: "under-30000",
    occasion: "birthday",
  };
  it("uses condition-sensitive local fallback when API is absent", async () => {
    const items = localRecommendations(input, fallbackGifts);
    await expect(
      findGifts(input, {
        apiUrl: null,
        fetcher: vi.fn(),
        fallback: fallbackGifts,
      }),
    ).resolves.toEqual({ items, source: "local-fallback" });
  });
  it("ranks fallback results differently for every learner-selected condition", () => {
    const friend = localRecommendations(input, fallbackGifts);
    const family = localRecommendations(
      { ...input, recipient: "family" },
      fallbackGifts,
    );
    const budget = localRecommendations(
      { ...input, budget: "over-50000" },
      fallbackGifts,
    );
    const occasion = localRecommendations(
      { ...input, occasion: "housewarming" },
      fallbackGifts,
    );
    expect(friend.map((gift) => gift.id)).not.toEqual(
      family.map((gift) => gift.id),
    );
    expect(friend.map((gift) => gift.id)).not.toEqual(
      budget.map((gift) => gift.id),
    );
    expect(friend.map((gift) => gift.id)).not.toEqual(
      occasion.map((gift) => gift.id),
    );
    expect(friend[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      reason: expect.any(String),
      priceRange: expect.any(String),
      emoji: expect.any(String),
    });
  });
  it("uses recipient, budget, and occasion metadata instead of display copy", () => {
    expect(
      localRecommendations(input, fallbackGifts).map((gift) => gift.id),
    ).toEqual(["dessert", "tea", "towel"]);
    expect(
      localRecommendations(
        {
          recipient: "family",
          budget: "over-50000",
          occasion: "housewarming",
        },
        fallbackGifts,
      ).map((gift) => gift.id),
    ).toEqual(["tumbler", "plant", "towel"]);
  });
  it("rejects malformed configured API responses", async () => {
    await expect(
      findGifts(input, {
        apiUrl: "https://example.test/gifts",
        fallback: fallbackGifts,
        fetcher: vi
          .fn()
          .mockResolvedValue({ ok: true, json: async () => ({ items: [{}] }) }),
      }),
    ).rejects.toThrow("추천 응답 형식");
  });
  it("uses a configured API response with the same public gift contract", async () => {
    const item = fallbackGifts[0];
    await expect(
      findGifts(input, {
        apiUrl: "https://api.example.test/v1/gifts",
        fallback: fallbackGifts,
        fetcher: vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ items: [item] }),
        }),
      }),
    ).resolves.toEqual({ items: [item], source: "mock-api" });
  });
  it("aborts a configured API timeout without fake timers", async () => {
    const fetcher: typeof fetch = (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new DOMException("Timed out", "AbortError")),
        );
      });
    await expect(
      findGifts(input, {
        apiUrl: "https://api.example.test/v1/gifts",
        fallback: fallbackGifts,
        fetcher,
        timeoutMs: 1,
      }),
    ).rejects.toThrow("Timed out");
  });
});

it("advances through the three selections and review", () => {
  expect(nextGiftStep("recipient")).toBe("budget");
  expect(nextGiftStep("budget")).toBe("occasion");
  expect(nextGiftStep("occasion")).toBe("review");
  expect(nextGiftStep("review")).toBe("results");
  expect(previousGiftStep("review")).toBe("occasion");
});
