// 회원가입/로그인 공통 로직 — 역할 우선 분기 폼 렌더링 + 이메일 인증 대기 시 프로필 생성 보류
import { supabase } from "./supabaseClient.js";

const PENDING_KEY = "matchboard_pending_signup";

export function savePendingSignup(email, role, profileData) {
  localStorage.setItem(PENDING_KEY, JSON.stringify({ email, role, profileData }));
}

function clearPendingSignup() {
  localStorage.removeItem(PENDING_KEY);
}

// 이메일 인증이 필요해 가입 직후 세션이 없던 사용자가, 최초 로그인 시 프로필을 마저 생성하도록 함
export async function tryConsumePendingSignup(user) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (existing?.role) return existing.role;

  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return null;

  const pending = JSON.parse(raw);
  if (pending.email !== user.email) return null;

  await createProfileRows(user.id, pending.role, pending.profileData);
  clearPendingSignup();
  return pending.role;
}

export async function createProfileRows(userId, role, profileData) {
  const { error: profileErr } = await supabase.from("profiles").insert({ id: userId, role });
  if (profileErr && profileErr.code !== "23505") throw profileErr; // 23505 = 이미 존재(중복) 무시

  if (role === "jobseeker") {
    const { error } = await supabase.from("jobseeker_profile").insert({
      user_id: userId,
      school: profileData.school || null,
      major: profileData.major || null,
      graduation_status: profileData.graduation_status || null,
      gpa: profileData.gpa || null,
      gpa_scale: profileData.gpa_scale || null,
      certifications: profileData.certifications || [],
      career_history: profileData.career_history || [],
      career_years: profileData.career_years || 0,
      skills: profileData.skills || [],
    });
    if (error) throw error;
  } else {
    const { error } = await supabase.from("company_profile").insert({
      user_id: userId,
      company_name: profileData.company_name,
      preferred_gpa_min: profileData.preferred_gpa_min || null,
      preferred_skills: profileData.preferred_skills || [],
      preferred_experience_type: profileData.preferred_experience_type || [],
      internship_required: !!profileData.internship_required,
    });
    if (error) throw error;
  }
}

// ---------- 구직자 가입 폼 ----------

export function renderJobseekerForm(container) {
  container.innerHTML = `
    <form id="signup-form" class="stack">
      <div class="field">
        <label for="su-email">이메일 (아이디)</label>
        <input type="email" id="su-email" required autocomplete="email" />
      </div>
      <div class="field">
        <label for="su-password">비밀번호</label>
        <input type="password" id="su-password" required minlength="6" autocomplete="new-password" />
      </div>

      <div class="row wrap">
        <div class="field grow">
          <label for="su-school">학교</label>
          <input type="text" id="su-school" placeholder="예: 원티드대학교" />
        </div>
        <div class="field grow">
          <label for="su-major">전공</label>
          <input type="text" id="su-major" placeholder="예: 컴퓨터공학" />
        </div>
      </div>

      <div class="row wrap">
        <div class="field grow">
          <label for="su-grad-status">졸업 여부</label>
          <select id="su-grad-status">
            <option value="졸업">졸업</option>
            <option value="졸업예정">졸업예정</option>
            <option value="재학">재학</option>
          </select>
        </div>
        <div class="field grow">
          <label for="su-gpa">학점</label>
          <input type="number" id="su-gpa" step="0.01" min="0" placeholder="예: 3.8" />
        </div>
        <div class="field grow">
          <label for="su-gpa-scale">학점 만점 기준</label>
          <select id="su-gpa-scale">
            <option value="4.5">4.5</option>
            <option value="4.3">4.3</option>
            <option value="4.0">4.0</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label for="su-skills">보유 기술 스택 (쉼표로 구분)</label>
        <input type="text" id="su-skills" placeholder="예: Python, SQL, React" />
        <div class="help-text">공고와의 매칭도 계산에 사용됩니다.</div>
      </div>

      <div class="field">
        <label>자격증</label>
        <div id="cert-rows" class="stack" style="gap:8px;"></div>
        <button type="button" class="btn btn-ghost btn-sm" id="add-cert" style="margin-top:8px;">+ 자격증 추가</button>
      </div>

      <div class="field">
        <label>경력</label>
        <div id="career-rows" class="stack" style="gap:8px;"></div>
        <button type="button" class="btn btn-ghost btn-sm" id="add-career" style="margin-top:8px;">+ 경력 추가</button>
      </div>

      <div id="signup-error" class="notice-box" style="display:none; color:var(--warn);"></div>
      <button type="submit" class="btn btn-primary btn-block" id="signup-submit">구직자로 가입하기</button>
    </form>
  `;

  wireDynamicRows(container, "cert-rows", "add-cert", certRowHtml);
  wireDynamicRows(container, "career-rows", "add-career", careerRowHtml);

  return {
    collect() {
      const skills = splitCsv(container.querySelector("#su-skills").value);
      const certifications = Array.from(container.querySelectorAll(".cert-row-input"))
        .map((i) => i.value.trim())
        .filter(Boolean);
      const careerHistory = Array.from(container.querySelectorAll(".career-row")).map((row) => ({
        company: row.querySelector(".career-company").value.trim(),
        period: row.querySelector(".career-period").value.trim(),
        type: row.querySelector(".career-type").value.trim(),
      })).filter((c) => c.company || c.type);

      const careerYears = careerHistory.reduce((sum, c) => sum + parsePeriodYears(c.period), 0);

      return {
        email: container.querySelector("#su-email").value.trim(),
        password: container.querySelector("#su-password").value,
        profileData: {
          school: container.querySelector("#su-school").value.trim(),
          major: container.querySelector("#su-major").value.trim(),
          graduation_status: container.querySelector("#su-grad-status").value,
          gpa: parseFloat(container.querySelector("#su-gpa").value) || null,
          gpa_scale: parseFloat(container.querySelector("#su-gpa-scale").value),
          skills,
          certifications,
          career_history: careerHistory,
          career_years: Math.round(careerYears * 10) / 10,
        },
      };
    },
  };
}

function certRowHtml(value = "") {
  return `<div class="row"><input type="text" class="cert-row-input" placeholder="예: 정보처리기사" value="${escapeAttr(value)}" /><button type="button" class="btn btn-ghost btn-sm remove-row">삭제</button></div>`;
}

function careerRowHtml(data = {}) {
  return `
    <div class="row wrap career-row" style="border:1px solid var(--line); border-radius:8px; padding:10px;">
      <input type="text" class="career-company grow" placeholder="회사명" value="${escapeAttr(data.company || "")}" />
      <input type="text" class="career-period" placeholder="기간 (예: 2023.01-2024.06)" style="width:190px;" value="${escapeAttr(data.period || "")}" />
      <input type="text" class="career-type" placeholder="구분 (예: 인턴, 정규직)" style="width:150px;" value="${escapeAttr(data.type || "")}" />
      <button type="button" class="btn btn-ghost btn-sm remove-row">삭제</button>
    </div>`;
}

function escapeAttr(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function wireDynamicRows(container, listId, addBtnId, rowHtmlFn, initialItems = [undefined]) {
  const list = container.querySelector(`#${listId}`);
  const addBtn = container.querySelector(`#${addBtnId}`);

  const addRow = (item) => {
    const wrap = document.createElement("div");
    wrap.innerHTML = rowHtmlFn(item);
    const row = wrap.firstElementChild;
    row.querySelector(".remove-row").addEventListener("click", () => row.remove());
    list.appendChild(row);
  };

  addBtn.addEventListener("click", () => addRow());
  (initialItems.length ? initialItems : [undefined]).forEach(addRow);
}

// ---------- 마이페이지: 구직자 프로필 수정 폼 (이메일/비밀번호 없이 프로필 필드만) ----------

export function renderJobseekerProfileEditForm(container, existing) {
  const skillsValue = (existing?.skills || []).join(", ");

  container.innerHTML = `
    <form id="profile-edit-form" class="stack">
      <div class="row wrap">
        <div class="field grow">
          <label for="pe-school">학교</label>
          <input type="text" id="pe-school" value="${escapeAttr(existing?.school || "")}" />
        </div>
        <div class="field grow">
          <label for="pe-major">전공</label>
          <input type="text" id="pe-major" value="${escapeAttr(existing?.major || "")}" />
        </div>
      </div>
      <div class="row wrap">
        <div class="field grow">
          <label for="pe-grad-status">졸업 여부</label>
          <select id="pe-grad-status">
            <option value="졸업" ${existing?.graduation_status === "졸업" ? "selected" : ""}>졸업</option>
            <option value="졸업예정" ${existing?.graduation_status === "졸업예정" ? "selected" : ""}>졸업예정</option>
            <option value="재학" ${existing?.graduation_status === "재학" ? "selected" : ""}>재학</option>
          </select>
        </div>
        <div class="field grow">
          <label for="pe-gpa">학점</label>
          <input type="number" id="pe-gpa" step="0.01" min="0" value="${existing?.gpa ?? ""}" />
        </div>
        <div class="field grow">
          <label for="pe-gpa-scale">학점 만점 기준</label>
          <select id="pe-gpa-scale">
            <option value="4.5" ${existing?.gpa_scale == 4.5 ? "selected" : ""}>4.5</option>
            <option value="4.3" ${existing?.gpa_scale == 4.3 ? "selected" : ""}>4.3</option>
            <option value="4.0" ${existing?.gpa_scale == 4.0 ? "selected" : ""}>4.0</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label for="pe-skills">보유 기술 스택 (쉼표로 구분)</label>
        <input type="text" id="pe-skills" value="${escapeAttr(skillsValue)}" />
      </div>
      <div class="field">
        <label>자격증</label>
        <div id="pe-cert-rows" class="stack" style="gap:8px;"></div>
        <button type="button" class="btn btn-ghost btn-sm" id="pe-add-cert" style="margin-top:8px;">+ 자격증 추가</button>
      </div>
      <div class="field">
        <label>경력</label>
        <div id="pe-career-rows" class="stack" style="gap:8px;"></div>
        <button type="button" class="btn btn-ghost btn-sm" id="pe-add-career" style="margin-top:8px;">+ 경력 추가</button>
      </div>
      <button type="submit" class="btn btn-primary" id="profile-save-btn">저장하기</button>
      <span id="profile-save-msg" class="muted" style="font-size:13px;"></span>
    </form>
  `;

  wireDynamicRows(container, "pe-cert-rows", "pe-add-cert", certRowHtml, existing?.certifications?.length ? existing.certifications : [undefined]);
  wireDynamicRows(container, "pe-career-rows", "pe-add-career", careerRowHtml, existing?.career_history?.length ? existing.career_history : [undefined]);

  return {
    collect() {
      const skills = splitCsv(container.querySelector("#pe-skills").value);
      const certifications = Array.from(container.querySelectorAll(".cert-row-input"))
        .map((i) => i.value.trim())
        .filter(Boolean);
      const careerHistory = Array.from(container.querySelectorAll(".career-row")).map((row) => ({
        company: row.querySelector(".career-company").value.trim(),
        period: row.querySelector(".career-period").value.trim(),
        type: row.querySelector(".career-type").value.trim(),
      })).filter((c) => c.company || c.type);
      const careerYears = careerHistory.reduce((sum, c) => sum + parsePeriodYears(c.period), 0);

      return {
        school: container.querySelector("#pe-school").value.trim(),
        major: container.querySelector("#pe-major").value.trim(),
        graduation_status: container.querySelector("#pe-grad-status").value,
        gpa: parseFloat(container.querySelector("#pe-gpa").value) || null,
        gpa_scale: parseFloat(container.querySelector("#pe-gpa-scale").value),
        skills,
        certifications,
        career_history: careerHistory,
        career_years: Math.round(careerYears * 10) / 10,
      };
    },
  };
}

// ---------- 마이페이지: 기업 인재상 수정 폼 ----------

export function renderCompanyProfileEditForm(container, existing) {
  container.innerHTML = `
    <form id="profile-edit-form" class="stack">
      <div class="field">
        <label for="pe-company-name">회사명</label>
        <input type="text" id="pe-company-name" value="${escapeAttr(existing?.company_name || "")}" required />
      </div>
      <div class="field">
        <label for="pe-min-gpa">최소 학점 기준 (4.5 만점 환산)</label>
        <input type="number" id="pe-min-gpa" step="0.1" min="0" max="4.5" value="${existing?.preferred_gpa_min ?? ""}" />
      </div>
      <div class="field">
        <label for="pe-pref-skills">원하는 기술 스택 (쉼표로 구분)</label>
        <input type="text" id="pe-pref-skills" value="${escapeAttr((existing?.preferred_skills || []).join(", "))}" />
      </div>
      <div class="field">
        <label for="pe-pref-exp">원하는 유사 경험 유형 (쉼표로 구분)</label>
        <input type="text" id="pe-pref-exp" value="${escapeAttr((existing?.preferred_experience_type || []).join(", "))}" />
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="pe-internship-required" ${existing?.internship_required ? "checked" : ""} />
        <label for="pe-internship-required" style="margin:0;">인턴십 경험 필수</label>
      </div>
      <button type="submit" class="btn btn-primary" id="profile-save-btn" style="margin-top:6px;">저장하기</button>
      <span id="profile-save-msg" class="muted" style="font-size:13px;"></span>
    </form>
  `;

  return {
    collect() {
      return {
        company_name: container.querySelector("#pe-company-name").value.trim(),
        preferred_gpa_min: parseFloat(container.querySelector("#pe-min-gpa").value) || null,
        preferred_skills: splitCsv(container.querySelector("#pe-pref-skills").value),
        preferred_experience_type: splitCsv(container.querySelector("#pe-pref-exp").value),
        internship_required: container.querySelector("#pe-internship-required").checked,
      };
    },
  };
}

function splitCsv(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parsePeriodYears(period) {
  // "2023.01-2024.06" 형태에서 대략적인 연차(년)를 추정. 파싱 실패 시 0.5년으로 처리.
  const m = String(period || "").match(/(\d{4})[.\-\/](\d{1,2}).*?(\d{4})[.\-\/](\d{1,2})/);
  if (!m) return period ? 0.5 : 0;
  const [, y1, mo1, y2, mo2] = m.map(Number);
  const months = (y2 - y1) * 12 + (mo2 - mo1);
  return Math.max(0, months / 12);
}

// ---------- 기업 가입 폼 ----------

export function renderCompanyForm(container) {
  container.innerHTML = `
    <form id="signup-form" class="stack">
      <div class="field">
        <label for="su-email">이메일 (아이디)</label>
        <input type="email" id="su-email" required autocomplete="email" />
      </div>
      <div class="field">
        <label for="su-password">비밀번호</label>
        <input type="password" id="su-password" required minlength="6" autocomplete="new-password" />
      </div>
      <div class="field">
        <label for="su-company-name">회사명</label>
        <input type="text" id="su-company-name" required />
      </div>

      <div class="notice-box" style="margin-bottom:4px;">
        MVP 단계로 별도 기업 인증 없이 자체 신고 기반으로 운영됩니다.
      </div>

      <h3 style="margin-top:8px;">원하는 인재상</h3>
      <div class="field">
        <label for="su-min-gpa">최소 학점 기준 (4.5 만점 환산)</label>
        <input type="number" id="su-min-gpa" step="0.1" min="0" max="4.5" placeholder="예: 3.5" />
      </div>
      <div class="field">
        <label for="su-pref-skills">원하는 기술 스택 (쉼표로 구분)</label>
        <input type="text" id="su-pref-skills" placeholder="예: Python, SQL, React" />
      </div>
      <div class="field">
        <label for="su-pref-exp">원하는 유사 경험 유형 (쉼표로 구분)</label>
        <input type="text" id="su-pref-exp" placeholder="예: 인턴, 프로젝트, 정규직" />
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="su-internship-required" />
        <label for="su-internship-required" style="margin:0;">인턴십 경험 필수</label>
      </div>

      <div id="signup-error" class="notice-box" style="display:none; color:var(--warn); margin-top:8px;"></div>
      <button type="submit" class="btn btn-primary btn-block" id="signup-submit" style="margin-top:8px;">기업으로 가입하기</button>
    </form>
  `;

  return {
    collect() {
      return {
        email: container.querySelector("#su-email").value.trim(),
        password: container.querySelector("#su-password").value,
        profileData: {
          company_name: container.querySelector("#su-company-name").value.trim(),
          preferred_gpa_min: parseFloat(container.querySelector("#su-min-gpa").value) || null,
          preferred_skills: splitCsv(container.querySelector("#su-pref-skills").value),
          preferred_experience_type: splitCsv(container.querySelector("#su-pref-exp").value),
          internship_required: container.querySelector("#su-internship-required").checked,
        },
      };
    },
  };
}

export async function submitSignup(role, formHandle, errorBoxId, submitBtnId) {
  const container = document;
  const errorBox = container.getElementById(errorBoxId);
  const submitBtn = container.getElementById(submitBtnId);
  errorBox.style.display = "none";

  const { email, password, profileData } = formHandle.collect();

  if (!email || !password) {
    errorBox.textContent = "이메일과 비밀번호를 입력해주세요.";
    errorBox.style.display = "block";
    return false;
  }
  if (role === "company" && !profileData.company_name) {
    errorBox.textContent = "회사명을 입력해주세요.";
    errorBox.style.display = "block";
    return false;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "가입 처리 중...";

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    errorBox.textContent = error.message.includes("already registered")
      ? "이미 가입된 이메일입니다."
      : error.message;
    errorBox.style.display = "block";
    submitBtn.disabled = false;
    submitBtn.textContent = role === "company" ? "기업으로 가입하기" : "구직자로 가입하기";
    return false;
  }

  if (data.session) {
    // 이메일 인증이 꺼져 있어 즉시 세션이 생기는 경우 — 바로 프로필 생성
    await createProfileRows(data.user.id, role, profileData);
    window.location.href = role === "company" ? "company-home.html" : "jobseeker-home.html";
    return true;
  }

  // 이메일 인증이 필요한 경우 — 인증 후 최초 로그인 시 프로필을 생성하도록 보류
  savePendingSignup(email, role, profileData);
  errorBox.style.display = "block";
  errorBox.style.color = "var(--navy)";
  errorBox.textContent = "가입 확인 이메일을 보냈습니다. 이메일 인증 후 로그인해주세요.";
  submitBtn.textContent = "이메일 인증 대기 중";
  return true;
}
