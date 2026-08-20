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

export type NavDirection = "nav-forward" | "nav-back";

function depthOf(pathname: string): number {
  return pathname.split("/").filter(Boolean).length;
}

export function navDirection(from: string, to: string): NavDirection {
  const fromDepth = depthOf(from);
  const toDepth = depthOf(to);
  if (toDepth !== fromDepth) return toDepth > fromDepth ? "nav-forward" : "nav-back";

  const fromIndex = navRoutes.findIndex((route) => route.href === from);
  const toIndex = navRoutes.findIndex((route) => route.href === to);
  if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
    return toIndex > fromIndex ? "nav-forward" : "nav-back";
  }

  return "nav-forward";
}
