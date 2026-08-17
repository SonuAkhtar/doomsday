import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { movies, getMovieById } from "@/data/movies";
import { formatRuntime, formatReleaseDate } from "@/lib/format";
import { MoviePoster } from "@/components/MoviePoster/MoviePoster";
import { RelevanceTag } from "@/components/RelevanceTag/RelevanceTag";
import { WatchedButton } from "@/components/WatchedButton/WatchedButton";
import { Reveal } from "@/components/Reveal/Reveal";
import styles from "./page.module.css";

const byRelease = [...movies].sort((a, b) => a.releaseOrder - b.releaseOrder);

export function generateStaticParams() {
  return movies.map((movie) => ({ id: movie.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = getMovieById(id);
  if (!movie) return { title: "Movie not found" };
  return {
    title: movie.title,
    description: movie.overview,
    openGraph: {
      title: `${movie.title} · Doomsday`,
      description: movie.overview,
    },
  };
}

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = getMovieById(id);
  if (!movie) notFound();

  const index = byRelease.findIndex((item) => item.id === movie.id);
  const previous = index > 0 ? byRelease[index - 1] : null;
  const next = index < byRelease.length - 1 ? byRelease[index + 1] : null;

  return (
    <article className={styles.details} style={{ ["--details-accent" as string]: movie.accent }}>
      <div className={styles["details_backdrop"]} aria-hidden="true" />

      <div className="page-wrap">
        <Link href="/movies" className={styles["details_back"]}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m10 3-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All movies
        </Link>

        <div className={styles["details_hero"]}>
          <div className={styles["details_poster"]}>
            <MoviePoster movie={movie} variant="feature" />
          </div>

          <div className={styles["details_intro"]}>
            <div className={styles["details_tags"]}>
              <RelevanceTag movie={movie} />
              <span className={styles["details_saga"]}>{movie.saga}</span>
              {movie.status === "upcoming" && (
                <span className={styles["details_upcoming"]}>Upcoming</span>
              )}
            </div>

            <h1 className={styles["details_title"]}>{movie.title}</h1>

            <p className={styles["details_meta"]}>
              {formatReleaseDate(movie.releaseDate)}
              <span aria-hidden="true"> · </span>
              {formatRuntime(movie.runtime)}
              <span aria-hidden="true"> · </span>
              Phase {movie.phase}
            </p>

            <p className={styles["details_overview"]}>{movie.overview}</p>

            {movie.status !== "upcoming" && (
              <div className={styles["details_watch"]}>
                <WatchedButton movie={movie} />
              </div>
            )}
          </div>
        </div>

        {movie.doomsdayRelevance && (
          <Reveal>
            <section className={styles["details_relevance"]}>
              <h2 className={styles["details_section-title"]}>
                {movie.isRequiredForDoomsday ? "Why it matters for Doomsday" : "Where it fits"}
              </h2>
              <p>{movie.doomsdayRelevance}</p>
            </section>
          </Reveal>
        )}

        <dl className={styles["details_facts"]}>
          <div className={styles["details_fact"]}>
            <dt>Release order</dt>
            <dd>#{movie.releaseOrder}</dd>
          </div>
          <div className={styles["details_fact"]}>
            <dt>Runtime</dt>
            <dd>{formatRuntime(movie.runtime)}</dd>
          </div>
          <div className={styles["details_fact"]}>
            <dt>Post-credits</dt>
            <dd>{movie.postCreditRelevant ? "Worth staying for" : "Not essential"}</dd>
          </div>
          <div className={styles["details_fact"]}>
            <dt>Doomsday journey</dt>
            <dd>{movie.isRequiredForDoomsday ? "Included" : "Optional"}</dd>
          </div>
        </dl>

        {movie.tags.length > 0 && (
          <ul className={styles["details_chiplist"]}>
            {movie.tags.map((tag) => (
              <li key={tag} className={styles["details_chip"]}>
                {tag}
              </li>
            ))}
          </ul>
        )}

        <nav className={styles["details_nav"]} aria-label="Movie navigation">
          {previous ? (
            <Link href={`/movie/${previous.id}`} className={styles["details_nav-link"]}>
              <span className={styles["details_nav-dir"]}>Previous</span>
              <span className={styles["details_nav-name"]}>{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/movie/${next.id}`}
              className={`${styles["details_nav-link"]} ${styles["details_nav-link--next"]}`}
            >
              <span className={styles["details_nav-dir"]}>Next</span>
              <span className={styles["details_nav-name"]}>{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </article>
  );
}
