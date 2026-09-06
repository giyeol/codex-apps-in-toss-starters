type StorageLike = Pick<Storage, "getItem" | "setItem">;
const alwaysValid = <T>(value: unknown): value is T => value === value;

export function createJsonStorage(storage: StorageLike | null) {
  return {
    read<T>(
      key: string,
      fallback: T,
      isValid: (value: unknown) => value is T = alwaysValid,
    ): T {
      try {
        const raw = storage?.getItem(key);
        if (raw == null) return fallback;
        const value: unknown = JSON.parse(raw);
        return isValid(value) ? value : fallback;
      } catch {
        return fallback;
      }
    },
    write<T>(key: string, value: T): boolean {
      if (storage == null) return false;
      try {
        storage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
  };
}

function browserStorage(): StorageLike | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export const jsonStorage = createJsonStorage(browserStorage());
