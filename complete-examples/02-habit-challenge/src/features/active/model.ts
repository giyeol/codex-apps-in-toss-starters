export type CheckIn = { date: string; done: boolean; memo: string };
export type HabitState = { habit: string; records: CheckIn[] };
const DATE = /^\d{4}-\d{2}-\d{2}$/;
export const validHabitName = (value: string) => value.trim().length > 0 && value.trim().length <= 80;

export const validHabitState = (value: unknown): value is HabitState => {
  if (!value || typeof value !== "object") return false;
  const state = value as HabitState;
  return (
    typeof state.habit === "string" &&
    validHabitName(state.habit) &&
    Array.isArray(state.records) &&
    state.records.length <= 7 &&
    state.records.every(
      (record) =>
        record &&
        typeof record === "object" &&
        DATE.test(record.date) &&
        typeof record.done === "boolean" &&
        typeof record.memo === "string" &&
        record.memo.length <= 80,
    )
  );
};

export function upsertCheckIn(items: CheckIn[], item: CheckIn) {
  return [...items.filter((record) => record.date !== item.date), item]
    .sort((left, right) => left.date.localeCompare(right.date))
    .slice(-7);
}
function previousDate(date: string) {
  const cursor = new Date(`${date}T12:00:00`);
  cursor.setDate(cursor.getDate() - 1);
  return localDate(cursor);
}
export function streak(items: CheckIn[], anchor = localDate()) {
  const records = new Map(items.filter((item) => item.date <= anchor).map((item) => [item.date, item.done]));
  let cursor = records.has(anchor) ? anchor : previousDate(anchor);
  if (records.get(cursor) !== true) return 0;
  let count = 0;
  while (records.get(cursor) === true) {
    count += 1;
    cursor = previousDate(cursor);
  }
  return count;
}
export function exampleCheckIns(anchor = localDate()): CheckIn[] {
  return [2, 1, 0].map((daysAgo) => {
    let date = anchor;
    for (let index = 0; index < daysAgo; index += 1) date = previousDate(date);
    return { date, done: true, memo: "예시 달성" };
  });
}
export function localDate(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}
