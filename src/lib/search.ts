export interface Entry {
  title: string;
  /** Shown beside the title, e.g. "Case study" or "Live demo". */
  kind: string;
  href: string;
  /** Extra words that should find this entry, such as its stack. */
  keywords?: string[];
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");

/**
 * Every word typed must appear somewhere in the entry. Matches at the start
 * of a title word rank above matches in keywords, so "fhir" lists the FHIR
 * project before projects that only use FHIR.
 */
export function rank(entries: Entry[], query: string, limit = 12): Entry[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return entries.slice(0, limit);
  const scored: { entry: Entry; score: number; index: number }[] = [];
  entries.forEach((entry, index) => {
    const title = normalize(entry.title);
    const titleWords = title.split(/[^a-z0-9]+/);
    const rest = normalize([entry.kind, ...(entry.keywords ?? [])].join(" "));
    let score = 0;
    for (const w of words) {
      if (titleWords.some((t) => t.startsWith(w))) score += 3;
      else if (title.includes(w)) score += 2;
      else if (rest.includes(w)) score += 1;
      else return;
    }
    scored.push({ entry, score, index });
  });
  return scored
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((s) => s.entry);
}
