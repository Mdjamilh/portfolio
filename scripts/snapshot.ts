/**
 * Saves the current GitHub figures to src/data/snapshot.json. Builds use the
 * snapshot for any repository the API can't answer for (for example when a
 * shared build machine is rate limited). Run: npm run snapshot
 */
import { writeFileSync } from "node:fs";

import { GITHUB_USER, projects } from "../src/data/projects";
import { repoFacts } from "../src/lib/github";

const facts = await repoFacts(
  GITHUB_USER,
  projects.map((p) => p.slug),
);
const missing = [...facts].filter(([, f]) => f.commits === null).map(([r]) => r);
writeFileSync("src/data/snapshot.json", JSON.stringify(Object.fromEntries(facts), null, 2) + "\n");
console.log(`Saved ${facts.size - missing.length} of ${facts.size} repositories${missing.length ? `; missing: ${missing.join(", ")}` : ""}`);
