import type { Gift } from "../../content/fallback-gifts";

export const recipients = ["friend", "family", "colleague"] as const;
export const budgets = ["under-30000", "30000-50000", "over-50000"] as const;
export const occasions = ["birthday", "thanks", "housewarming"] as const;
export type GiftInput = {
  recipient: (typeof recipients)[number];
  budget: (typeof budgets)[number];
  occasion: (typeof occasions)[number];
};
export const giftSteps = [
  "recipient",
  "budget",
  "occasion",
  "review",
  "results",
] as const;
export type GiftStep = (typeof giftSteps)[number];

export function nextGiftStep(step: GiftStep): GiftStep {
  return giftSteps[Math.min(giftSteps.indexOf(step) + 1, giftSteps.length - 1)];
}

export function previousGiftStep(step: GiftStep): GiftStep {
  return giftSteps[Math.max(giftSteps.indexOf(step) - 1, 0)];
}
type GiftResult = { items: Gift[]; source: "mock-api" | "local-fallback" };
type Options = {
  apiUrl: string | null;
  fetcher?: typeof fetch;
  fallback: Gift[];
  timeoutMs?: number;
};

export function localRecommendations(input: GiftInput, fallback: Gift[]) {
  return [...fallback]
    .map((gift, index) => ({
      gift,
      index,
      score:
        (gift.recipients?.includes(input.recipient) ? 4 : 0) +
        (gift.budgets?.includes(input.budget) ? 6 : 0) +
        (gift.occasions?.includes(input.occasion) ? 3 : 0),
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ gift }) => gift)
    .slice(0, 3);
}
function isGift(value: unknown): value is Gift {
  return Boolean(
    value &&
    typeof value === "object" &&
    ["id", "name", "reason", "priceRange", "emoji"].every(
      (key) => typeof (value as Record<string, unknown>)[key] === "string",
    ),
  );
}
export async function findGifts(
  input: GiftInput,
  { apiUrl, fetcher = fetch, fallback, timeoutMs = 5_000 }: Options,
): Promise<GiftResult> {
  const local = localRecommendations(input, fallback);
  if (apiUrl === null) return { items: local, source: "local-fallback" };
  let url: URL;
  try {
    url = new URL(apiUrl);
    if (url.protocol !== "https:" || url.username || url.password)
      throw new Error();
  } catch {
    throw new Error("사용자 정보가 없는 HTTPS API 주소가 아니에요.");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    Object.entries(input).forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );
    const response = await fetcher(url, { signal: controller.signal });
    const data: unknown = await response.json();
    if (
      !response.ok ||
      !data ||
      typeof data !== "object" ||
      !Array.isArray((data as { items?: unknown }).items) ||
      !(data as { items: unknown[] }).items.every(isGift)
    )
      throw new Error("추천 응답 형식이 올바르지 않아요.");
    return { items: (data as { items: Gift[] }).items, source: "mock-api" };
  } finally {
    clearTimeout(timer);
  }
}
