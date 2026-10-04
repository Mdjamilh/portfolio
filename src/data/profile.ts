/**
 * Everything personal on the site lives here, so it can be updated without
 * touching any page. Leave a field empty to hide it.
 */
export const profile = {
  name: "Md. Jamil Hossain",
  focus: "Web applications and developer tools, from the database to the interface",
  location: "",
  /** Public contact address. Left empty until confirmed for publication. */
  email: "",
  github: "https://github.com/Mdjamilh",
  linkedin: "",

  abstract:
    "I build software end to end, from the database and API to the interface, tests and documentation. " +
    "My projects range from real-time collaboration and offline-first apps to command-line tools, accessible UI components and healthcare applications built on open data standards.",

  keywords: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "HL7 FHIR", "Testing", "Accessibility"],

  about: [
    "I care about software that people can rely on. In practice that means writing the test before trusting the feature, reading the standard before inventing a format, and documenting decisions so the next developer does not have to guess.",
    "My projects are deliberately varied: real-time collaboration, offline-first storage, accessible components, developer tooling, data structures, and healthcare applications built on public clinical data, in TypeScript, Go, React, Vue and Svelte.",
    "Every project here is public, with its history, tests and continuous integration visible on GitHub, and most can be tried live.",
  ],

  principles: [
    { title: "Verified, not assumed", text: "Unit, component and browser tests run in continuous integration on every change, including accessibility scans." },
    { title: "Standards first", text: "Specifications such as WAI-ARIA, OpenAPI and HL7 FHIR are followed as written, so software works with the systems around it." },
    { title: "Privacy by design", text: "Personal data stays under the user's control: local-first storage where it fits, and identifiers removed before anything is sent elsewhere." },
    { title: "Documented", text: "Each repository explains what it does in plain language, how it works, and how to run and test it." },
  ],

  skills: [
    { group: "Languages", items: ["TypeScript", "JavaScript", "Go", "SQL"] },
    { group: "Front end", items: ["React", "Next.js", "Vue", "Svelte", "Tailwind CSS", "Web Components"] },
    { group: "Back end and data", items: ["Node.js", "Express", "Hono", "PostgreSQL", "pgvector", "Drizzle", "SQLite", "IndexedDB"] },
    { group: "AI and data standards", items: ["HL7 FHIR R4", "HL7 v2", "RxNorm", "openFDA", "Claude API", "Ollama", "Retrieval-augmented generation"] },
    { group: "Quality and delivery", items: ["Vitest", "Playwright", "axe", "GitHub Actions", "Docker", "Vercel"] },
  ],

  /** Shown on the resume page. Add entries when available. */
  education: [] as { institution: string; programme: string; period: string; detail?: string }[],
};
