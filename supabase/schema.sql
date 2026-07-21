-- Supabase 스키마 설정
-- Backend-Guideline.md의 5장 데이터베이스 스키마 참고

-- profiles 테이블 (Auth 확장)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('jobseeker', 'company')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- jobseeker_profile 테이블
CREATE TABLE IF NOT EXISTS jobseeker_profile (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  school TEXT,
  major TEXT,
  graduation_status TEXT,
  gpa NUMERIC,
  gpa_scale NUMERIC,
  certifications TEXT[],
  career_history JSONB,
  skills TEXT[],
  resume_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- company_profile 테이블
CREATE TABLE IF NOT EXISTS company_profile (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  wanted_company_id INTEGER,
  preferred_gpa_min NUMERIC,
  preferred_skills TEXT[],
  preferred_experience_type TEXT[],
  internship_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- applications 테이블
CREATE TABLE IF NOT EXISTS applications (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id TEXT NOT NULL,
  status TEXT DEFAULT 'self_reported',
  applied_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, job_id)
);

-- bookmarks 테이블
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, job_id)
);

-- self_intros 테이블
CREATE TABLE IF NOT EXISTS self_intros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  job_id TEXT NOT NULL,
  content TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  shared_with_company BOOLEAN DEFAULT false
);

-- feedback_results 테이블
CREATE TABLE IF NOT EXISTS feedback_results (
  self_intro_id UUID PRIMARY KEY REFERENCES self_intros(id) ON DELETE CASCADE,
  strengths TEXT[],
  improvements TEXT[],
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- match_scores 테이블
CREATE TABLE IF NOT EXISTS match_scores (
  jobseeker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score NUMERIC,
  basis JSONB,
  computed_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (jobseeker_id, company_id)
);

-- scouts 테이블
CREATE TABLE IF NOT EXISTS scouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  jobseeker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('sent', 'accepted', 'rejected', 'expired')) DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  message TEXT
);

-- job_cache 테이블 (원티드 API 캐싱)
CREATE TABLE IF NOT EXISTS job_cache (
  wanted_job_id TEXT PRIMARY KEY,
  payload JSONB,
  fetched_at TIMESTAMPTZ DEFAULT now()
);

-- tag_cache 테이블
CREATE TABLE IF NOT EXISTS tag_cache (
  tag_type TEXT CHECK (tag_type IN ('skill', 'category', 'attraction')),
  tag_id INTEGER,
  title TEXT,
  fetched_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (tag_type, tag_id)
);

-- viewed_candidates 테이블
CREATE TABLE IF NOT EXISTS viewed_candidates (
  company_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  jobseeker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (company_id, jobseeker_id)
);

-- Row Level Security (RLS) 활성화
ALTER TABLE jobseeker_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_intros ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewed_candidates ENABLE ROW LEVEL SECURITY;

-- RLS 정책: jobseeker_profile (본인만 조회/수정)
CREATE POLICY "Users can view own jobseeker profile" ON jobseeker_profile
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own jobseeker profile" ON jobseeker_profile
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jobseeker profile" ON jobseeker_profile
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS 정책: company_profile (본인만 조회/수정)
CREATE POLICY "Companies can view own profile" ON company_profile
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Companies can update own profile" ON company_profile
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Companies can insert own profile" ON company_profile
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS 정책: applications (본인만 조회/수정)
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS 정책: bookmarks (본인만 조회/수정)
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- RLS 정책: self_intros (본인은 전체, 기업은 shared=true만)
CREATE POLICY "Users can view own self intros" ON self_intros
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Companies can view shared self intros" ON self_intros
  FOR SELECT USING (
    shared_with_company = true AND
    EXISTS (
      SELECT 1 FROM company_profile
      WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert own self intros" ON self_intros
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own self intros" ON self_intros
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS 정책: feedback_results (본인/기업이 관련된 경우만)
CREATE POLICY "Users can view own feedback" ON feedback_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM self_intros
      WHERE self_intros.id = feedback_results.self_intro_id
      AND self_intros.user_id = auth.uid()
    )
  );

-- RLS 정책: scouts (본인이 보냈거나 받은 경우만)
CREATE POLICY "Users can view relevant scouts" ON scouts
  FOR SELECT USING (
    auth.uid() = company_id OR auth.uid() = jobseeker_id
  );
CREATE POLICY "Companies can send scouts" ON scouts
  FOR INSERT WITH CHECK (auth.uid() = company_id);
CREATE POLICY "Users can update relevant scouts" ON scouts
  FOR UPDATE USING (
    auth.uid() = company_id OR auth.uid() = jobseeker_id
  );

-- RLS 정책: viewed_candidates (회사만 조회/수정)
CREATE POLICY "Companies can view own viewed candidates" ON viewed_candidates
  FOR SELECT USING (auth.uid() = company_id);
CREATE POLICY "Companies can record viewed candidates" ON viewed_candidates
  FOR INSERT WITH CHECK (auth.uid() = company_id);

-- 공개 테이블 (RLS 비활성)
-- job_cache, tag_cache는 공개 읽기 허용 (모든 사용자가 조회 가능)

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_self_intros_user_id ON self_intros(user_id);
CREATE INDEX idx_self_intros_job_id ON self_intros(job_id);
CREATE INDEX idx_scouts_company_id ON scouts(company_id);
CREATE INDEX idx_scouts_jobseeker_id ON scouts(jobseeker_id);
CREATE INDEX idx_viewed_candidates_company_id ON viewed_candidates(company_id);
