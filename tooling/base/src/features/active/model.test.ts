import { describe, expect, it } from "vitest";
import {
  BOX_COUNT,
  drawAmount,
  emptyState,
  isGiftState,
  openBox,
  progress,
} from "./model";

describe("gift draw", () => {
  it("draws only 1, 2 or 3 won", () => {
    expect(drawAmount(0)).toBe(1);
    expect(drawAmount(0.34)).toBe(2);
    expect(drawAmount(0.99)).toBe(3);
    expect(drawAmount(1)).toBe(3);
    expect(drawAmount(-1)).toBe(1);
  });

  it("accumulates opened boxes and ignores a second open", () => {
    const first = openBox(emptyState(), 4, 2);
    const second = openBox(first, 4, 3);
    expect(first.total).toBe(2);
    expect(second).toBe(first);
    expect(openBox(first, BOX_COUNT, 1)).toBe(first);
  });

  it("reports progress until all boxes are open", () => {
    let state = emptyState();
    expect(progress(state)).toEqual({ opened: 0, remaining: 9, finished: false });
    for (let index = 0; index < BOX_COUNT; index += 1)
      state = openBox(state, index, 1);
    expect(progress(state)).toEqual({ opened: 9, remaining: 0, finished: true });
    expect(state.total).toBe(9);
  });

  it("rejects broken saved state", () => {
    expect(isGiftState(emptyState())).toBe(true);
    expect(isGiftState({ opened: [{ index: 0, won: 2 }], total: 2 })).toBe(true);
    expect(isGiftState(null)).toBe(false);
    expect(isGiftState({ opened: "x", total: 0 })).toBe(false);
    expect(isGiftState({ opened: [{ index: 12, won: 2 }], total: 2 })).toBe(false);
    expect(isGiftState({ opened: [], total: "0" })).toBe(false);
  });
});
