import type { Activity } from "../../content/activities";

export function filterActivities(items: Activity[], category: string) {
  return category === "전체"
    ? items
    : items.filter((item) => item.category === category);
}
export function toggleSaved(savedIds: string[], id: string) {
  return savedIds.includes(id)
    ? savedIds.filter((savedId) => savedId !== id)
    : [...savedIds, id];
}
export function freeFirst(items: Activity[]) {
  return [...items].sort(
    (left, right) => Number(Boolean(right.free)) - Number(Boolean(left.free)),
  );
}
