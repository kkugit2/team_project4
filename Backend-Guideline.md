# Backend-Guideline.md — 채용 정보 매칭 플랫폼

> 기반 문서: PRD_all.md (통합본)
> 이 문서는 백엔드 코드를 작성할 때 반드시 참고해야 하는 지침이다. CLAUDE.md에서 `[백엔드 지침] @Backend-Guideline`으로 참조된다.
> 원티드 오픈API 사용 가능 범위는 **회사(Company) · 포지션(Job) · 검색(Search) · 통계(Stat) · 태그(Tag) 5개 카테고리로 한정**한다. AI 예측 API, recruit-company/ats API는 이 프로젝트에서 사용하지 않는다.

---

## 0. 기술 스택 확정

| 영역 | 선택 | 비고 |
|---|---|---|
| 백엔드 실행 환경 | Node.js (Next.js API Routes 또는 Express 중 프론트와 통일된 스택 사용) | 바이브 코딩 시 언어 전환 최소화 목적 |
| DB / Auth | Supabase (Postgres + Supabase Auth) | MCP로 연결, 스키마는 4장 참고 |
| 배포 | Vercel | 프론트/백엔드 서버리스 함수 형태로 통합 배포 |
| 외부 API | 원티드 Open API v1 (회사/포지션/검색/통계/태그) | 인증키는 서버 환경변수로만 보관 |
| LLM | Claude API (자소서 분석, 매칭 근거 설명 생성) | 4-8 피드백 페이지 및 6장 참고 |

---

## 1. 인증/인가 (Supabase Auth)

### 1-1. 사용자 역할 분리
```
profiles.role: 'jobseeker' | 'company'
```
- 회원가입 시 role을 선택하게 하고, 이후 모든 API 요청에서 role 기반으로 접근 가능한 라우트를 제한한다.
- 기업 회원가입 시 별도 실명/사업자 인증은 하지 않는다 (PRD 4-4, 6장 Out of Scope). 단, 이 사실을 코드 주석과 README에 "MVP 한계"로 명시해 추후 인증 절차 추가를 누락하지 않게 한다.

### 1-2. 라우트 접근 제어 원칙
| 라우트 성격 | 접근 허용 |
|---|---|
| 공고/회사 조회 | 비로그인 포함 전체 허용 |
| 매칭 스코어, 지원현황, 찜, 스카웃 | 로그인 필요 + role 일치 확인 |
| 기업용 지원자 리스트/스카웃 발송 | role='company'만 허용 |
| 자소서 분석 결과 열람 | 본인 또는 `shared_with_company=true`일 때만 해당 기업 |

모든 API 라우트 진입 시 Supabase 세션 검증 → role 검증 → 리소스 소유자 검증(예: `applications`는 본인 `user_id`만 조회) 순서를 표준 미들웨어로 통일한다.

---

## 2. 원티드 Open API 연동 지침

### 2-1. 사용 가능 카테고리와 매핑

| 카테고리 | 이 프로젝트에서의 용도 | 캐싱 필요도 |
|---|---|---|
| 회사(Company) | 회사 소개, 로고, 이미지, 복지/문화 태그 (4-7) | 높음 (거의 안 바뀜) |
| 포지션(Job) | 공고 목록/상세, 마감일, 요구 연차, 스킬 태그 (4-1, 4-7) | 중간 (일 단위 갱신) |
| 검색(Search) | 회사명/포지션 검색, 자동완성 | 캐싱 불필요 (실시간 요청) |
| 태그(Tag) | 직군/스킬/매력태그 마스터 리스트 — 기업 인재상·구직자 스킬 입력 폼의 드롭다운 표준화 | 매우 높음 (거의 고정값, 1일 1회 갱신으로 충분) |
| 통계(Stat) | 지원 현황 통계 | **사용 제약 있음 — 2-3 참고** |

### 2-2. 인증키 처리 원칙 (필수)
- `wanted-client-id`, `wanted-client-secret`은 **서버 환경변수(`.env`)에만 저장**하고, 절대 프론트엔드 번들이나 클라이언트 응답에 노출하지 않는다.
- 원티드 API 호출은 반드시 백엔드 라우트를 경유한다 (`/api/wanted/*` 프록시 구조). 프론트엔드가 원티드 API를 직접 호출하는 코드는 금지.

### 2-3. 통계(Stat) API 사용 제약 — 반드시 인지할 것
통계 API는 **원티드에 등록된 실제 클라이언트(기업) 소유 공고에 한정**되어 데이터를 제공한다. 우리 플랫폼이 표시하는 회사들은 대부분 우리가 조회 API로 가져오는 제3자 기업이므로, 그 기업들의 실제 지원 통계는 이 API로 얻을 수 없다.
- 통계 API는 **우리 자신이 원티드에 등록한 클라이언트 계정 범위 내에서만** 유효하게 동작한다고 가정하고 코드를 작성한다.
- 화면에 "지원자 통계"를 노출하는 기능은 만들지 않는다 (PRD 3장, 4-7 명시). 통계 API 관련 코드는 실험적/내부 검증 용도로만 남겨두고 사용자 대상 기능에 연결하지 않는다.

### 2-4. 캐싱 전략 (rate limit 대응)
```
job_cache: wanted_job_id, payload(jsonb), fetched_at
```
- 포지션/회사 데이터는 위 테이블에 캐싱하고, `fetched_at` 기준 TTL(예: 회사 24시간, 포지션 6시간)이 지나면 재조회한다.
- 태그 마스터 리스트는 별도 `tag_cache` 테이블에 1일 1회 배치로 갱신한다 (스킬/직군/매력태그 3종 각각 저장).
```
tag_cache: tag_type('skill'|'category'|'attraction'), tag_id, title, fetched_at
```
- 검색 API는 캐싱하지 않고 매 요청마다 원티드 API를 프록시 호출한다 (실시간성이 중요하고 쿼리 다양성이 커서 캐시 효율이 낮음).

---

## 3. 데이터베이스 스키마 (Supabase)

PRD_all.md 5장의 스키마를 기준으로 하되, 백엔드 구현 관점의 세부 규칙을 추가한다.

```sql
-- 사용자 기본 정보 (Supabase Auth 확장)
profiles (
  id uuid primary key references auth.users(id),
  role text check (role in ('jobseeker','company')) not null,
  created_at timestamptz default now()
)

-- 구직자 프로필
jobseeker_profile (
  user_id uuid primary key references profiles(id),
  school text, major text, graduation_status text,
  gpa numeric, gpa_scale numeric,       -- 4.3 / 4.5 등
  certifications text[],
  career_history jsonb,                 -- [{company, period, role, is_internship}]
  skills text[],                        -- 태그 API의 skill id 또는 title 배열로 통일 저장
  resume_text text
)

-- 기업 프로필
company_profile (
  user_id uuid primary key references profiles(id),
  company_name text not null,
  wanted_company_id integer,             -- 원티드 실제 회사와 연결 시 사용(선택)
  preferred_gpa_min numeric,
  preferred_skills text[],               -- 태그 API의 skill id로 통일
  preferred_experience_type text[],
  internship_required boolean default false
)

applications (
  user_id uuid references profiles(id),
  job_id text not null,                  -- 원티드 포지션 ID
  status text default 'self_reported',
  applied_at timestamptz default now(),
  primary key (user_id, job_id)
)

bookmarks (
  user_id uuid references profiles(id),
  job_id text not null,
  created_at timestamptz default now(),
  primary key (user_id, job_id)
)

self_intros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  job_id text not null,
  content text not null,
  submitted_at timestamptz default now(),
  shared_with_company boolean default false
)

feedback_results (
  self_intro_id uuid references self_intros(id),
  strengths text[],
  improvements text[],
  generated_at timestamptz default now()
)

match_scores (
  jobseeker_id uuid references profiles(id),
  company_id uuid references profiles(id),
  score numeric,                          -- 0~100
  basis jsonb,                            -- 항목별 충족/미충족 상세
  computed_at timestamptz default now(),
  primary key (jobseeker_id, company_id)
)

scouts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references profiles(id),
  jobseeker_id uuid references profiles(id),
  status text check (status in ('sent','accepted','rejected','expired')) default 'sent',
  sent_at timestamptz default now(),
  expires_at timestamptz
)

job_cache (
  wanted_job_id text primary key,
  payload jsonb,
  fetched_at timestamptz default now()
)

tag_cache (
  tag_type text check (tag_type in ('skill','category','attraction')),
  tag_id integer,
  title text,
  fetched_at timestamptz default now(),
  primary key (tag_type, tag_id)
)
```

### 3-1. Row Level Security (RLS) 필수 규칙
- `jobseeker_profile`, `applications`, `bookmarks`, `self_intros`: 기본적으로 `user_id = auth.uid()`인 행만 조회/수정 가능
- `self_intros`는 예외적으로 `shared_with_company = true`이고, 해당 기업이 실제로 `match_scores`에 매칭된 경우에만 기업 role 사용자에게 읽기 허용하는 정책을 별도로 작성한다.
- `scouts`는 `company_id = auth.uid()`(보낸 기업) 또는 `jobseeker_id = auth.uid()`(받은 구직자)만 조회 가능

---

## 4. API 라우트 설계

| 라우트 | 메서드 | 설명 | 접근 권한 |
|---|---|---|---|
| `/api/wanted/jobs` | GET | 원티드 포지션 목록 프록시 (필터: category, skill_tags 등) | 전체 |
| `/api/wanted/jobs/:id` | GET | 포지션 상세 프록시 | 전체 |
| `/api/wanted/companies/:id` | GET | 회사 상세 프록시 | 전체 |
| `/api/wanted/search` | GET | 회사/포지션 검색 프록시 | 전체 |
| `/api/wanted/tags/:type` | GET | 태그 마스터 리스트 (캐시 우선 조회) | 전체 |
| `/api/match-score?job_id=` | GET | 로그인한 구직자와 해당 공고 소속 기업(또는 우리 시스템에 등록된 기업 인재상)의 충족률 계산 | 로그인 |
| `/api/applications` | GET/POST | 나의 지원현황 조회/기록 | 로그인(jobseeker) |
| `/api/bookmarks` | GET/POST/DELETE | 찜 목록 조회/추가/삭제 | 로그인(jobseeker) |
| `/api/self-intro` | POST | 자소서 제출 + 목표 공고 선택 | 로그인(jobseeker) |
| `/api/self-intro/:id/feedback` | GET | LLM 분석 결과 조회 | 로그인(본인) |
| `/api/company/candidates` | GET | 기업용 지원자 리스트 (동의자만) | 로그인(company) |
| `/api/scouts` | GET/POST | 스카웃 발송/조회 | 로그인 |
| `/api/scouts/:id/respond` | POST | 스카웃 수락/거절 | 로그인(jobseeker) |

각 라우트는 요청/응답 스키마를 TypeScript 타입 또는 Zod 스키마로 명시하고, 실패 시 아래 공통 에러 포맷을 따른다.

```json
{ "error": { "code": "STRING_CODE", "message": "사람이 읽을 수 있는 설명" } }
```

---

## 5. 매칭 스코어(충족률) 계산 로직

PRD 3장의 B안(자체 매칭 스코어)을 구현한다. 원티드 AI 예측 API는 사용하지 않는다.

### 5-1. 계산 항목과 기본 가중치 (초기값, PRD 9장 "열린 질문"에 따라 추후 조정 가능)

| 항목 | 조건 | 기본 가중치 |
|---|---|---|
| 학점 | `jobseeker.gpa(정규화) >= company.preferred_gpa_min(정규화)` | 25 |
| 기술스택 | `jobseeker.skills ∩ company.preferred_skills` 1개 이상 일치 | 35 |
| 유사 경험 | `career_history`에 `preferred_experience_type`과 일치하는 항목 존재 | 25 |
| 인턴십 경험 | `internship_required=true`인데 `career_history`에 인턴 항목 존재 | 15 (기업이 요구하지 않으면 이 항목은 총점에서 제외하고 나머지 항목 비율로 재분배) |

```
score = Σ(충족한 항목의 가중치) / Σ(해당 기업이 설정한 항목의 가중치) * 100
```

### 5-2. 정규화 규칙
- 학점은 `gpa / gpa_scale`로 0~1 정규화 후 비교 (4.3만점과 4.5만점 학생을 공정 비교하기 위함)
- 스킬 비교는 **태그 API의 skill_id 기준**으로 한다. 프론트에서 스킬 입력 시 자유 텍스트가 아니라 태그 API 자동완성 결과의 id를 저장하도록 강제해, 표기 차이로 인한 매칭 실패를 원천 차단한다.

### 5-3. 결과 저장과 캐시
계산 결과는 `match_scores.basis`(jsonb)에 항목별 충족 여부를 상세 기록해, 프론트에서 "어떤 항목을 충족/미충족했는지" 세부 표시(4-7)에 그대로 사용한다. 프로필이 변경될 때만 재계산하고, 매 페이지 로드마다 재계산하지 않는다 (트리거: `jobseeker_profile`/`company_profile` update 시 관련 `match_scores` 행 재계산 큐에 등록).

---

## 6. 자소서 피드백 (LLM 연동)

### 6-1. 처리 흐름
1. `/api/self-intro` POST로 자소서+목표 공고 저장
2. 백엔드가 Claude API 호출: 자소서 텍스트 + 공고 `intro`/`main_tasks`/`requirements` + (선택) 해당 매칭의 `match_scores.basis`를 함께 프롬프트에 포함해 "부합하는 점 / 보완할 점"을 생성
3. 결과를 `feedback_results`에 저장, `/api/self-intro/:id/feedback`에서 조회

### 6-2. 프롬프트 표준화 (PRD 9장 열린 질문 대응 — 초기안)
- 시스템 프롬프트에 출력 형식을 JSON으로 고정해 파싱 안정성 확보 (`{ strengths: [], improvements: [] }`)
- 미충족 매칭 항목(`match_scores.basis`)이 있으면, 그 항목을 보완할 방향을 자소서 피드백에서 우선적으로 언급하도록 지시문에 포함

### 6-3. 경쟁자 비교분석 — 최소 표본 규칙
같은 `job_id`로 제출된 `self_intros` 개수를 조회해 **5건 미만이면 비교 분석 자체를 생략**하고 "비교 데이터가 아직 부족합니다"를 반환한다 (개인식별 위험 및 무의미한 비교 방지, PRD 4-8 명시 규칙).

### 6-4. 개인정보 노출 통제
`shared_with_company=false`인 자소서는 어떤 기업 API 응답에도 포함되지 않아야 한다. 이 조건은 애플리케이션 코드뿐 아니라 3-1의 RLS 정책으로 이중 방어한다.

---

## 7. 스카웃 시스템 백엔드 규칙

### 7-1. 발송 제한
- 기업당 월 발송 건수 제한 **기본값 10건**을 서버단에서 강제한다 (요청 시점 기준 최근 30일 `scouts.sent_at` 카운트).
- 제한 초과 시 `429`류 커스텀 에러 코드(`SCOUT_LIMIT_EXCEEDED`) 반환.

### 7-2. 상태 전이
```
sent → accepted | rejected | expired
```
- `expires_at = sent_at + 7일`로 생성 시점에 고정.
- 만료 처리는 배치(cron) 또는 조회 시점 lazy 갱신(조회할 때 `now() > expires_at`이면 즉시 `expired`로 업데이트) 중 하나로 구현하되, MVP에서는 후자(lazy 갱신)를 우선 채택해 별도 스케줄러 없이 구현 복잡도를 낮춘다.

### 7-3. 수락 시 처리
수락(`accepted`) 시 별도 프리패스 로직은 없다 (PRD 4-2-1 명시: 스카웃은 관심 표시이지 프리패스가 아님). 기업 쪽 화면에서 "스카웃 수락자"로 구분 표시하는 플래그만 응답에 포함한다.

---

## 8. 공통 에러 핸들링 및 로깅

- 모든 외부 API(원티드, Claude) 호출은 try/catch로 감싸고, 실패 시 사용자에게는 일반화된 메시지("일시적으로 정보를 불러올 수 없습니다")를, 서버 로그에는 상세 원인을 남긴다.
- 원티드 API 호출 실패 시 `job_cache`/`tag_cache`에 남아있는 최신 캐시로 폴백하고, 캐시도 없으면 명시적으로 "데이터 없음" 상태를 반환한다 (빈 배열로 조용히 실패하지 않는다).
- CLAUDE.md 준수사항에 따라, 코드 작성 서브에이전트는 백엔드 단독 테스트 → 프론트 연동 테스트 → 통합 테스트 순으로 진행하고 문제 발생 시 반드시 보고 후 다음 단계로 넘어간다.

---

## 9. 환경 변수 (.env)

```
WANTED_CLIENT_ID=
WANTED_CLIENT_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=       -- 서버 전용, 프론트 노출 금지
ANTHROPIC_API_KEY=               -- Claude API (자소서 분석용)
```

---

## 10. 이 문서에서 다루지 않는 것 (PRD 6장과 동일하게 유지)
- 원티드 AI 예측 API(`/ai/pass`, `/ai/apply`) 연동 — 사용하지 않음
- recruit-company / ats API 연동 — 사용하지 않음 (기업 실체 인증이 없는 MVP 구조상 애초에 접근 권한도 없음)
- 결제/구독 백엔드 로직 — 보류 상태, 스키마/라우트 설계 대상 아님
- 소셜 로그인 백엔드 처리 — MVP 범위 밖
