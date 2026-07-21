// 구직자 홈 통계 분석 — 자체 데이터 기반 강점/약점, 시장 비교 (LLM 없이 규칙 기반)

const SKILL_CATEGORIES = [
  { label: "백엔드", keywords: ["java", "spring", "node", "python", "django", "flask", "go", "kotlin", "php", "ruby", "rdbms", "mysql", "postgresql", "mongodb", "redis", "kafka", "grpc", "django"] },
  { label: "프론트엔드", keywords: ["react", "vue", "javascript", "typescript", "html", "css", "next.js", "svelte", "jquery"] },
  { label: "데이터/AI", keywords: ["sql", "pandas", "pytorch", "tensorflow", "machine learning", "머신러닝", "데이터", "airflow", "spark", "hadoop", "llm", "nlp", "ai"] },
  { label: "인프라/클라우드", keywords: ["aws", "gcp", "azure", "docker", "kubernetes", "terraform", "jenkins", "ci/cd", "linux", "devops"] },
];

function classifySkill(skill) {
  const s = String(skill).toLowerCase();
  for (const cat of SKILL_CATEGORIES) {
    if (cat.keywords.some((k) => s.includes(k))) return cat.label;
  }
  return "기타";
}

export function buildSkillDonut(skills) {
  if (!skills || !skills.length) return [];
  const counts = {};
  skills.forEach((s) => {
    const label = classifySkill(s);
    counts[label] = (counts[label] || 0) + 1;
  });
  const total = skills.length;
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);
}

function marketSkillFrequency(jobs) {
  const freq = {};
  jobs.forEach((job) => {
    (job.skill_tags || []).forEach((t) => {
      const title = t.title;
      if (!title) return;
      freq[title] = (freq[title] || 0) + 1;
    });
  });
  return freq;
}

export function computeJobseekerInsights(profile, jobs) {
  const careerYears = Number(profile.career_years) || 0;
  const skills = profile.skills || [];
  const certifications = profile.certifications || [];

  const eligibleJobs = jobs.filter((job) => {
    const from = job.annual_from ?? 0;
    const to = job.annual_to;
    return careerYears >= from && (to == null || to === 0 || careerYears <= to);
  });

  const marketAvgCareer =
    jobs.reduce((sum, j) => sum + (j.annual_from ?? 0), 0) / (jobs.length || 1);
  const marketAvgSkillCount =
    jobs.reduce((sum, j) => sum + (j.skill_tags || []).length, 0) / (jobs.length || 1);

  const freq = marketSkillFrequency(jobs);
  const mySkillsLower = new Set(skills.map((s) => s.toLowerCase()));

  const myInDemandSkills = skills
    .filter((s) => freq[s])
    .sort((a, b) => (freq[b] || 0) - (freq[a] || 0))
    .slice(0, 3);

  const topMarketSkills = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([title]) => title)
    .filter((title) => !mySkillsLower.has(title.toLowerCase()))
    .slice(0, 3);

  const strengths = [];
  const improvements = [];

  if (myInDemandSkills.length) {
    strengths.push(
      `${myInDemandSkills.join(", ")} 기술은 현재 채용 시장에서 자주 찾는 기술이에요.`
    );
  }
  if (careerYears >= marketAvgCareer) {
    strengths.push(
      `보유 경력(${careerYears.toFixed(1)}년)이 채용 공고 평균 요구 연차(${marketAvgCareer.toFixed(
        1
      )}년) 이상이에요.`
    );
  }
  if (certifications.length > 0) {
    strengths.push(`자격증 ${certifications.length}개를 보유하고 있어요.`);
  }
  if (!strengths.length) {
    strengths.push("아직 강점으로 부각할 데이터가 부족해요 — 마이페이지에서 프로필을 보완해보세요.");
  }

  if (topMarketSkills.length) {
    improvements.push(
      `${topMarketSkills.join(", ")}을(를) 추가로 학습하면 지원 가능한 공고가 늘어날 수 있어요.`
    );
  }
  if (careerYears < marketAvgCareer) {
    improvements.push(
      `공고 평균 요구 연차(${marketAvgCareer.toFixed(1)}년)보다 경력이 적어요 — 신입/주니어 공고 위주로 확인해보세요.`
    );
  }
  if (certifications.length === 0) {
    improvements.push("자격증을 등록하면 매칭도 계산에 도움이 돼요.");
  }
  if (!improvements.length) {
    improvements.push("현재 데이터 기준으로는 뚜렷한 보완점이 보이지 않아요.");
  }

  return {
    stats: {
      careerYears,
      skillCount: skills.length,
      certCount: certifications.length,
      eligibleJobCount: eligibleJobs.length,
    },
    compareCareer: { me: careerYears, marketAvg: marketAvgCareer },
    compareSkills: { me: skills.length, marketAvg: marketAvgSkillCount },
    skillDonut: buildSkillDonut(skills),
    strengths,
    improvements,
  };
}
