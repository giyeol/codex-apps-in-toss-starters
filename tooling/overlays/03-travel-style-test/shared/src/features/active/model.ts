export type Result = {
  id: string;
  min: number;
  max: number;
  name?: string;
  description?: string;
  keywords?: string[];
  note?: string;
};
export function resolveResult(answers: number[], results: Result[]) {
  const total = answers.reduce((sum, x) => sum + x, 0);
  const matches = results.filter((x) => total >= x.min && total <= x.max);
  if (matches.length !== 1)
    throw new Error("Result range must match exactly one result");
  return matches[0];
}
