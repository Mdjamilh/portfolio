export type Domain = "Healthcare" | "Web application" | "Developer tooling";

export interface Project {
  /** GitHub repository name, also the case-study URL slug. */
  slug: string;
  title: string;
  domain: Domain;
  /** One sentence a non-technical reader understands. */
  summary: string;
  problem: string;
  approach: string[];
  /** Verifiable facts: tests, CI, standards. Kept specific and modest. */
  evidence: string[];
  stack: string[];
  live?: string;
  /** Shown first on the home page. */
  selected?: boolean;
}

export const GITHUB_USER = "Mdjamilh";
export const repoUrl = (slug: string) => `https://github.com/${GITHUB_USER}/${slug}`;

export const projects: Project[] = [
  {
    slug: "clinic-appointment-scheduler",
    title: "Clinic appointment scheduler",
    domain: "Healthcare",
    summary: "Patients find a doctor, see open times and book, change or cancel appointments; clinic staff see the day's schedule at a glance.",
    problem: "Small clinics still book by phone, which means double bookings and no view of a provider's real availability.",
    approach: [
      "Next.js App Router with server actions over a PostgreSQL schema managed by Drizzle, falling back to an embedded PGlite database for the demo.",
      "Availability is computed from provider schedules and existing bookings, with conflicts prevented in the database rather than only in the UI.",
      "Appointments and providers are also exposed as FHIR R4 resources, and an optional AI intake helper drafts a reason-for-visit note for the patient to edit.",
    ],
    evidence: ["Unit and component tests with Vitest", "Browser tests with Playwright, run in CI", "FHIR R4 Appointment and Practitioner endpoints"],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle", "FHIR R4", "Claude API"],
    live: "https://clinic-appointment-scheduler-kappa.vercel.app",
    selected: true,
  },
  {
    slug: "care-note-ai",
    title: "Care note assistant",
    domain: "Healthcare",
    summary: "Turns a doctor–patient conversation into a structured visit summary for the doctor to review, removing names and other personal details first.",
    problem: "Clinicians spend a large share of each visit on documentation, and sending raw transcripts to an AI service risks exposing patient identity.",
    approach: [
      "Names, dates, phone numbers and other HIPAA Safe Harbor identifiers are replaced with placeholders before anything is stored or sent to the model.",
      "The model fills a strict SOAP note schema and lists what the visit did not cover instead of inventing it; a clinician reviews and locks every note.",
      "Finished notes export as FHIR DocumentReference resources.",
    ],
    evidence: ["Redaction covered by targeted unit tests", "Schema-validated model output", "End-to-end tests in CI"],
    stack: ["Next.js", "TypeScript", "Claude API", "Zod", "FHIR R4"],
    live: "https://carenote-ai-nine.vercel.app",
    selected: true,
  },
  {
    slug: "guideline-rag-search",
    title: "Clinical guideline search",
    domain: "Healthcare",
    summary: "Answers everyday health questions, such as when to be screened for colon cancer, and cites the official guideline behind each answer.",
    problem: "Public health guidance is spread across long documents, and AI answers without sources cannot be checked.",
    approach: [
      "Guidelines are chunked and indexed twice: as vectors in pgvector and in PostgreSQL full-text search.",
      "Both result lists are fused with reciprocal rank fusion, then the answer is written only from retrieved passages, with citations.",
      "A retrieval evaluation set runs in CI so search quality cannot silently regress.",
    ],
    evidence: ["Retrieval evaluation in CI", "Every answer linked to its source passage", "Runs locally with Ollama"],
    stack: ["TypeScript", "PostgreSQL", "pgvector", "Ollama", "RAG"],
    live: "https://guideline-rag-search.vercel.app",
  },
  {
    slug: "fhir-patient-explorer",
    title: "Patient record explorer",
    domain: "Healthcare",
    summary: "Opens a patient's record from a standard health-records server and lays it out clearly: a summary, lab results over time, conditions, medicines and visits.",
    problem: "FHIR data is complete but hard to read; clinicians need a summary, trends and reference ranges, not raw JSON.",
    approach: [
      "Reads live data from the public SMART Health IT FHIR R4 sandbox with paging and caching through TanStack Query.",
      "Lab observations are charted over time with their reference ranges, and out-of-range values are flagged.",
      "Accessible by design: keyboard navigation, labelled charts, and automated accessibility scans.",
    ],
    evidence: ["Component tests against mocked FHIR responses", "Playwright tests on recorded real data", "axe accessibility scans"],
    stack: ["React", "TypeScript", "FHIR R4", "TanStack Query", "Recharts"],
    live: "https://fhir-patient-explorer-khaki.vercel.app",
    selected: true,
  },
  {
    slug: "rx-interaction-checker",
    title: "Medication interaction check",
    domain: "Healthcare",
    summary: "Lists the medicines someone takes and quotes what the official FDA labels say about taking them together, with a link to each label.",
    problem: "Interaction information exists in FDA labels but is buried in long documents, and brand names hide the active ingredients.",
    approach: [
      "Names are resolved to active ingredients with RxNorm, and each ingredient's newest label is read from openFDA.",
      "Both labels in every pair are searched for the other drug by name and by its official drug class, and matching sentences are quoted.",
      "Duplicate ingredients across products, such as acetaminophen in two medicines, are flagged separately.",
    ],
    evidence: ["Unit and component tests", "Browser tests on recorded real API responses", "Content Security Policy limited to the two data sources"],
    stack: ["React", "TypeScript", "RxNorm", "openFDA"],
    live: "https://rx-interaction-checker.vercel.app",
  },
  {
    slug: "medtrack-api",
    title: "Medication tracking API",
    domain: "Healthcare",
    summary: "A documented web API for recording prescriptions and doses and reporting how consistently a patient takes their medication.",
    problem: "Adherence apps need a reliable backend with authentication, validation and clear documentation for client developers.",
    approach: [
      "Express 5 REST API with JWT authentication and request validation.",
      "An OpenAPI specification drives the interactive documentation.",
      "Adherence reports are computed from scheduled versus recorded doses.",
    ],
    evidence: ["Integration tests against a real PostgreSQL service in CI", "OpenAPI documentation", "Docker image"],
    stack: ["Node.js", "Express", "PostgreSQL", "OpenAPI", "Docker"],
    live: "https://medtrack-api-sigma.vercel.app/docs",
  },
  {
    slug: "hl7-parser-ts",
    title: "HL7 v2 parser",
    domain: "Healthcare",
    summary: "A small library that reads and writes HL7 v2, the message format hospital systems still use to exchange admissions, orders and results.",
    problem: "HL7 v2 is everywhere in hospitals, but its delimiters, escapes and repetitions make ad-hoc parsing error-prone.",
    approach: [
      "Zero-dependency TypeScript parser and serializer with escape handling and field repetitions.",
      "Includes acknowledgement (ACK) generation, batch files, MLLP framing and a command-line tool.",
      "Installable directly from GitHub.",
    ],
    evidence: ["CI on Node.js 20, 22 and 24", "Round-trip tests on sample messages", "No runtime dependencies"],
    stack: ["TypeScript", "HL7 v2", "Node.js"],
  },
  {
    slug: "realtime-kanban",
    title: "Real-time task board",
    domain: "Web application",
    summary: "A task board several people can edit at once; everyone sees the same board instantly, even after working offline.",
    problem: "Collaborative boards must merge concurrent edits without losing anyone's changes.",
    approach: [
      "Changes are recorded as operations ordered with Lamport timestamps and merged as last-writer-wins registers.",
      "Card order uses fractional indexing, so moves never require renumbering.",
      "Tabs sync locally; an optional WebSocket server persists the operation log.",
    ],
    evidence: ["Unit tests for the merge rules", "Two-browser Playwright tests", "Keyboard alternative to drag and drop"],
    stack: ["React", "TypeScript", "WebSocket", "SQLite"],
    live: "https://realtime-kanban-eight.vercel.app",
    selected: true,
  },
  {
    slug: "budget-tracker",
    title: "Budget tracker",
    domain: "Web application",
    summary: "A personal budget app that works offline, imports bank CSV files and warns when spending is ahead of pace.",
    problem: "Budget tools usually require an account and a server; personal finance data is better kept on the device.",
    approach: [
      "Local-first storage in IndexedDB, installable as a progressive web app.",
      "The CSV importer detects the date format from the rows themselves.",
      "Pace warnings account for fixed monthly bills.",
    ],
    evidence: ["Tests for import and budgeting rules", "Works offline", "Dependency audit in CI"],
    stack: ["React", "TypeScript", "Mantine", "IndexedDB", "PWA"],
    live: "https://budget-tracker-two-kohl.vercel.app",
    selected: true,
  },
  {
    slug: "snip-links",
    title: "Link shortener",
    domain: "Web application",
    summary: "Shortens links and counts clicks, with a fast server-rendered interface.",
    problem: "A small service that is still built properly: migrations, input safety and correct URLs behind a proxy.",
    approach: [
      "Hono server with Kysely over PostgreSQL, using PGlite for the demo.",
      "Server-rendered pages enhanced with htmx instead of a client framework.",
      "Deployed through Vercel's Build Output API as a single bundled function.",
    ],
    evidence: ["Tests against both PGlite and PostgreSQL 17 in CI", "Contrast-checked interface"],
    stack: ["Hono", "TypeScript", "Kysely", "PostgreSQL", "htmx"],
    live: "https://snip-links.vercel.app",
  },
  {
    slug: "envguard-cli",
    title: "envguard",
    domain: "Developer tooling",
    summary: "A command-line check that catches missing or mistyped app settings before release and stops secrets from being committed.",
    problem: "Misconfigured environment variables and leaked keys are common, avoidable causes of failed releases.",
    approach: [
      "Validates .env files against an annotated example file: required values, types and formats.",
      "Scans for likely secrets before commit.",
      "Published as release binaries, a GitHub Action and a pre-commit hook.",
    ],
    evidence: ["Go standard library only", "Tested on Linux, macOS and Windows in CI", "Versioned releases"],
    stack: ["Go", "GitHub Actions"],
    live: "https://github.com/Mdjamilh/envguard-cli/releases/latest",
    selected: true,
  },
  {
    slug: "gitpulse",
    title: "gitpulse",
    domain: "Web application",
    summary: "Enter a GitHub username to see their public activity: top repositories, languages and a profile checklist.",
    problem: "A quick, readable overview of a developer's public work, within the public API's rate limits.",
    approach: [
      "Reads the GitHub REST API from the browser with response caching.",
      "Rate limits are explained with the reset time instead of failing silently.",
      "Charts are hand-drawn SVG.",
    ],
    evidence: ["Unit and component tests", "Browser test on recorded responses"],
    stack: ["React", "TypeScript", "TanStack Query"],
  },
  {
    slug: "md-notes",
    title: "Markdown notes",
    domain: "Web application",
    summary: "A private notes app with live Markdown preview that keeps everything in the browser.",
    problem: "Notes should be fast, private and safe to render.",
    approach: [
      "Notes are stored in IndexedDB with autosave, search and tags.",
      "Rendered HTML is sanitized, with tests proving script injection is removed.",
      "An optional summary feature talks only to a local Ollama model on the user's own machine.",
    ],
    evidence: ["Sanitizer and store tests", "Browser test"],
    stack: ["Vue", "TypeScript", "Pinia", "IndexedDB"],
    live: "https://md-notes-mu.vercel.app",
  },
  {
    slug: "weather-commute",
    title: "Commute weather",
    domain: "Web application",
    summary: "Shows the weather for your actual trips to and from work and says, in plain words, whether to bring an umbrella or leave earlier.",
    problem: "Daily forecasts don't answer the practical question: what will it be like when I walk out of the door?",
    approach: [
      "Hourly Open-Meteo forecasts are matched to each commute window in the location's own time zone.",
      "Verdict rules differ by commute mode; cyclists care more about wind and rain.",
      "Suggests a nearby departure time with better conditions.",
    ],
    evidence: ["Rule and time-zone tests, including daylight-saving changes", "Browser test"],
    stack: ["SvelteKit", "Svelte", "TypeScript"],
  },
  {
    slug: "job-tracker",
    title: "Job application tracker",
    domain: "Web application",
    summary: "Keeps track of job applications from wishlist to offer, with reminders to follow up and simple statistics.",
    problem: "A multi-user app where each person's data must stay strictly their own.",
    approach: [
      "Next.js with server actions and validated input over PostgreSQL.",
      "Hashed passwords and session cookies, with every query scoped to the signed-in user.",
      "Board and table views, a status timeline and CSV export.",
    ],
    evidence: ["Authorization tests proving one user cannot read another's data", "Browser tests"],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
  },
  {
    slug: "pomodoro-focus",
    title: "Focus timer",
    domain: "Web application",
    summary: "A focus timer that stays accurate in background tabs, records what each session was spent on, and works offline.",
    problem: "Browser timers drift when a tab sleeps; a timer you rely on must not.",
    approach: [
      "Remaining time is derived from timestamps rather than counted ticks.",
      "Built without a framework, using Web Components.",
      "A hand-written service worker makes it installable and offline.",
    ],
    evidence: ["Timer and history tests with fake clocks", "Browser test that fast-forwards a full session"],
    stack: ["TypeScript", "Web Components", "PWA"],
    live: "https://pomodoro-focus-sigma.vercel.app",
  },
  {
    slug: "ui-kit",
    title: "Accessible UI kit",
    domain: "Developer tooling",
    summary: "A small library of interface components, such as dialogs, tabs and menus, that work fully with a keyboard and screen readers.",
    problem: "Common components are often inaccessible; following the WAI-ARIA patterns correctly takes care.",
    approach: [
      "Each component follows its WAI-ARIA Authoring Practices pattern, including focus management.",
      "Themed with design tokens as CSS variables.",
      "A documentation site shows live examples and keyboard instructions.",
    ],
    evidence: ["Keyboard and ARIA tests for every component", "Automated accessibility scans"],
    stack: ["React", "TypeScript", "WAI-ARIA"],
    live: "https://ui-kit-brown-theta.vercel.app",
  },
  {
    slug: "dsa-in-typescript",
    title: "Data structures and algorithms",
    domain: "Developer tooling",
    summary: "Classic data structures and algorithms written carefully in TypeScript and checked with randomized tests.",
    problem: "Reference implementations are most useful when their correctness is demonstrated, not assumed.",
    approach: [
      "Typed, generic implementations with documented time and space complexity.",
      "Property-based tests compare each structure with a simple reference model on random inputs.",
      "Benchmarks are published with the machine and date they were measured on.",
    ],
    evidence: ["Property-based tests", "Coverage thresholds enforced in CI"],
    stack: ["TypeScript", "fast-check"],
  },
  {
    slug: "e2e-testing-lab",
    title: "End-to-end testing lab",
    domain: "Developer tooling",
    summary: "A demonstration of how a web application is tested end to end, from user journeys to accessibility and visual changes.",
    problem: "Browser tests are often slow and flaky; good structure and assertions make them dependable.",
    approach: [
      "Playwright suite with page objects, fixtures and data-driven cases.",
      "Network mocking and failure injection, visual comparisons and accessibility scans.",
      "Sharded across CI jobs with a merged HTML report.",
    ],
    evidence: ["Sharded CI runs", "Visual and accessibility checks"],
    stack: ["Playwright", "TypeScript", "React"],
    live: "https://e2e-testing-lab-opal.vercel.app",
  },
];

export const domains: Domain[] = ["Healthcare", "Web application", "Developer tooling"];
