const TOKEN_PATTERN =
  /(?:\{\{COURSE_([A-Z0-9_]+)\}\}|__COURSE_([A-Z0-9_]+)__|\*\*COURSE_([A-Z0-9_]+)\*\*)/g;

function tokenKey(match) {
  return match[1] ?? match[2] ?? match[3];
}

export function unresolvedCourseTokens(source) {
  return [...source.matchAll(TOKEN_PATTERN)].map(tokenKey);
}

export function renderText(source, values) {
  const rendered = source.replace(
    TOKEN_PATTERN,
    (_, braced, underscored, bold) => {
      const key = braced ?? underscored ?? bold;
      if (!(key in values))
        throw new Error("Unresolved template token: " + key);
      return String(values[key]);
    },
  );
  const unresolved = unresolvedCourseTokens(rendered)[0];
  if (unresolved != null)
    throw new Error("Unresolved template token: " + unresolved);
  return rendered;
}
