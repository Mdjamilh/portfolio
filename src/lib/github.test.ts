import { describe, expect, it } from "vitest";

import { lastPage, monthYear, repoFacts, totals } from "./github";

const json = (body: unknown, init: ResponseInit = {}) => new Response(JSON.stringify(body), { status: 200, ...init });

describe("lastPage", () => {
  it("reads the last page number from a Link header", () => {
    const link = '<https://api.github.com/repositories/1/commits?per_page=1&page=2>; rel="next", <https://api.github.com/repositories/1/commits?per_page=1&page=57>; rel="last"';
    expect(lastPage(link)).toBe(57);
    expect(lastPage('<https://x.test/?page=2>; rel="next"')).toBeNull();
    expect(lastPage(null)).toBeNull();
  });
});

describe("repoFacts", () => {
  it("combines the repository list with per-repository commit counts", async () => {
    const fetcher = (async (url: string) => {
      if (url.includes("/users/u/repos")) return json([{ name: "a", language: "TypeScript", pushed_at: "2026-10-20T10:00:00Z" }, { name: "other", language: "Go", pushed_at: "" }]);
      if (url.includes("/repos/u/a/commits")) return json([{}], { headers: { link: '<https://api.github.com/x?per_page=1&page=44>; rel="last"' } });
      if (url.includes("/repos/u/b/commits")) return json([{}]);
      return json({}, { status: 404 });
    }) as typeof fetch;
    const facts = await repoFacts("u", ["a", "b"], fetcher);
    expect(facts.get("a")).toEqual({ commits: 44, language: "TypeScript", pushedAt: "2026-10-20T10:00:00Z" });
    expect(facts.get("b")).toEqual({ commits: 1, language: null, pushedAt: null });
    expect(facts.has("other")).toBe(false);
    expect(totals(facts)).toEqual({ repositories: 2, commits: 45, complete: true });
  });

  it("leaves figures unknown when GitHub is unreachable or rate limited", async () => {
    const offline = (async () => {
      throw new TypeError("fetch failed");
    }) as typeof fetch;
    const facts = await repoFacts("u", ["a"], offline);
    expect(facts.get("a")).toEqual({ commits: null, language: null, pushedAt: null });
    expect(totals(facts)).toEqual({ repositories: 1, commits: null, complete: false });

    const limited = (async () => json({ message: "API rate limit exceeded" }, { status: 403 })) as typeof fetch;
    expect((await repoFacts("u", ["a"], limited)).get("a")!.commits).toBeNull();
  });
});

describe("totals", () => {
  it("does not count unknown repositories as zero", () => {
    const facts = new Map([
      ["a", { commits: 40, language: null, pushedAt: null }],
      ["b", { commits: null, language: null, pushedAt: null }],
    ]);
    expect(totals(facts)).toEqual({ repositories: 2, commits: 40, complete: false });
  });
});

describe("monthYear", () => {
  it("formats in UTC so the month never shifts with the build machine's zone", () => {
    expect(monthYear("2026-10-31T23:30:00Z")).toBe("October 2026");
    expect(monthYear(null)).toBe("");
  });
});
