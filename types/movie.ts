export type Importance = "essential" | "recommended" | "optional";

export type Saga = "Infinity Saga" | "Multiverse Saga";

export type ReleaseStatus = "released" | "upcoming";

export interface Movie {
  id: string;
  title: string;
  releaseDate: string;
  runtime: number;
  overview: string;
  poster: string | null;
  imdbRating: number | null;
  streaming: string[];
  phase: number;
  saga: Saga;
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
