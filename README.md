# Portfolio of Md. Jamil Hossain

The source of my personal portfolio site: a home page, a projects page with a case study for every project, an about page and a resume.

**Live:** https://mdjamilh.vercel.app

![Home page: the name, an animated diagram of how each project is built, and figures read from GitHub](docs/home.png)

## Design

The site is drawn like an engineering blueprint: a deep navy sheet with a faint drafting grid, cyan for anything live or interactive, amber for annotations, and corner registration marks on panels. Each page is a numbered "sheet", and a light theme redraws the same plan on white drafting paper.

| Page | What it shows |
|---|---|
| Home | Name and introduction, an animated diagram of the four layers every project is built through (data, API, interface, verification), figures from GitHub, and three featured projects |
| Projects | Six selected projects as "spec sheets" with real screenshots, then every other project as a filterable card |
| Project pages | One case study per project: screenshot, problem, approach and evidence, with stack and repository facts |
| About | Background, working principles and a technical specification of the tools used |
| Resume | The resume PDF, once one is added |

Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or <kbd>/</kbd>) on any page to jump to a project, technology or page from the keyboard. Motion is limited to a few CSS animations, which stop entirely when the visitor's system asks for reduced motion.

## The figures are real

The commit counts and last-change dates come from the GitHub API **when the site is built**, so visitors never hit API rate limits and nothing is tracked. If the API is unavailable during a build, the site uses the last snapshot in `src/data/snapshot.json` (refresh it with `npm run snapshot`). A figure that isn't known is left out rather than shown as zero.

## Updating the content

All content lives in two files, so no page needs editing:

- `src/data/profile.ts`: name, introduction, about text, working principles, technologies, contact details and education. Empty fields are hidden.
- `src/data/projects.ts`: every project's summary, problem, approach, evidence, stack and links. `selected: true` makes a project one of the six spec sheets on the projects page.

### Adding the resume

Put the PDF in `public/resume/` (any file name) and push. The Resume page shows it with download and open buttons. Until a PDF is there, the page shows a blank sheet. To replace the resume, swap the file; if the folder holds several PDFs, the first by name is used.

Screenshots for the project pages live in `src/assets/shots/<repository>.png` and are resized automatically at build time.

## Quality

```bash
npm install
npm test            # unit tests: search ranking, filters, GitHub figures and the snapshot fallback
npm run typecheck   # astro check
npm run test:e2e    # browser tests on desktop and mobile
```

The browser tests serve every page with the production Content Security Policy, read from `vercel.json`, so a script the policy would block fails the test. Each page is also scanned with axe for WCAG 2.2 AA issues. CI runs all of the above, plus `npm audit`, on every push.

The policy itself allows no inline scripts or styles and no third-party requests. Fonts are self-hosted, and the only script that runs before the page renders is a small file that applies the saved theme.

## Running locally

```bash
npm install
npm run dev
```

Set `GITHUB_TOKEN` to avoid the unauthenticated API limit during frequent local builds; it is optional.

Built with Astro and TypeScript, using no UI framework. Deployed as a static site on Vercel.

## License

The code is [MIT licensed](LICENSE). The written content and the resume are © Md. Jamil Hossain.
