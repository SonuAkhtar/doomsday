export function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) return "TBA";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatReleaseDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatYear(iso: string): string {
  return iso.slice(0, 4);
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
