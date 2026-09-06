export const BOX_COUNT = 9;
export const AD_DELAY_MS = 2_000;
export const MIN_WON = 1;
export const MAX_WON = 3;

export type OpenedBox = { index: number; won: number };
export type GiftState = { opened: OpenedBox[]; total: number };

export function emptyState(): GiftState {
  return { opened: [], total: 0 };
}

function isOpenedBox(value: unknown): value is OpenedBox {
  if (!value || typeof value !== "object") return false;
  const box = value as { index?: unknown; won?: unknown };
  return (
    Number.isInteger(box.index) &&
    (box.index as number) >= 0 &&
    (box.index as number) < BOX_COUNT &&
    typeof box.won === "number" &&
    Number.isFinite(box.won)
  );
}

export function isGiftState(value: unknown): value is GiftState {
  if (!value || typeof value !== "object") return false;
  const state = value as { opened?: unknown; total?: unknown };
  return (
    Array.isArray(state.opened) &&
    state.opened.every(isOpenedBox) &&
    typeof state.total === "number" &&
    Number.isFinite(state.total)
  );
}

/** 0 이상 1 미만의 난수를 1~3원으로 바꿔요. */
export function drawAmount(random: number): number {
  const unit = Math.min(Math.max(random, 0), 0.999_999);
  return MIN_WON + Math.floor(unit * (MAX_WON - MIN_WON + 1));
}

export function isOpened(state: GiftState, index: number): boolean {
  return state.opened.some((box) => box.index === index);
}

export function openBox(state: GiftState, index: number, won: number): GiftState {
  if (index < 0 || index >= BOX_COUNT || isOpened(state, index)) return state;
  return {
    opened: [...state.opened, { index, won }],
    total: state.total + won,
  };
}

export function progress(state: GiftState) {
  const opened = state.opened.length;
  return {
    opened,
    remaining: BOX_COUNT - opened,
    finished: opened >= BOX_COUNT,
  };
}
