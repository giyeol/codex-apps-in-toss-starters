export const recipients = ["friend", "family", "colleague"] as const;
export const budgets = ["under-30000", "30000-50000", "over-50000"] as const;
export const occasions = ["birthday", "thanks", "housewarming"] as const;

export type GiftInput = { recipient: (typeof recipients)[number]; budget: (typeof budgets)[number]; occasion: (typeof occasions)[number] };
export type Gift = { id: string; name: string; reason: string; priceRange: string; emoji: string; recipients: readonly GiftInput["recipient"][]; budgets: readonly GiftInput["budget"][]; occasions: readonly GiftInput["occasion"][] };
export type PublicGift = Pick<Gift, "id" | "name" | "reason" | "priceRange" | "emoji">;
