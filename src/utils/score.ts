export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function computeScore(
  severity: number,
  createdAt: string,
  userDefinedRank: number,
  now: Date = new Date()
) {
  const daysSinceCreated = Math.floor(
    (now.getTime() - new Date(createdAt).getTime()) / MS_PER_DAY
  );
  return severity * 10 + daysSinceCreated * -1 + userDefinedRank;
}

// Higher score first; on ties, newer createdAt first (fallback to updatedAt)
function ts(iso?: string) {
  return iso ? new Date(iso).getTime() : 0;
}
export function compareIssuesByScoreThenRecency(a: any, b: any) {
  const scoreA =
    typeof a.score === 'number'
      ? a.score
      : computeScore(a.severity, a.createdAt, a.userDefinedRank);
  const scoreB =
    typeof b.score === 'number'
      ? b.score
      : computeScore(b.severity, b.createdAt, b.userDefinedRank);

  const diff = scoreB - scoreA;
  if (diff !== 0) return diff;

  const aTime = ts(a.createdAt) || ts(a.updatedAt);
  const bTime = ts(b.createdAt) || ts(b.updatedAt);
  return bTime - aTime;
}
