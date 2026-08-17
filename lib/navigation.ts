export interface NavRoute {
  href: string;
  label: string;
  shortLabel: string;
}

export const navRoutes: NavRoute[] = [
  { href: "/", label: "Home", shortLabel: "Home" },
  { href: "/movies", label: "All Movies", shortLabel: "Movies" },
  { href: "/before-doomsday", label: "Before Doomsday", shortLabel: "Journey" },
  { href: "/watched", label: "Watched", shortLabel: "Watched" },
];
