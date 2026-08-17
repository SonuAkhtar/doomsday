"use client";

import { useMemo, useState } from "react";
import { catalogMovies } from "@/data/movies";
import { useWatched } from "@/lib/WatchedContext";
import {
  filterMovies,
  availablePhases,
  defaultQuery,
  type MovieQuery,
} from "@/lib/movieFilters";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { PageAtmosphere } from "@/components/PageAtmosphere/PageAtmosphere";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Reveal } from "@/components/Reveal/Reveal";
import styles from "./page.module.css";

const phases = availablePhases(catalogMovies);

export default function MoviesPage() {
  const { watchedIds } = useWatched();
  const [query, setQuery] = useState<MovieQuery>(defaultQuery);

  const results = useMemo(
    () => filterMovies(catalogMovies, query, watchedIds),
    [query, watchedIds],
  );

  function handleChange(patch: Partial<MovieQuery>) {
    setQuery((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="page-wrap">
      <PageAtmosphere accent="#7b5cff" position="right" />
      <PageHeader
        eyebrow="All Movies"
        title="All Movies"
        description="Every released film in the Marvel Cinematic Universe. Filter by phase, track what you have watched, and see which titles are part of the road to Doomsday."
      />

      <FilterBar
        query={query}
        phases={phases}
        resultCount={results.length}
        onChange={handleChange}
        onReset={() => setQuery(defaultQuery)}
      />

      {results.length > 0 ? (
        <Reveal className={styles.movies_grid} stagger key={`${query.sort}-${query.phase}-${query.watched}-${query.relevance}`}>
          {results.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </Reveal>
      ) : (
        <div className={styles.movies_empty}>
          <EmptyState
            title="No movies match"
            message="Try clearing a filter or searching for a different title."
          />
        </div>
      )}
    </div>
  );
}
