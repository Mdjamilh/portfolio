/**
 * Everything personal on the site lives here, so it can be updated without
 * touching any page. Leave a field empty to hide it.
 */
export const profile = {
  name: "Md. Jamil Hossain",
  role: "Software developer",
  focus: "Healthcare software and full-stack web applications",
  location: "",
  /** Public contact address. Left empty until confirmed for publication. */
  email: "",
  github: "https://github.com/Mdjamilh",
  linkedin: "",

  abstract:
    "I build web applications end to end, from the database and API to the interface, tests and documentation. " +
    "Most of my recent work is in healthcare: scheduling, clinical documentation, guideline search, patient records and medication safety, " +
    "using standards such as HL7 FHIR and HL7 v2 and treating patient privacy as a requirement rather than an afterthought.",

  keywords: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "HL7 FHIR", "Testing", "Accessibility"],

  about: [
    "I care about software that people can rely on. In practice that means writing the test before trusting the feature, reading the standard before inventing a format, and documenting decisions so the next developer does not have to guess.",
    "My projects are deliberately varied. Several are healthcare applications built on public clinical data and interoperability standards. Others explore real-time collaboration, offline-first storage, accessible components and developer tooling, in TypeScript, Go, React, Vue and Svelte.",
    "Every project here is public, with its history, tests and continuous integration visible on GitHub, and most can be tried live.",
  ],

  principles: [
    { title: "Verified, not assumed", text: "Unit, component and browser tests run in continuous integration on every change, including accessibility scans." },
    { title: "Standards first", text: "HL7 FHIR R4, HL7 v2, RxNorm and WAI-ARIA are used as written, so systems can work together." },
    { title: "Privacy by design", text: "Identifiers are removed before data leaves the user's control, and local-first storage is preferred where it fits." },
    { title: "Documented", text: "Each repository explains what it does in plain language, how it works, and how to run and test it." },
  ],

  skills: [
    { group: "Languages", items: ["TypeScript", "JavaScript", "Go", "SQL"] },
    { group: "Front end", items: ["React", "Next.js", "Vue", "Svelte", "Tailwind CSS", "Web Components"] },
    { group: "Back end and data", items: ["Node.js", "Express", "Hono", "PostgreSQL", "pgvector", "Drizzle", "SQLite", "IndexedDB"] },
    { group: "Healthcare and AI", items: ["HL7 FHIR R4", "HL7 v2", "RxNorm", "openFDA", "Claude API", "Ollama", "Retrieval-augmented generation"] },
    { group: "Quality and delivery", items: ["Vitest", "Playwright", "axe", "GitHub Actions", "Docker", "Vercel"] },
  ],

  /** Shown on the résumé page. Add entries when available. */
  education: [] as { institution: string; programme: string; period: string; detail?: string }[],
};
