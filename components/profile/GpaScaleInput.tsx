"use client";

import styles from "./GpaScaleInput.module.css";

const SCALE_OPTIONS = [4.5, 4.3, 4.0];

export function GpaScaleInput({
  gpa,
  gpaScale,
  onChange,
}: {
  gpa: number | null;
  gpaScale: number;
  onChange: (gpa: number | null, gpaScale: number) => void;
}) {
  return (
    <div className="field">
      <label>학점</label>
      <p className="hint">학교마다 만점 기준이 달라 정규화 비교를 위해 스케일을 함께 선택합니다.</p>
      <div className={styles.row}>
        <input
          type="number"
          step="0.01"
          min="0"
          value={gpa ?? ""}
          placeholder="예: 3.8"
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value), gpaScale)}
        />
        <span className={styles.slash}>/</span>
        <select value={gpaScale} onChange={(e) => onChange(gpa, Number(e.target.value))}>
          {SCALE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s} 만점
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
