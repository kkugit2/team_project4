"use client";

import type { JobseekerProfile, CareerEntry, Tag } from "@/types";
import { DynamicListField } from "./DynamicListField";
import { GpaScaleInput } from "./GpaScaleInput";
import styles from "./JobseekerProfileForm.module.css";

function emptyCareerEntry(): CareerEntry {
  return { company: "", period: "", role: "", isInternship: false };
}

export function JobseekerProfileForm({
  value,
  onChange,
  skillTags,
}: {
  value: JobseekerProfile;
  onChange: (next: JobseekerProfile) => void;
  skillTags: Tag[];
}) {
  const set = <K extends keyof JobseekerProfile>(key: K, v: JobseekerProfile[K]) =>
    onChange({ ...value, [key]: v });

  const toggleSkill = (tagId: number) => {
    const has = value.skillTagIds.includes(tagId);
    set("skillTagIds", has ? value.skillTagIds.filter((id) => id !== tagId) : [...value.skillTagIds, tagId]);
  };

  const updateCareer = (idx: number, patch: Partial<CareerEntry>) => {
    const next = value.careerHistory.map((c, i) => (i === idx ? { ...c, ...patch } : c));
    set("careerHistory", next);
  };

  const removeCareer = (idx: number) => {
    set(
      "careerHistory",
      value.careerHistory.filter((_, i) => i !== idx)
    );
  };

  return (
    <div>
      <div className="field">
        <label>학교</label>
        <input type="text" value={value.school} onChange={(e) => set("school", e.target.value)} />
      </div>
      <div className="field">
        <label>전공</label>
        <input type="text" value={value.major} onChange={(e) => set("major", e.target.value)} />
      </div>
      <div className="field">
        <label>졸업 여부</label>
        <select value={value.graduationStatus} onChange={(e) => set("graduationStatus", e.target.value)}>
          <option value="">선택 안 함</option>
          <option value="졸업">졸업</option>
          <option value="졸업예정">졸업예정</option>
          <option value="재학">재학</option>
        </select>
      </div>

      <GpaScaleInput gpa={value.gpa} gpaScale={value.gpaScale} onChange={(gpa, gpaScale) => onChange({ ...value, gpa, gpaScale })} />

      <DynamicListField
        label="자격증"
        hint="보유한 자격증을 하나씩 입력 후 추가하세요."
        items={value.certifications}
        onChange={(items) => set("certifications", items)}
        placeholder="예: 정보처리기사"
      />

      <div className="field">
        <label>기술 스택</label>
        <p className="hint">표기 차이로 인한 매칭 실패를 막기 위해 태그 목록에서 선택합니다.</p>
        <div className={styles.skillGrid}>
          {skillTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={`chip ${value.skillTagIds.includes(tag.id) ? "chip-success" : ""}`}
              onClick={() => toggleSkill(tag.id)}
            >
              {value.skillTagIds.includes(tag.id) ? "✓ " : ""}
              {tag.title}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>경력</label>
        <p className="hint">인턴십 경험 여부를 함께 체크해주세요.</p>
        {value.careerHistory.map((entry, idx) => (
          <div key={idx} className={styles.careerRow}>
            <input
              type="text"
              placeholder="회사명"
              value={entry.company}
              onChange={(e) => updateCareer(idx, { company: e.target.value })}
            />
            <input
              type="text"
              placeholder="기간 (예: 2024.01-2024.06)"
              value={entry.period}
              onChange={(e) => updateCareer(idx, { period: e.target.value })}
            />
            <input
              type="text"
              placeholder="직무"
              value={entry.role}
              onChange={(e) => updateCareer(idx, { role: e.target.value })}
            />
            <label className={styles.internshipLabel}>
              <input
                type="checkbox"
                checked={entry.isInternship}
                onChange={(e) => updateCareer(idx, { isInternship: e.target.checked })}
              />
              인턴십
            </label>
            <button type="button" className="btn btn-outline" onClick={() => removeCareer(idx)}>
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => set("careerHistory", [...value.careerHistory, emptyCareerEntry()])}
        >
          + 경력 추가
        </button>
      </div>
    </div>
  );
}
