import { readFileSync } from "node:fs";

import AxeBuilder from "@axe-core/playwright";
import { test as base, expect } from "@playwright/test";

/** The production CSP, read from vercel.json, so tests catch anything it would block. */
const vercel = JSON.parse(readFileSync("vercel.json", "utf8")) as { headers: { source: string; headers: { key: string; value: string }[] }[] };
const csp = vercel.headers.flatMap((h) => h.headers).find((h) => h.key === "Content-Security-Policy")!.value;

export const test = base.extend<{ problems: string[] }>({
  problems: async ({ page }, use) => {
    const problems: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") problems.push(m.text());
    });
    page.on("pageerror", (e) => problems.push(String(e)));
    if (!process.env.BASE_URL) {
      await page.route("**/*", async (route) => {
        const response = await route.fetch();
        await route.fulfill({ response, headers: { ...response.headers(), "content-security-policy": csp } });
      });
    }
    await use(problems);
    await page.unrouteAll({ behavior: "ignoreErrors" });
    expect(problems, "console errors or CSP violations").toEqual([]);
  },
});

export async function expectAccessible(page: import("@playwright/test").Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

export { expect };
