import { describe, expect, it } from "vitest";
import { parseGiftQuery, recommendGifts } from "../src/recommend";

describe("gift recommendation domain", () => {
  const query = new URLSearchParams({ recipient: "friend", budget: "under-30000", occasion: "birthday" });

  it("accepts only the course option values", () => {
    expect(parseGiftQuery(query)).toEqual({ recipient: "friend", budget: "under-30000", occasion: "birthday" });
    expect(parseGiftQuery(new URLSearchParams({ recipient: "coworker", budget: "under-30000", occasion: "birthday" }))).toBeNull();
  });

  it("returns three deterministic public gift fields", () => {
    const items = recommendGifts({ recipient: "friend", budget: "under-30000", occasion: "birthday" });
    expect(items).toHaveLength(3);
    expect(recommendGifts({ recipient: "friend", budget: "under-30000", occasion: "birthday" })).toEqual(items);
    expect(items[0]).toMatchObject({ id: expect.any(String), name: expect.any(String), reason: expect.any(String), priceRange: expect.any(String), emoji: expect.any(String) });
  });
  it("changes the exact recommendation ID order for different valid inputs", () => {
    const friendBirthday = recommendGifts({ recipient: "friend", budget: "under-30000", occasion: "birthday" }).map((gift) => gift.id);
    const familyHousewarming = recommendGifts({ recipient: "family", budget: "over-50000", occasion: "housewarming" }).map((gift) => gift.id);
    expect(friendBirthday).toEqual(["dessert", "tea", "tumbler"]);
    expect(familyHousewarming).toEqual(["plant", "towel", "tumbler"]);
  });
});
