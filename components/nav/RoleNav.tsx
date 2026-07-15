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
          { href: "/company/mypage", label: "마이페이지" },
        ]
      : [
          { href: "/", label: "홈" },
          { href: "/mypage", label: "마이페이지" },
          { href: "/self-intro", label: "자소서 분석" },
        ];

  return (
    <header className={`${styles.topbar} ${isCompany ? styles.company : ""}`}>
      <div className={styles.inner}>
        <Link href={isCompany ? "/company" : "/"} className={`${styles.brand} ${isCompany ? styles.company : ""}`}>
          JobMate{isCompany ? " for Biz" : ""}
        </Link>
        <nav className={styles.nav}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? styles.active : ""}>
              {l.label}
            </Link>
          ))}
          {session ? (
            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
              로그아웃
            </button>
          ) : (
            <Link href="/login">로그인 / 회원가입</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
