import { describe, expect, it } from "vitest";
import { filterActivities, freeFirst, toggleSaved } from "./model";

const items = [
  {
    id: "a",
    name: "A",
    category: "실내",
    description: "",
    area: "동네",
    duration: "1시간",
    free: false,
  },
  {
    id: "b",
    name: "B",
    category: "야외",
    description: "",
    area: "공원",
    duration: "2시간",
    free: true,
  },
];
describe("activities", () =>
  it("filters, saves, and puts free activities first", () => {
    expect(filterActivities(items, "실내")).toEqual([items[0]]);
    expect(filterActivities(items, "전체")).toEqual(items);
    expect(toggleSaved([], "a")).toEqual(["a"]);
    expect(toggleSaved(["a"], "a")).toEqual([]);
    expect(freeFirst(items).map((item) => item.id)).toEqual(["b", "a"]);
  }));
