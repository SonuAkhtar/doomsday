import { describe, it, expect } from "vitest";
import { movies, journeyMovies, catalogMovies } from "@/data/movies";
import { formatRuntime, formatWatchedAt } from "@/lib/format";

describe("movie dataset integrity", () => {
  it("has unique ids", () => {
    const ids = movies.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique release order values", () => {
    const orders = movies.map((m) => m.releaseOrder);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("has unique chronological order values", () => {
    const orders = movies.map((m) => m.chronologicalOrder);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("has valid ISO release dates", () => {
    for (const movie of movies) {
      expect(movie.releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(movie.releaseDate))).toBe(false);
    }
  });

  it("gives every released film a positive runtime and non-empty overview", () => {
    for (const movie of catalogMovies) {
      expect(movie.runtime).toBeGreaterThan(0);
      expect(movie.title.length).toBeGreaterThan(0);
      expect(movie.overview.length).toBeGreaterThan(0);
    }
  });

  it("keeps journey ordering sequential and unique", () => {
    const orders = journeyMovies.map((m) => m.journeyOrder);
    expect(orders).toEqual(orders.slice().sort((a, b) => (a ?? 0) - (b ?? 0)));
    expect(new Set(orders).size).toBe(orders.length);
    expect(orders[0]).toBe(1);
    expect(orders[orders.length - 1]).toBe(journeyMovies.length);
  });

  it("only marks journey films as required for Doomsday", () => {
    for (const movie of movies) {
      if (movie.isRequiredForDoomsday) {
        expect(movie.journeyOrder).not.toBeNull();
      }
    }
    for (const movie of journeyMovies) {
      expect(movie.isRequiredForDoomsday).toBe(true);
      expect(movie.doomsdayRelevance).not.toBeNull();
    }
  });

  it("gives every catalog film a poster URL and IMDb rating", () => {
    for (const movie of catalogMovies) {
      expect(movie.poster).toMatch(/^\/posters\/[a-z0-9-]+\.jpg$/);
      expect(typeof movie.imdbRating).toBe("number");
      expect(movie.imdbRating).toBeGreaterThan(0);
      expect(movie.imdbRating).toBeLessThanOrEqual(10);
      expect(Array.isArray(movie.streaming)).toBe(true);
    }
  });

  it("excludes the upcoming target film from the catalog", () => {
    expect(catalogMovies.some((m) => m.id === "avengers-doomsday")).toBe(false);
    expect(movies.some((m) => m.id === "avengers-doomsday")).toBe(true);
  });
});

describe("formatRuntime", () => {
  it("formats hours and minutes", () => {
    expect(formatRuntime(126)).toBe("2h 6m");
    expect(formatRuntime(120)).toBe("2h");
    expect(formatRuntime(45)).toBe("45m");
  });

  it("handles unknown runtimes", () => {
    expect(formatRuntime(0)).toBe("TBA");
    expect(formatRuntime(-5)).toBe("TBA");
  });
});

describe("formatWatchedAt", () => {
  it("returns null for missing timestamps", () => {
    expect(formatWatchedAt(0)).toBeNull();
    expect(formatWatchedAt(-1)).toBeNull();
  });

  it("formats a real timestamp to a date and time string", () => {
    const label = formatWatchedAt(Date.UTC(2026, 7, 17, 15, 42));
    expect(label).toBeTruthy();
    expect(label).toContain("2026");
  });
});
