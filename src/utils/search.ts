export function normalize(s: string) {
  return s.toLowerCase().trim();
}

export function parseQuery(q: string) {
  return normalize(q).split(/\s+/).filter(Boolean);
}

export function matchesIssue(issue: any, query: string) {
  const terms = parseQuery(query);
  if (terms.length === 0) return true;

  const title = normalize(issue.title ?? '');
  const tags: string[] = Array.isArray((issue as any).tags)
    ? (issue as any).tags
    : [];
  const tagStrs = tags.map(normalize);

  return terms.every(
    (t) => title.includes(t) || tagStrs.some((tag) => tag.includes(t))
  );
}

// Assignee/Severity filter (OR logic between the two filters)
// - If only assignee set: match by assignee
// - If only severity set: match by severity
// - If both set: match if assignee OR severity matches
// - If neither set: pass
export function matchesAssigneeOrSeverity(
  issue: any,
  assignee: string,
  severity: number | null
) {
  const hasAssignee = !!assignee;
  const hasSeverity = typeof severity === 'number';

  if (!hasAssignee && !hasSeverity) return true;

  const assigneeMatches = hasAssignee
    ? normalize(issue.assignee ?? '') === normalize(assignee)
    : false;

  const severityMatches = hasSeverity
    ? Number(issue.severity) === severity
    : false;

  return hasAssignee && hasSeverity
    ? assigneeMatches || severityMatches
    : assigneeMatches || severityMatches;
}
