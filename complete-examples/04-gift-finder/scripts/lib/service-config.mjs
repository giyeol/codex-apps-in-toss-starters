const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

export function canApplySetup({
  candidateAppName,
  currentAppName,
  configuredForQr,
}) {
  if (typeof candidateAppName !== "string" || candidateAppName.trim() === "")
    return false;
  const candidate = candidateAppName.trim();
  const current =
    typeof currentAppName === "string" ? currentAppName.trim() : "";
  if (!configuredForQr && candidate === current) return false;
  return configuredForQr === true
    ? candidate === current
    : candidate !== current;
}
export function validateServiceConfig(value) {
  const errors = [];
  if (!value || typeof value !== "object")
    return ["service.config.json은 객체여야 해요."];
  if (typeof value.appName !== "string" || value.appName.trim() === "")
    errors.push("appName을 입력해 주세요.");
  if (typeof value.displayName !== "string" || value.displayName.trim() === "")
    errors.push("displayName을 입력해 주세요.");
  if (
    typeof value.primaryColor !== "string" ||
    !HEX_COLOR.test(value.primaryColor)
  )
    errors.push("primaryColor는 #RRGGBB 형식이어야 해요.");
  if (value.giftApiUrl !== null) {
    try {
      const url = new URL(value.giftApiUrl);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error();
    } catch {
      errors.push("giftApiUrl은 사용자 정보가 없는 HTTPS 주소여야 해요.");
    }
  }
  return errors;
}
