export type Importance = "essential" | "recommended" | "optional";

export type Saga =
  | "X-Men Saga"
  | "Sony Spider-Man"
  | "Infinity Saga"
  | "Multiverse Saga";

export type ReleaseStatus = "released" | "upcoming";

export type Medium = "film" | "series";

export interface Movie {
  id: string;
  title: string;
  releaseDate: string | null;
  runtime: number;
  overview: string;
  poster: string | null;
  rating: number | null;
  streaming: string[];
  phase: number | null;
  saga: Saga | null;
  medium: Medium;
  releaseOrder: number;
  chronologicalOrder: number;
  isRequiredForDoomsday: boolean;
  importance: Importance;
  journeyOrder: number | null;
  doomsdayRelevance: string | null;
  tags: string[];
  postCreditRelevant: boolean;
  accent: string;
  status: ReleaseStatus;
}
