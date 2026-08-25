import { describe, expect, it } from "vitest";
import {
  exampleCheckIns,
  streak,
  upsertCheckIn,
  validHabitState,
} from "./model";
describe("habit", () =>
  it("keeps one record per date and counts a streak", () => {
    const first = upsertCheckIn([], {
      date: "2026-09-19",
      done: true,
      memo: "10분 걷기",
    });
    expect(
      upsertCheckIn(first, { date: "2026-09-19", done: false, memo: "" }),
    ).toEqual([{ date: "2026-09-19", done: false, memo: "" }]);
    expect(
      streak(
        [
          { date: "2026-09-17", done: true, memo: "" },
          { date: "2026-09-18", done: true, memo: "" },
          { date: "2026-09-19", done: true, memo: "" },
        ],
        "2026-09-19",
      ),
    ).toBe(3);
    expect(
      streak(
        [
          { date: "2026-09-18", done: true, memo: "" },
          { date: "2026-09-19", done: false, memo: "" },
        ],
        "2026-09-19",
      ),
    ).toBe(0);
    expect(
      streak([{ date: "2026-09-18", done: true, memo: "" }], "2026-09-19"),
    ).toBe(1);
    expect(
      streak([{ date: "2026-09-20", done: true, memo: "" }], "2026-09-19"),
    ).toBe(0);
    expect(exampleCheckIns("2026-09-19").map((item) => item.date)).toEqual([
      "2026-09-17",
      "2026-09-18",
      "2026-09-19",
    ]);
  }));

it("rejects malformed or oversized persisted records", () => {
  expect(
    validHabitState({
      habit: "걷기",
      records: [{ date: "today", done: true, memo: "" }],
    }),
  ).toBe(false);
  expect(
    validHabitState({
      habit: "걷기",
      records: Array.from({ length: 8 }, () => ({
        date: "2026-09-19",
        done: true,
        memo: "",
      })),
    }),
  ).toBe(false);
});

it("accepts known optional moods and rejects unknown moods", () => {
  expect(
    validHabitState({
      habit: "10분 걷기",
      records: [
        {
          date: "2026-09-19",
          done: true,
          memo: "좋았어요",
          mood: "proud",
        },
      ],
    }),
  ).toBe(true);
  expect(
    validHabitState({
      habit: "10분 걷기",
      records: [
        {
          date: "2026-09-19",
          done: true,
          memo: "",
          mood: "unknown",
        },
      ],
    }),
  ).toBe(false);
});
