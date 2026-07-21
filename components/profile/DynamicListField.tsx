"use client";

import { useState } from "react";
import styles from "./DynamicListField.module.css";

export function DynamicListField({
  label,
  hint,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };

  const remove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="field">
      <label>{label}</label>
      {hint && <p className="hint">{hint}</p>}
      <div className={styles.inputRow}>
        <input
          type="text"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className="btn btn-outline" onClick={add}>
          추가
        </button>
      </div>
      <div className={styles.chips}>
        {items.map((item, idx) => (
          <span key={`${item}-${idx}`} className="chip">
            {item}
            <button type="button" aria-label="삭제" onClick={() => remove(idx)}>
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
