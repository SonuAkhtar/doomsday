import { describe, it, expect } from "vitest";
import { journeyMovies } from "@/data/movies";
import { computeProgress, currentMilestone } from "@/lib/progress";

describe("computeProgress", () => {
  it("reports zero progress with nothing watched", () => {
    const progress = computeProgress(journeyMovies, new Set());
    expect(progress.total).toBe(journeyMovies.length);
    expect(progress.watched).toBe(0);
    expect(progress.remaining).toBe(journeyMovies.length);
    expect(progress.percent).toBe(0);
    expect(progress.watchedRuntime).toBe(0);
    expect(progress.remainingRuntime).toBe(progress.totalRuntime);
    expect(progress.nextMovie?.id).toBe(journeyMovies[0].id);
  });

  it("counts watched films and computes remaining runtime", () => {
    const first = journeyMovies[0];
    const progress = computeProgress(journeyMovies, new Set([first.id]));
    expect(progress.watched).toBe(1);
    expect(progress.remaining).toBe(journeyMovies.length - 1);
    expect(progress.watchedRuntime).toBe(first.runtime);
    expect(progress.remainingRuntime).toBe(progress.totalRuntime - first.runtime);
    expect(progress.nextMovie?.id).toBe(journeyMovies[1].id);
  });

  it("returns 100% and no next movie when all watched", () => {
    const all = new Set(journeyMovies.map((m) => m.id));
    const progress = computeProgress(journeyMovies, all);
    expect(progress.percent).toBe(100);
    expect(progress.remaining).toBe(0);
    expect(progress.nextMovie).toBeNull();
  });

  it("finds the first unwatched movie as next, skipping watched", () => {
    const watched = new Set([journeyMovies[0].id, journeyMovies[1].id]);
    const progress = computeProgress(journeyMovies, watched);
    expect(progress.nextMovie?.id).toBe(journeyMovies[2].id);
  });

  it("rounds percentage", () => {
    const watched = new Set(journeyMovies.slice(0, 1).map((m) => m.id));
    const progress = computeProgress(journeyMovies, watched);
    expect(progress.percent).toBe(Math.round((1 / journeyMovies.length) * 100));
  });
});

describe("currentMilestone", () => {
  it("maps percentages to milestones", () => {
    expect(currentMilestone(0, 0)).toBe("start");
    expect(currentMilestone(8, 1)).toBe("first");
    expect(currentMilestone(25, 3)).toBe("quarter");
    expect(currentMilestone(50, 6)).toBe("half");
    expect(currentMilestone(75, 9)).toBe("threequarter");
    expect(currentMilestone(100, 12)).toBe("complete");
  });
});
