import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  movies,
  journeyMovies,
  catalogMovies,
  officialWatchlistMovies,
  journeyExtraMovies,
  upcomingMovies,
} from "@/data/movies";
import {
  formatReleaseDate,
  formatRuntime,
  formatWatchedAt,
  formatYear,
  phaseLabel,
} from "@/lib/format";

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

  it("has valid ISO release dates, and only leaves them out for undated films", () => {
    for (const movie of movies) {
      if (movie.releaseDate === null) {
        expect(movie.status).toBe("upcoming");
        continue;
      }
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

  it("gives every catalog film a valid poster URL when one exists, and a valid rating", () => {
    for (const movie of catalogMovies) {
      if (movie.poster !== null) {
        expect(movie.poster).toMatch(/^\/posters\/[a-z0-9-]+\.jpg$/);
      }
      if (movie.rating !== null) {
        expect(typeof movie.rating).toBe("number");
        expect(movie.rating).toBeGreaterThan(0);
        expect(movie.rating).toBeLessThanOrEqual(10);
      }
      expect(Array.isArray(movie.streaming)).toBe(true);
    }
  });

  it("carries all 15 titles from Disney's official watchlist, in release order", () => {
    expect(officialWatchlistMovies.map((m) => m.id)).toEqual([
      "x-men",
      "x2",
      "captain-america-the-first-avenger",
      "the-avengers",
      "avengers-infinity-war",
      "avengers-endgame",
      "loki",
      "shang-chi",
      "spider-man-no-way-home",
      "doctor-strange-multiverse-of-madness",
      "black-panther-wakanda-forever",
      "deadpool-and-wolverine",
      "captain-america-brave-new-world",
      "thunderbolts",
      "fantastic-four-first-steps",
    ]);
  });

  it("marks the official picks essential and the extras recommended", () => {
    for (const movie of officialWatchlistMovies) {
      expect(movie.importance).toBe("essential");
    }
    for (const movie of journeyExtraMovies) {
      expect(movie.importance).toBe("recommended");
    }
    expect(officialWatchlistMovies.length + journeyExtraMovies.length).toBe(
      journeyMovies.length,
    );
  });

  it("keeps the journey in release order", () => {
    const dates = journeyMovies.map((m) => m.releaseDate);
    expect(dates).toEqual(dates.slice().sort());
  });

  it("only leaves phase empty for non-MCU titles or unplaced announcements", () => {
    for (const movie of movies) {
      if (movie.phase !== null) {
        expect(movie.phase).toBeGreaterThan(0);
        continue;
      }
      if (movie.saga === null) {
        expect(movie.status).toBe("upcoming");
      } else {
        expect(["X-Men Saga", "Sony Spider-Man"]).toContain(movie.saga);
      }
    }
  });

  it("covers Marvel's own movie listing, MCU plus its Other Movies shelf", () => {
    const ids = new Set(movies.map((m) => m.id));
    for (const id of [
      "avengers-doomsday",
      "avengers-secret-wars",
      "ghost-rider",
      "black-panther-3",
      "blade",
      "spider-man",
      "spider-man-2",
      "spider-man-3",
      "the-amazing-spider-man",
      "venom",
      "x-men-days-of-future-past",
      "deadpool",
      "x-men-apocalypse",
      "logan",
      "deadpool-2",
      "x-men-dark-phoenix",
    ]) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it("ships every configured poster file", () => {
    for (const movie of movies) {
      if (movie.poster === null) continue;
      expect(existsSync(join(process.cwd(), "public", movie.poster))).toBe(true);
    }
  });

  it("gives every released title a poster", () => {
    const missing = catalogMovies.filter((m) => m.poster === null).map((m) => m.id);
    expect(missing).toEqual([]);
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

describe("formatYear and formatReleaseDate", () => {
  it("formats a date", () => {
    expect(formatYear("2000-07-14")).toBe("2000");
    expect(formatReleaseDate("2000-07-14")).toBe("Jul 14, 2000");
  });

  it("labels undated films rather than rendering null", () => {
    expect(formatYear(null)).toBe("TBA");
    expect(formatReleaseDate(null)).toBe("Date TBA");
  });
});

describe("phaseLabel", () => {
  it("names the phase for MCU titles", () => {
    expect(phaseLabel({ phase: 4, saga: "Multiverse Saga" })).toBe("Phase 4");
  });

  it("falls back to the saga outside the MCU phase structure", () => {
    expect(phaseLabel({ phase: null, saga: "X-Men Saga" })).toBe("X-Men Saga");
    expect(phaseLabel({ phase: null, saga: "Sony Spider-Man" })).toBe("Sony Spider-Man");
  });

  it("falls back again when Marvel has placed the film nowhere", () => {
    expect(phaseLabel({ phase: null, saga: null })).toBe("Phase TBA");
  });
});

describe("upcomingMovies", () => {
  it("orders announced films by date, undated last", () => {
    const dates = upcomingMovies.map((movie) => movie.releaseDate);
    const dated = dates.filter((date): date is string => date !== null);
    expect(dated).toEqual(dated.slice().sort());
    expect(dates.slice(dated.length).every((date) => date === null)).toBe(true);
  });

  it("holds only unreleased films, and none of them are in the catalog", () => {
    const catalogIds = new Set(catalogMovies.map((movie) => movie.id));
    for (const movie of upcomingMovies) {
      expect(movie.status).toBe("upcoming");
      expect(catalogIds.has(movie.id)).toBe(false);
    }
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
