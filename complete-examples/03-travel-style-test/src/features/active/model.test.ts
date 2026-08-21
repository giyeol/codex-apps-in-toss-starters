import { describe, expect, it } from "vitest";
import { results } from "../../content/quiz";
import { resolveResult } from "./model";

describe("travel", () =>
  it("maps UI-reachable scores across all result bands", () => {
    expect(resolveResult([0, 0, 0, 0, 0, 0], results).id).toBe("explorer");
    expect(resolveResult([1, 1, 1, 1, 1, 1], results).id).toBe("balance");
    expect(resolveResult([3, 3, 3, 3, 3, 3], results).id).toBe("planner");
  }));
