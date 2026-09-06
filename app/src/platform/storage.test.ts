import { describe, expect, it } from "vitest";
import { createJsonStorage } from "./storage";
describe("createJsonStorage", () => {
  it("returns fallback when JSON is broken or wrong shape", () => {
    const memory = new Map<string, string>([
      ["key", "{broken"],
      ["wrong", "[]"],
    ]);
    const storage = createJsonStorage({
      getItem: (k) => memory.get(k) ?? null,
      setItem: (k, v) => memory.set(k, v),
    });
    expect(storage.read("key", { count: 0 })).toEqual({ count: 0 });
    expect(
      storage.read("wrong", { count: 0 }, (value): value is { count: number } =>
        Boolean(
          value &&
          typeof value === "object" &&
          typeof (value as { count?: unknown }).count === "number",
        ),
      ),
    ).toEqual({ count: 0 });
  });
  it("does not throw when storage is unavailable", () => {
    expect(createJsonStorage(null).write("key", { count: 2 })).toBe(false);
  });
  it("round-trips JSON through storage", () => {
    const memory = new Map<string, string>();
    const storage = createJsonStorage({
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => memory.set(key, value),
    });
    expect(storage.write("state", { count: 2 })).toBe(true);
    expect(storage.read("state", { count: 0 })).toEqual({ count: 2 });
  });
});
