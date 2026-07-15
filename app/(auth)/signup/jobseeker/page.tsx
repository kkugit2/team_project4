"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpJobseeker } from "@/lib/auth";
import { isAppError } from "@/lib/errors";
import { getTags } from "@/lib/tags";
import { useSession } from "@/components/nav/SessionProvider";
import { useToast } from "@/components/common/Toast";
import { JobseekerProfileForm } from "@/components/profile/JobseekerProfileForm";
import { emptyJobseekerProfile } from "@/types";
import type { JobseekerProfile, Tag } from "@/types";

export default function JobseekerSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<JobseekerProfile>(emptyJobseekerProfile(""));
  const [skillTags, setSkillTags] = useState<Tag[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { refresh } = useSession();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    getTags("skill").then(setSkillTags);
  }, []);

  const submit = async () => {
    const result = await signUpJobseeker({ email, password, profile });
    if (isAppError(result)) {
      showToast(result.error.message);
      return;
    }
    refresh();
    showToast("가입이 완료되었습니다");
    router.push("/");
  };

  return (
    <main className="page">
      <Link href="/signup" style={{ display: "inline-block", marginBottom: 16, color: "var(--text-muted)", fontSize: 14 }}>
        ← 역할 다시 선택
      </Link>
      <div className="page-header">
        <h1>구직자 회원가입</h1>
        <p>학적·자격증·경력 정보는 지금 건너뛰고 마이페이지에서 나중에 입력해도 됩니다.</p>
      </div>

      <div className="section-card">
        <div className="field">
          <label>이메일</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>비밀번호</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>

      {!showOnboarding ? (
        <div className="section-card">
          <p className="hint">학적·학점·자격증·경력을 지금 입력하시겠어요?</p>
          <div className="action-bar" style={{ display: "flex", gap: 10 }}>
            <button type="button" className="btn btn-outline" onClick={() => setShowOnboarding(true)}>
              지금 입력하기
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!email || !password}
              onClick={submit}
            >
              건너뛰고 가입하기
            </button>
          </div>
        </div>
      ) : (
        <div className="section-card">
          <JobseekerProfileForm value={profile} onChange={setProfile} skillTags={skillTags} />
          <button type="button" className="btn btn-primary" disabled={!email || !password} onClick={submit}>
            가입 완료
          </button>
        </div>
      )}
    </main>
  );
}
