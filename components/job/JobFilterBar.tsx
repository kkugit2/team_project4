"use client";

import styles from "./JobFilterBar.module.css";

export type JobSort = "due" | "score";

export function JobFilterBar({
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  showScoreSort,
}: {
  categories: string[];
  category: string;
  onCategoryChange: (v: string) => void;
  sort: JobSort;
  onSortChange: (v: JobSort) => void;
  showScoreSort: boolean;
}) {
  return (
    <div className={styles.bar}>
      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">전체 직군</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select value={sort} onChange={(e) => onSortChange(e.target.value as JobSort)}>
        <option value="due">마감임박순</option>
        {showScoreSort && <option value="score">합격확률순</option>}
      </select>
    </div>
  );
}
