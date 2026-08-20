import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { PageAtmosphere } from "@/components/PageAtmosphere/PageAtmosphere";
import styles from "./page.module.css";
import { RouteTransition } from "@/components/RouteTransition/RouteTransition";

export const metadata: Metadata = {
  title: "About and Disclaimer",
  description:
    "Doomsday is a free, non-commercial fan project with no affiliation to Marvel, Disney, or any studio. How its film information and poster images are sourced and used.",
};

const takedownContact = "";

const sections = [
  {
    title: "A fan project, not a business",
    body: "Doomsday is a personal hobby project, made for fun, to help fans plan a Marvel watch order. It is free. It carries no advertising, sells nothing, accepts no payments or donations, and has no accounts. It is not operated for commercial purposes of any kind.",
  },
  {
    title: "No affiliation or endorsement",
    body: "This site is not affiliated with, authorised by, endorsed by, or sponsored by Marvel Studios, Marvel Characters, Inc., Marvel Entertainment, The Walt Disney Company, Disney+, Sony Pictures, 20th Century Studios, The Movie Database, or any other company named anywhere on it. Any views expressed are those of the site owner alone.",
  },
  {
    title: "Film information",
    body: "Titles, release dates, runtimes, phases, and watch order are factual details about films that have been publicly announced or released. They are compiled from public sources, including the official movie listing on marvel.com, the Disney+ pre-Doomsday collection, The Movie Database, and Wikipedia. Details can change, and no accuracy is guaranteed. Where a film is unreleased, its details are labelled as unconfirmed rather than presented as fact.",
  },
  {
    title: "Posters and artwork",
    body: "All poster artwork, logos, character designs, and likenesses are the copyright and trademark of their respective owners. They are reproduced here at small size, unaltered, purely to identify the film each entry refers to, in a free and non-commercial setting. No ownership is claimed over any of it, none of it is sold, licensed, or offered for download, and no claim is made that this use is authorised by the rights holders.",
  },
  {
    title: "The Movie Database",
    body: "Poster images and some film details on this site come from The Movie Database (TMDB). This project is not endorsed or certified by TMDB, and TMDB has no involvement in it.",
  },
  {
    title: "About the ratings",
    body: "The rating shown on each film is an approximate audience score gathered from public film databases and rounded to one decimal place. It is offered as rough guidance only, is not maintained by any rating service, may be out of date, and should not be treated as an official or current score from any provider.",
  },
  {
    title: "Trademarks",
    body: "Marvel, Avengers, Doctor Doom, X-Men, Spider-Man, Deadpool, Disney+, and all film titles and character names are trademarks of their respective owners, including Marvel Characters, Inc., The Walt Disney Company, and Sony Pictures Entertainment. They appear here only to refer to the films being tracked. No affiliation or endorsement is implied, and all rights remain with their owners.",
  },
  {
    title: "Avengers: Doomsday",
    body: "Avengers: Doomsday has not been released and its story has not been officially detailed. The journey on this site reflects films connected to its publicly announced cast, its release window, and the watchlist Disney+ published. Nothing here is insider information, and no speculation is presented as confirmed plot.",
  },
  {
    title: "Your data",
    body: "The films you mark as watched and your theme choice are stored only in your own browser, in local storage. There is no server, no account, no sign-in, no analytics, and no advertising or tracking cookies. Nothing about you is collected, stored, or shared with anyone. Clearing your browser data clears everything this site knows.",
  },
  {
    title: "Corrections and removals",
    body: takedownContact
      ? `If you own rights in anything shown here and would like it removed, or if you spot something inaccurate, email ${takedownContact}. Requests are acted on promptly and in good faith, and no proof of ownership beyond a credible claim is required.`
      : "If you own rights in anything shown here and would like it removed, or if you spot something inaccurate, please get in touch with the site owner. Requests are acted on promptly and in good faith, and no proof of ownership beyond a credible claim is required.",
  },
  {
    title: "Software and fonts",
    body: "The site is built with open source software, including Next.js, React, GSAP, Framer Motion, and Lucide icons, each used under its own licence. Type is set in Oswald and Inter, both open source fonts served through Google Fonts.",
  },
  {
    title: "No warranty",
    body: "This site is provided as is, for entertainment only, with no warranty of any kind. Watch orders and recommendations are one fan's opinion. Always check official sources for release dates, streaming availability, and anything else you plan to rely on.",
  },
];

export default function AboutPage() {
  return (
    <RouteTransition>
      <div className="page-wrap" style={{ ["--page-accent" as string]: "#43b0a0" }}>
        <PageAtmosphere accent="#43b0a0" position="center" />
        <PageHeader
          eyebrow="About and Disclaimer"
          title="About and Disclaimer"
          description="A free fan project with no affiliation to Marvel, Disney, or any studio. Here is where its film information and imagery come from, how they are used, and what happens to your data."
        />

        <div className={styles.about_grid}>
          {sections.map((section) => (
            <section key={section.title} className={styles.about_card}>
              <h2 className={styles["about_card-title"]}>{section.title}</h2>
              <p className={styles["about_card-body"]}>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </RouteTransition>
  );
}
