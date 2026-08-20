"use client";

import { useMemo, useState } from "react";
import { catalogMovies, doomsdayMovie, upcomingMovies } from "@/data/movies";
import { useWatched } from "@/lib/WatchedContext";
import { useMovieModal } from "@/lib/MovieModalContext";
import { formatReleaseDate } from "@/lib/format";
import { MoviePoster } from "@/components/MoviePoster/MoviePoster";
import {
  filterMovies,
  availablePhases,
  defaultQuery,
  type MovieQuery,
} from "@/lib/movieFilters";
import { DoomsdayFeature } from "@/components/DoomsdayFeature/DoomsdayFeature";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { PageAtmosphere } from "@/components/PageAtmosphere/PageAtmosphere";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Reveal } from "@/components/Reveal/Reveal";
import styles from "./page.module.css";
import { RouteTransition } from "@/components/RouteTransition/RouteTransition";

const phases = availablePhases(catalogMovies);

export default function MoviesPage() {
  const { watchedIds } = useWatched();
  const { openMovie } = useMovieModal();
  const [query, setQuery] = useState<MovieQuery>(defaultQuery);

  const results = useMemo(
    () => filterMovies(catalogMovies, query, watchedIds),
    [query, watchedIds],
  );

  function handleChange(patch: Partial<MovieQuery>) {
    setQuery((current) => ({ ...current, ...patch }));
  }

  return (
    <RouteTransition>
      <div className="page-wrap" style={{ ["--page-accent" as string]: "#7b5cff" }}>
        <PageAtmosphere accent="#7b5cff" position="right" />
        <PageHeader
          eyebrow="All Movies"
          title="All Movies"
          description="Marvel's full movie listing: every Marvel Cinematic Universe film, the X-Men and Spider-Man titles from its Other Movies shelf, and the Loki series Disney added to its pre-Doomsday watchlist. Filter by phase, track what you have watched, and see which titles are part of the road to Doomsday."
        />

        <DoomsdayFeature />

        <FilterBar
          query={query}
          phases={phases}
          resultCount={results.length}
          onChange={handleChange}
          onReset={() => setQuery(defaultQuery)}
        />

        {results.length > 0 ? (
          <Reveal className={styles.movies_grid} stagger="tight" key={`${query.sort}-${query.phase}-${query.watched}-${query.relevance}`}>
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

        <section className={styles.movies_upcoming} aria-labelledby="movies-upcoming-heading">
          <h2 id="movies-upcoming-heading" className={styles["movies_upcoming-title"]}>
            On the way
          </h2>
          <p className={styles["movies_upcoming-note"]}>
            The rest of the announced slate, not out yet and outside the tracker. Dates come from
            marvel.com and can still move.
          </p>
          <Reveal className={styles["movies_upcoming-grid"]} stagger="tight">
            {upcomingMovies
              .filter((movie) => movie.id !== doomsdayMovie.id)
              .map((movie) => (
                <button
                  key={movie.id}
                  type="button"
                  className={styles["movies_upcoming-card"]}
                  onClick={(event) => openMovie(movie, event.currentTarget)}
                >
                  <MoviePoster movie={movie} sizes="(max-width: 640px) 45vw, 160px" />
                  <span className={styles["movies_upcoming-name"]}>{movie.title}</span>
                  <span className={styles["movies_upcoming-date"]}>
                    {formatReleaseDate(movie.releaseDate)}
                  </span>
                </button>
              ))}
          </Reveal>
        </section>
      </div>
    </RouteTransition>
  );
}
