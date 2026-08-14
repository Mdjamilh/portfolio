import { describe, expect, it } from "vitest";

import { matchesFilter } from "./filter";

const row = { domain: "Healthcare", text: "patient record explorer fhir-patient-explorer react fhir r4" };

describe("matchesFilter", () => {
  it("shows everything with no filter", () => {
    expect(matchesFilter(row, "", "")).toBe(true);
    expect(matchesFilter(row, "", "   ")).toBe(true);
  });

  it("filters by domain and by every typed word", () => {
    expect(matchesFilter(row, "Healthcare", "")).toBe(true);
    expect(matchesFilter(row, "Developer tooling", "")).toBe(false);
    expect(matchesFilter(row, "", "FHIR React")).toBe(true);
    expect(matchesFilter(row, "", "fhir vue")).toBe(false);
    expect(matchesFilter(row, "Developer tooling", "fhir")).toBe(false);
  });
});
