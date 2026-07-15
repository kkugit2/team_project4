"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpCompany } from "@/lib/auth";
import { isAppError } from "@/lib/errors";
import { getTags } from "@/lib/tags";
import { useSession } from "@/components/nav/SessionProvider";
import { useToast } from "@/components/common/Toast";
import { CompanyProfileForm } from "@/components/profile/CompanyProfileForm";
import { DisclaimerBanner } from "@/components/common/DisclaimerBanner";
import { emptyCompanyProfile } from "@/types";
import type { CompanyProfile, Tag } from "@/types";

export default function CompanySignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<CompanyProfile>(emptyCompanyProfile("", ""));
  const [skillTags, setSkillTags] = useState<Tag[]>([]);
  const { refresh } = useSession();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    getTags("skill").then(setSkillTags);
  }, []);

  const submit = () => {
    if (!profile.companyName.trim()) {
      showToast("회사명을 입력해주세요.");
      return;
    }
    const result = signUpCompany({ email, password, companyName: profile.companyName, profile });
    if (isAppError(result)) {
      showToast(result.error.message);
      return;
    }
    refresh();
    showToast("가입이 완료되었습니다");
    router.push("/company");
  };

  return (
    <main className="page">
      <div className="page-header">
        <h1>기업 회원가입</h1>
        <p>인재상 정보를 입력하면 지원자와의 부합도를 자동으로 계산해드립니다.</p>
      </div>

      <DisclaimerBanner>
        MVP 단계로 별도 사업자 인증 없이 자체 신고 기반으로 운영됩니다. (추후 확장 시 인증 절차 추가 예정)
      </DisclaimerBanner>

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

      <div className="section-card">
        <CompanyProfileForm value={profile} onChange={setProfile} skillTags={skillTags} />
        <button type="button" className="btn btn-company" disabled={!email || !password} onClick={submit}>
          가입 완료
        </button>
      </div>
    </main>
  );
}
