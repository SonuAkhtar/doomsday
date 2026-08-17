import type { Movie } from "@/types/movie";

export interface Progress {
  total: number;
  watched: number;
  remaining: number;
  percent: number;
  totalRuntime: number;
  watchedRuntime: number;
  remainingRuntime: number;
  nextMovie: Movie | null;
}

export function computeProgress(
  list: Movie[],
  watchedIds: ReadonlySet<string>,
): Progress {
  const total = list.length;
  let watched = 0;
  let totalRuntime = 0;
  let watchedRuntime = 0;
  let nextMovie: Movie | null = null;

  for (const movie of list) {
    totalRuntime += movie.runtime;
    if (watchedIds.has(movie.id)) {
      watched += 1;
      watchedRuntime += movie.runtime;
    } else if (nextMovie === null) {
      nextMovie = movie;
    }
  }

  const remaining = total - watched;
  const percent = total === 0 ? 0 : Math.round((watched / total) * 100);

  return {
    total,
    watched,
    remaining,
    percent,
    totalRuntime,
    watchedRuntime,
    remainingRuntime: totalRuntime - watchedRuntime,
    nextMovie,
  };
}

export type Milestone = "start" | "first" | "quarter" | "half" | "threequarter" | "complete";

export function currentMilestone(percent: number, watched: number): Milestone {
  if (percent >= 100) return "complete";
  if (percent >= 75) return "threequarter";
  if (percent >= 50) return "half";
  if (percent >= 25) return "quarter";
  if (watched >= 1) return "first";
  return "start";
}
