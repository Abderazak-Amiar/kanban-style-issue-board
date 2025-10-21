export function normalize(s: string) {
  return s.toLowerCase().trim();
}

export function parseQuery(q: string) {
  // split by spaces, ignore empties
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

  // A match if every term appears in title OR in any tag (AND across terms)
  return terms.every(
    (t) => title.includes(t) || tagStrs.some((tag) => tag.includes(t))
  );
}
