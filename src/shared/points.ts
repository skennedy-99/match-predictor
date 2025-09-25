export function computePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number | null,
  actualAway: number | null
): number {
  if (actualHome == null || actualAway == null) return 0;
  const exact = predictedHome === actualHome && predictedAway === actualAway;
  if (exact) return 3;
  const predictedOutcome = Math.sign(predictedHome - predictedAway);
  const actualOutcome = Math.sign(actualHome - actualAway);
  const isDrawPred = predictedHome === predictedAway;
  const isDrawActual = actualHome === actualAway;
  const outcomeMatch = (isDrawPred && isDrawActual) || predictedOutcome === actualOutcome;
  return outcomeMatch ? 1 : 0;
}


