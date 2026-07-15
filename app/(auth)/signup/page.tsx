import Link from "next/link";
import styles from "./page.module.css";

export default function SignupRoleSelectPage() {
  return (
    <main className="page">
      <div className="page-header">
        <h1>회원가입</h1>
        <p>역할을 선택하면 그에 맞는 가입 화면으로 이동합니다.</p>
      </div>

      <div className={styles.grid}>
        <Link href="/signup/jobseeker" className={styles.card}>
          <h2>구직자로 시작하기</h2>
          <p>합격 가능성을 진단받고 스카웃 제안을 받아보세요.</p>
        </Link>
        <Link href="/signup/company" className={styles.card}>
          <h2>기업으로 시작하기</h2>
          <p>인재상에 맞는 지원자를 발굴하고 스카웃을 제안하세요.</p>
        </Link>
      </div>

      <p className={styles.footer}>
        이미 계정이 있으신가요? <Link href="/login">로그인</Link>
      </p>
    </main>
  );
}
