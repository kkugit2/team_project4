"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/auth";
import { isAppError } from "@/lib/errors";
import { useSession } from "@/components/nav/SessionProvider";
import { useToast } from "@/components/common/Toast";
import styles from "./page.module.css";

export default function LoginPage() {
  const [role, setRole] = useState<"jobseeker" | "company">("jobseeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { refresh } = useSession();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (isAppError(result)) {
      showToast(result.error.message);
      return;
    }
    if (result.role !== role) {
      showToast("선택한 역할과 계정의 역할이 다릅니다.");
      return;
    }
    refresh();
    router.push(result.role === "company" ? "/company" : "/");
  };

  return (
    <main className="page">
      <div className="page-header">
        <h1>로그인</h1>
        <p>구직자 또는 기업 계정으로 로그인하세요.</p>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={role === "jobseeker" ? styles.active : ""}
          onClick={() => setRole("jobseeker")}
        >
          구직자
        </button>
        <button
          type="button"
          className={role === "company" ? styles.companyActive : ""}
          onClick={() => setRole("company")}
        >
          기업
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="field">
          <label>이메일</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>비밀번호</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className={`btn ${role === "company" ? "btn-company" : "btn-primary"}`} style={{ width: "100%" }}>
          로그인
        </button>
      </form>

      <p className={styles.footer}>
        아직 계정이 없으신가요?{" "}
        <Link href={role === "company" ? "/signup/company" : "/signup/jobseeker"}>
          {role === "company" ? "기업 회원가입" : "구직자 회원가입"}
        </Link>
      </p>
    </main>
  );
}
