// 로그인 후 화면에 공통으로 쓰이는 상단 내비게이션 (역할별로 메뉴 구성이 다름)
import { getCurrentProfile, signOut } from "./supabaseClient.js";

const NAV_LINKS = {
  jobseeker: [
    { key: "home", href: "jobseeker-home.html", label: "홈" },
    { key: "jobs", href: "jobs.html", label: "공고 둘러보기" },
    { key: "mypage", href: "mypage.html", label: "마이페이지" },
  ],
  company: [
    { key: "home", href: "company-home.html", label: "홈" },
    { key: "scouts", href: "scout-management.html", label: "스카웃 관리" },
    { key: "mypage", href: "mypage.html", label: "마이페이지" },
  ],
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

export async function initNav(activeKey) {
  const root = document.getElementById("topnav-root");
  if (!root) return null;

  const { user, role } = await getCurrentProfile();

  if (!user || !role) {
    root.innerHTML = `
      <nav class="topnav">
        <div class="container">
          <a class="logo" href="index.html">매치보드</a>
          <div class="nav-right">
            <a class="btn btn-secondary btn-sm" href="index.html">로그인</a>
          </div>
        </div>
      </nav>`;
    return { user: null, role: null };
  }

  const links = NAV_LINKS[role] || [];
  const linksHtml = links
    .map(
      (l) =>
        `<a href="${l.href}" class="${l.key === activeKey ? "active" : ""}">${escapeHtml(l.label)}</a>`
    )
    .join("");

  const roleLabel = role === "company" ? "기업" : "구직자";
  const initial = (user.email || "?").charAt(0).toUpperCase();

  root.innerHTML = `
    <nav class="topnav">
      <div class="container">
        <a class="logo" href="${role === "company" ? "company-home.html" : "jobseeker-home.html"}">매치보드</a>
        <div class="nav-links">${linksHtml}</div>
        <div class="nav-right">
          <span class="role-tag">${roleLabel}</span>
          <span class="avatar" title="${escapeHtml(user.email || "")}">${escapeHtml(initial)}</span>
          <button class="btn btn-ghost btn-sm" id="nav-logout-btn">로그아웃</button>
        </div>
      </div>
    </nav>`;

  document.getElementById("nav-logout-btn").addEventListener("click", signOut);

  return { user, role };
}
