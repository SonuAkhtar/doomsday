import { ViewTransition, type ViewTransitionClass } from "react";

const directional: ViewTransitionClass = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
};

export function RouteTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={directional} exit={directional} default="none">
      {children}
    </ViewTransition>
  );
}
