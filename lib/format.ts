import type { Movie } from "@/types/movie";

export function phaseLabel(movie: Pick<Movie, "phase" | "saga">): string {
  if (movie.phase !== null) return `Phase ${movie.phase}`;
  return movie.saga ?? "Phase TBA";
}

export function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) return "TBA";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatReleaseDate(iso: string | null): string {
  if (!iso) return "Date TBA";
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatYear(iso: string | null): string {
  return iso ? iso.slice(0, 4) : "TBA";
}

export function formatWatchedAt(timestamp: number): string | null {
  if (!timestamp || timestamp <= 0) return null;
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
