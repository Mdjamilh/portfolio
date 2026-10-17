import { expect, expectAccessible, test } from "./fixtures";

test("home presents the name, the build diagram, figures and featured work", async ({ page, problems }) => {
  void problems;
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Md. Jamil Hossain");
  await expect(page.getByRole("figure", { name: /How each project is built/ }).getByRole("listitem")).toHaveCount(4);
  await expect(page.getByRole("definition").first()).toHaveText("19");
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  await expectAccessible(page);
});

test("each section is its own page, marked in the navigation", async ({ page, problems }) => {
  void problems;
  for (const [name, path, heading] of [
    ["Projects", "/projects", "Projects"],
    ["About", "/about", "About"],
    ["Resume", "/resume", "Resume"],
  ] as const) {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name })).toHaveAttribute("aria-current", "page");
    await expectAccessible(page);
  }
});

test("moving between pages swaps content in place without reloading", async ({ page, problems }) => {
  void problems;
  await page.goto("/");
  // A full reload would clear this; an in-place swap keeps it.
  await page.evaluate(() => ((window as unknown as { marker: number }).marker = 42));
  const nav = page.getByRole("navigation", { name: "Main" });
  for (const [name, path] of [
    ["Projects", "/projects"],
    ["About", "/about"],
    ["Resume", "/resume"],
    ["Home", "/"],
  ] as const) {
    await nav.getByRole("link", { name }).click();
    await expect(page).toHaveURL(new RegExp(`${path === "/" ? "/" : path}$`));
    await expect(nav.getByRole("link", { name })).toHaveAttribute("aria-current", "page");
  }
  await page.getByRole("link", { name: "Projects" }).first().click();
  await page.getByRole("radio", { name: "Healthcare" }).check();
  await expect(page.locator(".grid > li:visible")).toHaveCount(4);
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await nav.getByRole("link", { name: "About" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => (window as unknown as { marker?: number }).marker)).toBe(42);
});

test("the command palette finds a project by technology and opens it", async ({ page, problems, isMobile }) => {
  void problems;
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: "Find a page or project" }).click();
  else await page.keyboard.press("Control+k");
  const input = page.getByRole("combobox", { name: "Find a page or project" });
  await expect(input).toBeFocused();
  await input.fill("fhir");
  await expect(page.getByRole("option").first()).toContainText("Patient record explorer");
  await expectAccessible(page);
  await input.press("Enter");
  await expect(page).toHaveURL(/\/projects\/fhir-patient-explorer$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Patient record explorer");
});

test("more projects filter by domain and by typed technology", async ({ page, problems }) => {
  void problems;
  await page.goto("/projects");
  await expect(page.getByRole("article")).toHaveCount(6);
  const cards = page.locator(".grid > li:visible");
  await expect(cards).toHaveCount(13);
  await page.getByRole("radio", { name: "Healthcare" }).check();
  await expect(cards).toHaveCount(4);
  await page.getByRole("radio", { name: "All" }).check();
  await page.getByRole("searchbox", { name: "Filter by name or technology" }).fill("vue");
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("Markdown notes");
  await expect(page.getByText("1 of 13 projects")).toBeVisible();
  await page.getByRole("searchbox", { name: "Filter by name or technology" }).fill("cobol");
  await expect(page.getByText("No project matches that filter.")).toBeVisible();
});

test("case studies read as problem, approach and evidence, with paging", async ({ page, problems }) => {
  void problems;
  await page.goto("/projects/care-note-ai");
  for (const name of ["Problem", "Approach", "Evidence"]) await expect(page.getByRole("heading", { level: 2, name: new RegExp(name) })).toBeVisible();
  await expect(page.getByRole("img", { name: "Screenshot of Care note assistant" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open the live demo/ })).toHaveAttribute("href", /vercel\.app/);
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "page");
  await expectAccessible(page);
  await page.getByRole("link", { name: /Next/ }).click();
  await expect(page).toHaveURL(/\/projects\/guideline-rag-search$/);
});

test("without a PDF the resume page shows one blank sheet", async ({ page, problems }) => {
  void problems;
  await page.goto("/resume");
  const sheet = page.getByRole("img", { name: "Resume page" });
  await expect(sheet).toBeVisible();
  await expect(sheet).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(sheet).toBeEmpty();
  await expect(page.getByRole("link", { name: "Download PDF" })).toHaveCount(0);
});

test("the light theme is remembered across pages", async ({ page, problems }) => {
  void problems;
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectAccessible(page);
  await page.goto("/about");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "light");
});

test("unknown addresses get a helpful page", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page isn't in the drawings.");
});
