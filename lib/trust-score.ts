export const TRUST_SCORE_MIN = 1;
export const TRUST_SCORE_MAX = 100;

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export function scoreToRiskLevel(
  score: number | null | undefined
): RiskLevel | null {
  if (score == null) return null;
  if (score >= 67) return "LOW";
  if (score >= 34) return "MEDIUM";
  return "HIGH";
}
