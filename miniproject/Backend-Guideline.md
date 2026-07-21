# Backend-Guideline.md

Supabase 기반 백엔드 구조와 API 연동 방식을 정리한 문서입니다.

## 1. 인증 (Supabase Auth)
- 이메일/비밀번호 기반 가입
- `profiles` 테이블에 `role` 필드로 `jobseeker` / `company` 구분 (회원가입 시 선택)
- 기업 실명 인증은 MVP 단계에서 생략 (PRD 참고)

## 2. DB 스키마 (제안)

### `profiles`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK, auth.users 참조) | |
| role | text | 'jobseeker' \| 'company' |
| created_at | timestamptz | |

### `jobseeker_profiles`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK, profiles 참조) | |
| education | text | 학적 |
| gpa | numeric | 학점 |
| certifications | text[] | 자격증 목록 |
| career | jsonb | 경력 목록 (회사, 기간, 역할 등 구조화) |
| resume_text | text | 자소서 원문 |

### `company_profiles`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK, profiles 참조) | |
| company_name | text | |
| wanted_company_id | text | 원티드 API company_id (연동용) |
| desired_profile | jsonb | 원하는 인재상 (학점 기준, 기술스택, 유사경험, 인턴십 여부 등) |

### `match_scores`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| jobseeker_id | uuid | |
| company_id | uuid | |
| score | numeric | 산출된 매칭 점수 |
| basis | jsonb | 매칭 근거 (일치 스킬, 조건 등) |
| computed_at | timestamptz | |

### `scouts`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | |
| company_id | uuid | |
| jobseeker_id | uuid | |
| status | text | 'sent' \| 'accepted' \| 'rejected' \| 'expired' |
| sent_at | timestamptz | |
| expires_at | timestamptz | sent_at + 7일 |

### `applications`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | |
| jobseeker_id | uuid | |
| company_id | uuid | |
| wanted_job_id | text | 원티드 공고 ID |
| status | text | 지원 여부/상태 |
| applied_at | timestamptz | |

### `job_cache` (원티드 API 캐싱용, 선택)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| wanted_job_id | text (PK) | |
| payload | jsonb | 원티드 API 응답 원본 |
| fetched_at | timestamptz | 캐시 갱신 시각 (rate limit 절약용) |

## 3. RLS(Row Level Security) 원칙
- 기본적으로 모든 테이블 RLS 활성화
- `jobseeker_profiles`, `company_profiles`: 본인 행만 read/write 가능
- `match_scores`, `scouts`: jobseeker_id 또는 company_id가 본인인 경우에만 read 가능 (양쪽 다 자기 관련 데이터만)
- 자소서 원문(`resume_text`)은 기업 쪽 조회 시 **익명화 처리된 뷰**(view)를 통해서만 노출 — 원본 테이블 직접 접근 금지

## 4. 원티드 API 연동
- 절대 브라우저(프론트엔드)에서 직접 호출하지 않음
- Vercel Serverless Function(또는 Supabase Edge Function)을 프록시로 사용:
  - 클라이언트 → 자체 백엔드 엔드포인트 호출 → 백엔드가 `wanted-client-id`/`wanted-client-secret`을 환경변수에서 읽어 원티드 API 호출 → 결과만 클라이언트에 반환
- 키는 Vercel 프로젝트의 Environment Variables에만 저장 (`.env`는 로컬 개발용, 커밋 금지)
- 자주 조회되는 공고/기업 데이터는 `job_cache`에 저장해 API 호출 횟수 절감 (rate limit 대응)

## 5. 매칭 점수 산출 로직 (MVP 기준)
1. 구직자 스킬/경력/학점 → 벡터화 (임베딩 또는 단순 태그 매칭)
2. 기업 `desired_profile` → 동일 방식으로 벡터화
3. 코사인 유사도 또는 태그 overlap 비율로 점수 산출 (0~100)
4. 결과와 근거(일치 항목)를 `match_scores`에 저장, 프론트에서 그대로 조회

## 6. 자소서 분석 / 모의면접 (LLM 연동)
- 별도 백엔드 엔드포인트에서 Anthropic API 등 LLM 호출
- 입력: 자소서 원문 + 대상 기업의 `desired_profile`
- 출력: 강점/약점/보완점 (구조화된 JSON으로 받아 프론트에서 렌더링)
- LLM 키 역시 서버 환경변수로만 관리, 클라이언트 노출 금지

## 7. 보안 체크리스트
- [ ] `.env` → `.gitignore` 등록 확인
- [ ] 원티드 API, LLM API 키 모두 서버 사이드에서만 참조
- [ ] Supabase RLS 전체 테이블 적용 확인
- [ ] 자소서 열람은 반드시 익명화 뷰를 통해서만
- [ ] 스카웃 발송 건수 제한 로직 서버단에서 강제 (클라이언트단 검증만으로는 우회 가능)
