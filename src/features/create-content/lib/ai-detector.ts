const HUMAN_SCORE_THRESHOLD = 70;

export type AiDetectionResult = {
  humanScore: number;
  passed: boolean;
  status: "published" | "pending_review";
};

/**
 * MVP mock: deterministic score from content length and title entropy.
 * Replace with a real AI detection service in production.
 */
export function runAiDetection(
  content: string,
  title: string
): AiDetectionResult {
  const seed = (content.length + title.length * 3) % 100;
  const humanScore = Math.min(95, Math.max(35, 45 + seed));

  const passed = humanScore >= HUMAN_SCORE_THRESHOLD;

  return {
    humanScore,
    passed,
    status: passed ? "published" : "pending_review",
  };
}

export { HUMAN_SCORE_THRESHOLD };
