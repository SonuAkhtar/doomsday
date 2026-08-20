import type { Movie } from "@/types/movie";

export type WatchedFilter = "all" | "watched" | "unwatched";
export type RelevanceFilter = "all" | "required" | "optional";
export type SortOrder = "recommended" | "release" | "chronological";
export type PhaseFilter = number | "all";

export interface MovieQuery {
  search: string;
  phase: PhaseFilter;
  watched: WatchedFilter;
  relevance: RelevanceFilter;
  sort: SortOrder;
}

export const defaultQuery: MovieQuery = {
  search: "",
  phase: "all",
  watched: "all",
  relevance: "all",
  sort: "recommended",
};

const SORTERS: Record<SortOrder, (a: Movie, b: Movie) => number> = {
  recommended: (a, b) => a.releaseOrder - b.releaseOrder,
  release: (a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""),
  chronological: (a, b) => a.chronologicalOrder - b.chronologicalOrder,
};

export function filterMovies(
  movies: Movie[],
  query: MovieQuery,
  watchedIds: ReadonlySet<string>,
): Movie[] {
  const term = query.search.trim().toLowerCase();

  const filtered = movies.filter((movie) => {
    if (term) {
      const haystack = `${movie.title} ${movie.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    if (query.phase !== "all" && movie.phase !== query.phase) return false;

    if (query.watched === "watched" && !watchedIds.has(movie.id)) return false;
    if (query.watched === "unwatched" && watchedIds.has(movie.id)) return false;

    if (query.relevance === "required" && !movie.isRequiredForDoomsday) return false;
    if (query.relevance === "optional" && movie.isRequiredForDoomsday) return false;

    return true;
  });

  return filtered.sort(SORTERS[query.sort]);
}

export function availablePhases(movies: Movie[]): number[] {
  const phases = movies
    .map((movie) => movie.phase)
    .filter((phase): phase is number => phase !== null);
  return [...new Set(phases)].sort((a, b) => a - b);
}
