import { describe, expect, it } from "vitest";

import { rank, type Entry } from "./search";

const entries: Entry[] = [
  { title: "Clinic appointment scheduler", kind: "Case study", href: "/work/clinic", keywords: ["Next.js", "FHIR R4"] },
  { title: "Patient record explorer", kind: "Case study", href: "/work/fhir", keywords: ["fhir-patient-explorer", "FHIR R4"] },
  { title: "Resume", kind: "Page", href: "/resume", keywords: ["cv"] },
  { title: "envguard", kind: "Case study", href: "/work/envguard", keywords: ["Go"] },
];

describe("rank", () => {
  it("returns everything, in order, for an empty query", () => {
    expect(rank(entries, "  ").map((e) => e.href)).toEqual(["/work/clinic", "/work/fhir", "/resume", "/work/envguard"]);
    expect(rank(entries, "", 2)).toHaveLength(2);
  });

  it("requires every word and ranks title matches above keyword matches", () => {
    expect(rank(entries, "fhir").map((e) => e.href)).toEqual(["/work/clinic", "/work/fhir"]);
    expect(rank(entries, "patient fhir").map((e) => e.href)).toEqual(["/work/fhir"]);
    expect(rank(entries, "record").map((e) => e.href)).toEqual(["/work/fhir"]);
    expect(rank(entries, "explorer fhir")[0]!.href).toBe("/work/fhir");
  });

  it("ignores case and accents", () => {
    expect(rank(entries, "RESUME")[0]!.href).toBe("/resume");
    expect(rank(entries, "résumé")[0]!.href).toBe("/resume");
    expect(rank(entries, "CV")[0]!.href).toBe("/resume");
  });

  it("returns nothing when a word matches nothing", () => {
    expect(rank(entries, "go kotlin")).toEqual([]);
  });
});
