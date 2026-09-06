/**
 * Repository facts read from the GitHub API once, at build time, so visitors
 * never hit rate limits and the figures on the page are real. Any failure
 * falls back to "unknown" rather than breaking the build.
 */
export interface RepoFacts {
  commits: number | null;
  language: string | null;
  pushedAt: string | null;
}

const API = "https://api.github.com";

/** GitHub reports the number of pages in the Link header; with per_page=1 that is the commit count. */
export function lastPage(link: string | null): number | null {
  if (!link) return null;
  for (const part of link.split(",")) {
    const match = /<([^>]+)>;\s*rel="last"/.exec(part);
    if (match) {
      const page = new URL(match[1]!).searchParams.get("page");
      return page ? Number(page) : null;
    }
  }
  return null;
}

type Fetch = typeof fetch;

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return { Accept: "application/vnd.github+json", "User-Agent": "portfolio-build", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

async function commitCount(user: string, repo: string, fetcher: Fetch): Promise<number | null> {
  const res = await fetcher(`${API}/repos/${user}/${repo}/commits?per_page=1`, { headers: headers() });
  if (!res.ok) return null;
  const pages = lastPage(res.headers.get("link"));
  if (pages !== null) return pages;
  // No Link header means everything fit on one page.
  const body = (await res.json()) as unknown[];
  return Array.isArray(body) ? body.length : null;
}

export async function repoFacts(user: string, repos: string[], fetcher: Fetch = fetch): Promise<Map<string, RepoFacts>> {
  const facts = new Map<string, RepoFacts>(repos.map((r) => [r, { commits: null, language: null, pushedAt: null }]));
  try {
    const res = await fetcher(`${API}/users/${user}/repos?per_page=100&type=owner`, { headers: headers() });
    if (res.ok) {
      for (const r of (await res.json()) as { name: string; language: string | null; pushed_at: string }[]) {
        const known = facts.get(r.name);
        if (known) Object.assign(known, { language: r.language, pushedAt: r.pushed_at });
      }
    }
    await Promise.all(
      repos.map(async (r) => {
        facts.get(r)!.commits = await commitCount(user, r, fetcher).catch(() => null);
      }),
    );
  } catch {
    // Offline build: the page simply omits the figures.
  }
  return facts;
}

/** Totals for the summary panel; unknown values are left out rather than counted as zero. */
export function totals(facts: Map<string, RepoFacts>) {
  const known = [...facts.values()].filter((f) => f.commits !== null);
  return {
    repositories: facts.size,
    commits: known.length ? known.reduce((sum, f) => sum + (f.commits ?? 0), 0) : null,
    complete: known.length === facts.size,
  };
}

export function monthYear(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

/** Fills anything the API couldn't answer from the last saved snapshot. */
export function withSnapshot(facts: Map<string, RepoFacts>, snapshot: Record<string, RepoFacts>): Map<string, RepoFacts> {
  for (const [repo, f] of facts) {
    const saved = snapshot[repo];
    if (!saved) continue;
    facts.set(repo, {
      commits: f.commits ?? saved.commits,
      language: f.language ?? saved.language,
      pushedAt: f.pushedAt ?? saved.pushedAt,
    });
  }
  return facts;
}

let shared: Promise<Map<string, RepoFacts>> | undefined;

/** One request set per build, shared by every page that shows figures. */
export function buildFacts(user: string, repos: string[]): Promise<Map<string, RepoFacts>> {
  shared ??= Promise.all([repoFacts(user, repos), import("../data/snapshot.json").then((m) => m.default as Record<string, RepoFacts>)]).then(([facts, snapshot]) =>
    withSnapshot(facts, snapshot),
  );
  return shared;
}
