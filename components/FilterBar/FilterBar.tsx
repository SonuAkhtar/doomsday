"use client";

import { useState } from "react";
import type {
  MovieQuery,
  PhaseFilter,
  RelevanceFilter,
  SortOrder,
  WatchedFilter,
} from "@/lib/movieFilters";
import styles from "./FilterBar.module.css";

interface FilterBarProps {
  query: MovieQuery;
  phases: number[];
  resultCount: number;
  onChange: (patch: Partial<MovieQuery>) => void;
  onReset: () => void;
}

interface Chip<T> {
  value: T;
  label: string;
}

function ChipGroup<T extends string | number>({
  legend,
  chips,
  current,
  onSelect,
}: {
  legend: string;
  chips: Chip<T>[];
  current: T;
  onSelect: (value: T) => void;
}) {
  return (
    <fieldset className={styles.filter_group}>
      <legend className={styles["filter_group-legend"]}>{legend}</legend>
      <div className={styles["filter_group-chips"]}>
        {chips.map((chip) => (
          <button
            key={String(chip.value)}
            type="button"
            className={`${styles.filter_chip} ${current === chip.value ? styles["filter_chip--on"] : ""}`}
            aria-pressed={current === chip.value}
            onClick={() => onSelect(chip.value)}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function FilterBar({ query, phases, resultCount, onChange, onReset }: FilterBarProps) {
  const [open, setOpen] = useState(false);

  const activeCount =
    (query.phase !== "all" ? 1 : 0) +
    (query.watched !== "all" ? 1 : 0) +
    (query.relevance !== "all" ? 1 : 0);

  const phaseChips: Chip<PhaseFilter>[] = [
    { value: "all", label: "All" },
    ...phases.map((phase) => ({ value: phase, label: `Phase ${phase}` })),
  ];
  const watchedChips: Chip<WatchedFilter>[] = [
    { value: "all", label: "All" },
    { value: "unwatched", label: "To watch" },
    { value: "watched", label: "Watched" },
  ];
  const relevanceChips: Chip<RelevanceFilter>[] = [
    { value: "all", label: "All" },
    { value: "required", label: "In journey" },
    { value: "optional", label: "Optional" },
  ];

  const isDefault =
    query.search === "" &&
    query.phase === "all" &&
    query.watched === "all" &&
    query.relevance === "all" &&
    query.sort === "recommended";

  return (
    <div className={styles.filter_bar}>
      <div className={styles["filter_bar-top"]}>
        <label className={styles.filter_search}>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.7" />
            <path d="m14 14 3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query.search}
            placeholder="Search movies"
            aria-label="Search movies"
            onChange={(event) => onChange({ search: event.target.value })}
          />
        </label>

        <div className={styles["filter_bar-controls"]}>
        <label className={styles.filter_sort}>
          <span className="visually-hidden">Sort order</span>
          <select
            value={query.sort}
            onChange={(event) => onChange({ sort: event.target.value as SortOrder })}
          >
            <option value="recommended">Recommended</option>
            <option value="release">Release date</option>
            <option value="chronological">Story order</option>
          </select>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </label>

        <button
          type="button"
          className={styles["filter_bar-toggle"]}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span>
            Filters
            {activeCount > 0 && <span className={styles["filter_bar-toggle-count"]}>{activeCount}</span>}
          </span>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" data-open={open}>
            <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        </div>
      </div>

      <div className={`${styles["filter_bar-collapse"]} ${open ? styles["filter_bar-collapse--open"] : ""}`}>
        <div className={styles["filter_bar-groups"]}>
          <ChipGroup legend="Phase" chips={phaseChips} current={query.phase} onSelect={(value) => onChange({ phase: value })} />
          <ChipGroup legend="Status" chips={watchedChips} current={query.watched} onSelect={(value) => onChange({ watched: value })} />
          <ChipGroup legend="Relevance" chips={relevanceChips} current={query.relevance} onSelect={(value) => onChange({ relevance: value })} />
        </div>
      </div>

      <div className={styles["filter_bar-foot"]}>
        <span className={styles["filter_bar-count"]}>
          {resultCount} {resultCount === 1 ? "movie" : "movies"}
        </span>
        {!isDefault && (
          <button type="button" className={styles["filter_bar-reset"]} onClick={onReset}>
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
