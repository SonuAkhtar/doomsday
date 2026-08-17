"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Movie } from "@/types/movie";
import { MovieModal } from "@/components/MovieModal/MovieModal";

interface MovieModalContextValue {
  openMovie: (movie: Movie) => void;
}

const MovieModalContext = createContext<MovieModalContextValue | null>(null);

export function MovieModalProvider({ children }: { children: React.ReactNode }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [open, setOpen] = useState(false);

  const openMovie = useCallback((next: Movie) => {
    setMovie(next);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openMovie }), [openMovie]);

  return (
    <MovieModalContext.Provider value={value}>
      {children}
      {movie && <MovieModal movie={movie} open={open} onClose={() => setOpen(false)} />}
    </MovieModalContext.Provider>
  );
}

export function useMovieModal(): MovieModalContextValue {
  const context = useContext(MovieModalContext);
  if (!context) {
    throw new Error("useMovieModal must be used within a MovieModalProvider");
  }
  return context;
}
