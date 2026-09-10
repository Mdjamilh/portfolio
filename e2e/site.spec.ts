import { expect, expectAccessible, test } from "./fixtures";

test("home page presents the abstract, the record and every project", async ({ page, problems }) => {
  void problems;
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Md. Jamil Hossain");
  await expect(page.getByRole("complementary", { name: "The record" })).toContainText("Public repositories");
  await expect(page.locator("#index tbody tr")).toHaveCount(19);
  await expectAccessible(page);
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
  await expect(page).toHaveURL(/\/work\/fhir-patient-explorer$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Patient record explorer");
});

test("the index filters by domain and by typed technology", async ({ page, problems }) => {
  void problems;
  await page.goto("/#index");
  const rows = page.locator("#index tbody tr:visible");
  await page.getByRole("radio", { name: "Healthcare" }).check();
  await expect(rows).toHaveCount(7);
  await page.getByRole("radio", { name: "All" }).check();
  await page.getByRole("searchbox", { name: "Filter by name or technology" }).fill("go");
  await expect(rows.first()).toContainText("envguard");
  await expect(page.getByText(/of 19 projects/)).toBeVisible();
  await page.getByRole("searchbox", { name: "Filter by name or technology" }).fill("cobol");
  await expect(page.getByText("No project matches that filter.")).toBeVisible();
});

test("case studies read as problem, approach and evidence, with paging", async ({ page, problems }) => {
  void problems;
  await page.goto("/work/care-note-ai");
  for (const name of ["Problem", "Approach", "Evidence"]) await expect(page.getByRole("heading", { level: 2, name: new RegExp(name) })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open the live demo" })).toHaveAttribute("href", /vercel\.app/);
  await expectAccessible(page);
  await page.getByRole("link", { name: /Next/ }).click();
  await expect(page).toHaveURL(/\/work\/guideline-rag-search$/);
});

test("the resume page offers printing and has no PDF until one is added", async ({ page, problems }) => {
  void problems;
  await page.goto("/resume");
  await expect(page.getByRole("button", { name: "Print this page" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Download PDF" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Selected projects" })).toBeVisible();
  await expectAccessible(page);
});

test("the theme choice survives a reload", async ({ page, problems }) => {
  void problems;
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /Colour theme/ });
  await expect(toggle).toHaveAccessibleName("Colour theme: system");
  await toggle.click();
  await expect(toggle).toHaveAccessibleName("Colour theme: light");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectAccessible(page);
});

test("unknown addresses get a helpful page", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page is not in the index.");
});
