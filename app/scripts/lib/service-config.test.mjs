import { expect, test } from "vitest";
import { canApplySetup, validateServiceConfig } from "./service-config.mjs";
const valid = {
  appName: "my-course-app",
  displayName: "나의 미니앱",
  primaryColor: "#3182F6",
  configuredForQr: true,
};
test("accepts a complete course config", () =>
  expect(validateServiceConfig(valid)).toEqual([]));
test("rejects mismatched basic values", () =>
  expect(
    validateServiceConfig({ ...valid, appName: "", primaryColor: "blue" }),
  ).toEqual([
    "appName을 입력해 주세요.",
    "primaryColor는 #RRGGBB 형식이어야 해요.",
  ]));
test("allows only the same configured non-demo app name", () => {
  expect(
    canApplySetup({
      candidateAppName: "my-course-app",
      currentAppName: "my-course-app",
      configuredForQr: true,
    }),
  ).toBe(true);
  expect(
    canApplySetup({
      candidateAppName: "another-course-app",
      currentAppName: "my-course-app",
      configuredForQr: true,
    }),
  ).toBe(false);
  expect(
    canApplySetup({
      candidateAppName: "course-gift-draw",
      currentAppName: "my-course-app",
      configuredForQr: true,
    }),
  ).toBe(false);
  expect(
    canApplySetup({
      candidateAppName: "course-gift-draw",
      currentAppName: "course-gift-draw",
      configuredForQr: false,
    }),
  ).toBe(false);
  expect(
    canApplySetup({
      candidateAppName: "course-legitimate-console-name",
      currentAppName: "course-gift-draw",
      configuredForQr: false,
    }),
  ).toBe(true);
});
