import { describe, expect, it } from "vitest";
import { tossfaceSrc } from "./tossface";

describe("tossfaceSrc", () => {
  it("maps semantic names to local assets", () => {
    expect(tossfaceSrc("gift")).toBe("/tossface/gift.svg");
    expect(tossfaceSrc("compass")).toBe("/tossface/compass.svg");
  });
});
