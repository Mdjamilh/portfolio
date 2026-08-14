/** Whether a project row should be visible for the chosen domain and typed filter. */
export function matchesFilter(row: { domain: string; text: string }, domain: string, query: string): boolean {
  if (domain && row.domain !== domain) return false;
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return words.every((w) => row.text.includes(w));
}
