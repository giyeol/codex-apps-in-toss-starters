import { expect, test } from "vitest";
import { canApplySetup, validateServiceConfig } from "./service-config.mjs";
const valid = {
  appName: "my-course-app",
  displayName: "나의 미니앱",
  primaryColor: "#3182F6",
  configuredForQr: true,
  giftApiUrl: null,
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
test("rejects a non-HTTPS gift API URL", () =>
  expect(
    validateServiceConfig({ ...valid, giftApiUrl: "http://example.com" }),
  ).toEqual(["giftApiUrl은 사용자 정보가 없는 HTTPS 주소여야 해요."]));
test("rejects credentials in a configured gift API URL", () =>
  expect(
    validateServiceConfig({ ...valid, giftApiUrl: "https://user" + ":pass" + "@example.com" }),
  ).toEqual(["giftApiUrl은 사용자 정보가 없는 HTTPS 주소여야 해요."]));
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
      candidateAppName: "course-habit-challenge",
      currentAppName: "my-course-app",
      configuredForQr: true,
    }),
  ).toBe(false);
  expect(
    canApplySetup({
      candidateAppName: "course-habit-challenge",
      currentAppName: "course-habit-challenge",
      configuredForQr: false,
    }),
  ).toBe(false);
  expect(
    canApplySetup({
      candidateAppName: "course-legitimate-console-name",
      currentAppName: "course-habit-challenge",
      configuredForQr: false,
    }),
  ).toBe(true);
});
