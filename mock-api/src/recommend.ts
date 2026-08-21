import { gifts } from "./data";
import { budgets, occasions, recipients, type GiftInput, type PublicGift } from "./types";

function includes<const T extends string>(values: readonly T[], value: string | null): value is T {
  return value !== null && (values as readonly string[]).includes(value);
}

export function parseGiftQuery(query: URLSearchParams): GiftInput | null {
  const recipient = query.get("recipient");
  const budget = query.get("budget");
  const occasion = query.get("occasion");
  if (!includes(recipients, recipient) || !includes(budgets, budget) || !includes(occasions, occasion)) return null;
  return { recipient, budget, occasion };
}

export function recommendGifts(input: GiftInput): PublicGift[] {
  return gifts.map((gift, index) => ({ gift, index, score: (gift.recipients.includes(input.recipient) ? 4 : 0) + (gift.budgets.includes(input.budget) ? 2 : 0) + (gift.occasions.includes(input.occasion) ? 3 : 0) }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, 3)
    .map(({ gift }) => ({ id: gift.id, name: gift.name, reason: gift.reason, priceRange: gift.priceRange, emoji: gift.emoji }));
}
