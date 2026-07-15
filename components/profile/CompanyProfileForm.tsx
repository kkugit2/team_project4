"use client";

import type { CompanyProfile, Tag } from "@/types";
import { MOCK_COMPANIES } from "@/data/mockCompanies";
import { DynamicListField } from "./DynamicListField";

export function CompanyProfileForm({
  value,
  onChange,
  skillTags,
}: {
  value: CompanyProfile;
  onChange: (next: CompanyProfile) => void;
  skillTags: Tag[];
}) {
  const set = <K extends keyof CompanyProfile>(key: K, v: CompanyProfile[K]) => onChange({ ...value, [key]: v });

  const toggleSkill = (tagId: number) => {
    const has = value.preferredSkillTagIds.includes(tagId);
    set(
      "preferredSkillTagIds",
      has ? value.preferredSkillTagIds.filter((id) => id !== tagId) : [...value.preferredSkillTagIds, tagId]
    );
  };

  return (
    <div>
      <div className="field">
        <label>회사명</label>
        <input type="text" value={value.companyName} onChange={(e) => set("companyName", e.target.value)} />
      </div>

      <div className="field">
        <label>원티드 등록 기업 연결 (선택)</label>
        <p className="hint">
          연결하면 해당 기업의 실제 공고에 지원한 구직자를 &quot;우리 회사 지원 여부&quot;로 식별할 수 있습니다.
        </p>
        <select
          value={value.wantedCompanyId ?? ""}
          onChange={(e) => set("wantedCompanyId", e.target.value || undefined)}
        >
          <option value="">연결 안 함</option>
          {MOCK_COMPANIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>선호 최소 학점 (4.5만점 기준, 선택)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="4.5"
          value={value.preferredGpaMin ?? ""}
          onChange={(e) => set("preferredGpaMin", e.target.value === "" ? null : Number(e.target.value))}
        />
      </div>

      <div className="field">
        <label>선호 기술 스택</label>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {skillTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={`chip ${value.preferredSkillTagIds.includes(tag.id) ? "chip-success" : ""}`}
              onClick={() => toggleSkill(tag.id)}
            >
              {value.preferredSkillTagIds.includes(tag.id) ? "✓ " : ""}
              {tag.title}
            </button>
          ))}
        </div>
      </div>

      <DynamicListField
        label="선호 유사 경험 키워드"
        hint="지원자의 경력 항목과 대조할 키워드입니다. 예: 백엔드, 데이터 분석, 커머스"
        items={value.preferredExperienceType}
        onChange={(items) => set("preferredExperienceType", items)}
        placeholder="예: 백엔드"
      />

      <div className="field">
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={value.internshipRequired}
            onChange={(e) => set("internshipRequired", e.target.checked)}
          />
          인턴십 경험 필수
        </label>
      </div>
    </div>
  );
}
