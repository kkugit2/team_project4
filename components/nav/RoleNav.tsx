"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "./SessionProvider";
import styles from "./RoleNav.module.css";

export function RoleNav() {
  const { session, logout } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isCompany = session?.role === "company";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const links = !session
    ? [{ href: "/", label: "홈" }]
    : isCompany
      ? [
          { href: "/company", label: "홈" },
          { href: "/company/scouts", label: "스카웃 관리" },
          { href: "/company/mypage", label: "마이페이지" },
        ]
      : [
          { href: "/", label: "홈" },
          { href: "/jobs", label: "공고 둘러보기" },
          { href: "/mypage", label: "마이페이지" },
        ];

  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        <Link href={isCompany ? "/company" : "/"} className={styles.brand}>
          JobMate{isCompany ? " for Biz" : ""}
        </Link>
        <nav className={styles.nav}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? styles.active : ""}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className={styles.right}>
          {session ? (
            <>
              <span className={styles.roleTag}>{isCompany ? "기업" : "구직자"}</span>
              <span className={styles.avatar}>{session.email.charAt(0).toUpperCase()}</span>
              <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.loginLink}>
              로그인 / 회원가입
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
