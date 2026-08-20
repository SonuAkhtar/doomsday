import { describe, it, expect } from "vitest";
import { catalogMovies } from "@/data/movies";
import { filterMovies, defaultQuery, availablePhases } from "@/lib/movieFilters";

const empty = new Set<string>();

describe("filterMovies", () => {
  it("returns the full catalog with default query", () => {
    const result = filterMovies(catalogMovies, defaultQuery, empty);
    expect(result).toHaveLength(catalogMovies.length);
  });

  it("searches by title case-insensitively", () => {
    const result = filterMovies(catalogMovies, { ...defaultQuery, search: "iron man" }, empty);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.title.toLowerCase().includes("iron man"))).toBe(true);
  });

  it("searches by tag", () => {
    const result = filterMovies(catalogMovies, { ...defaultQuery, search: "multiverse" }, empty);
    expect(result.some((m) => m.id === "doctor-strange-multiverse-of-madness")).toBe(true);
  });

  it("filters by phase", () => {
    const result = filterMovies(catalogMovies, { ...defaultQuery, phase: 1 }, empty);
    expect(result.every((m) => m.phase === 1)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters watched and unwatched", () => {
    const watched = new Set(["iron-man", "thor"]);
    const onlyWatched = filterMovies(catalogMovies, { ...defaultQuery, watched: "watched" }, watched);
    expect(onlyWatched.map((m) => m.id).sort()).toEqual(["iron-man", "thor"]);

    const onlyUnwatched = filterMovies(catalogMovies, { ...defaultQuery, watched: "unwatched" }, watched);
    expect(onlyUnwatched.some((m) => watched.has(m.id))).toBe(false);
    expect(onlyWatched.length + onlyUnwatched.length).toBe(catalogMovies.length);
  });

  it("filters by relevance", () => {
    const required = filterMovies(catalogMovies, { ...defaultQuery, relevance: "required" }, empty);
    expect(required.every((m) => m.isRequiredForDoomsday)).toBe(true);

    const optional = filterMovies(catalogMovies, { ...defaultQuery, relevance: "optional" }, empty);
    expect(optional.every((m) => !m.isRequiredForDoomsday)).toBe(true);
  });

  it("sorts by recommended, release, and chronological order", () => {
    const recommended = filterMovies(catalogMovies, { ...defaultQuery, sort: "recommended" }, empty);
    for (let i = 1; i < recommended.length; i += 1) {
      expect(recommended[i].releaseOrder).toBeGreaterThan(recommended[i - 1].releaseOrder);
    }

    const release = filterMovies(catalogMovies, { ...defaultQuery, sort: "release" }, empty);
    for (let i = 1; i < release.length; i += 1) {
      expect((release[i].releaseDate ?? "") <= (release[i - 1].releaseDate ?? "")).toBe(true);
    }

    const chrono = filterMovies(catalogMovies, { ...defaultQuery, sort: "chronological" }, empty);
    for (let i = 1; i < chrono.length; i += 1) {
      expect(chrono[i].chronologicalOrder).toBeGreaterThan(chrono[i - 1].chronologicalOrder);
    }
  });

  it("combines filters", () => {
    const result = filterMovies(
      catalogMovies,
      { ...defaultQuery, phase: 5, relevance: "required" },
      empty,
    );
    expect(result.every((m) => m.phase === 5 && m.isRequiredForDoomsday)).toBe(true);
  });

  it("returns an empty array when nothing matches", () => {
    const result = filterMovies(catalogMovies, { ...defaultQuery, search: "zzzznomatch" }, empty);
    expect(result).toHaveLength(0);
  });

  it("lists available phases in order", () => {
    expect(availablePhases(catalogMovies)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
