# 채용 정보 플랫폼 PRD (Product Requirements Document)

## 1. 프로젝트 개요

**채용 정보 플랫폼**은 구직자와 기업 인사팀을 연결하는 양방향 채용 생태계 플랫폼입니다. 구직자는 자신의 경력 정보를 기반으로 기업들의 채용공고를 한눈에 비교하고, AI 기반 자소서 분석을 통해 지원 전략을 수립할 수 있습니다. 기업 인사팀은 원하는 인재상을 사전 등록하고, 구직자들의 자소서 정보를 대시보드에서 일치도 순으로 조회하여 효율적인 인재 수급을 할 수 있습니다. 이를 통해 구직자와 기업 모두에게 최적화된 채용 매칭 경험을 제공합니다.

---

## 2. 타깃 사용자 분석

### 페르소나 1: 구직자 (주요 사용층)
- **특징**: 대학교 졸업자, 신입 또는 경력직 구직자 (22~40세)
- **주요 니즈**:
  - 자신의 경력으로 합격할 수 있는 기업들을 빠르게 찾고 싶음
  - 특정 기업에 지원하기 전에 합격 확률을 알고 싶음
  - 자신의 자소서가 얼마나 경쟁력 있는지 평가받고 싶음
  - 같은 직무의 다른 구직자와 비교하여 부족한 부분을 파악하고 싶음
  - 지원 현황과 찜한 공고를 한곳에서 관리하고 싶음

### 페르소나 2: 기업 인사팀 (채용 담당자)
- **특징**: 기업의 인사/채용 담당자, 영입 담당자 (30~50세)
- **주요 니즈**:
  - 자신의 기업에 필요한 인재상을 사전에 등록하고 싶음
  - 우리 회사에 맞는 인재를 효율적으로 발굴하고 싶음
  - 구직자의 자소서와 경력을 빠르게 검토하고 싶음
  - 우리 기업에 지원한 사람이 누구인지 파악하고 싶음
  - 자격 요건과의 일치도를 정량적으로 비교하고 싶음

---

## 3. 핵심 기능 목록

### 3.1 구직자 기능

| 기능 | 설명 | 우선순위 |
|------|------|--------|
| **로그인/회원가입** | Supabase 인증 활용. 회원가입 시 아이디, 비밀번호, 학적, 학점, 자격증, 경력 정보 입력 (모든 항목 필수이지만 '해당 사항 없음' 선택 가능) | P0 (필수) |
| **랜딩페이지/채용공고 대시보드** | 여러 기업의 채용공고를 카드 형식으로 표시. 각 카드에는 기업명, 직급, 합격 확률, 찜 상태, 지원 현황 표시 | P0 (필수) |
| **합격 확률 예측** | 원티드 OpenAPI의 'AI 예측 - 서류합격예측' 활용하여 각 공고마다 합격 확률 실시간 계산 및 표시 | P0 (필수) |
| **기업 상세 정보 조회** | 대시보드의 카드 클릭 시 기업 소개, 채용 포지션, 기업 정보 조회 (원티드 API 활용) | P0 (필수) |
| **지원하기 연결** | 기업 상세 페이지의 '지원하기' 버튼 클릭 시 해당 기업의 실제 지원서 작성 사이트로 외부 링크 이동 | P0 (필수) |
| **채용공고 찜하기** | 관심 있는 채용공고를 찜하고, 찜한 목록 조회 및 관리 (DB에 저장) | P1 (높음) |
| **지원현황 추적** | 지원한 기업 및 공고의 현황을 표시 (구직자가 수동으로 입력: 미지원, 지원 완료, 면접 중 등) | P1 (높음) |
| **마이페이지** | 학적, 학점, 자격증, 경력 정보 조회/수정/삭제. 프로필 정보 변경 시 합격 확률 재산정 | P1 (높음) |
| **자소서 입력 및 AI 분석** | 자소서 텍스트 입력 후 AI 기반 자동 분석. 피드백(강점, 약점, 개선 방안), 경쟁자 비교분석 제공 | P2 (중간) |

### 3.2 기업 인사팀 기능

| 기능 | 설명 | 우선순위 |
|------|------|--------|
| **로그인/회원가입** | Supabase 인증. 회원가입 시 기업/구직자 선택. 기업은 원하는 인재상 저장 (학점, 기술스택, 유사 경험, 인턴십 경험 등) | P0 (필수) |
| **인재상 설정 및 관리** | 회원가입 또는 마이페이지에서 원하는 인재상 조건 입력/수정 (학점 범위, 필수 기술스택, 선호 경력 등) | P0 (필수) |
| **구직자 자소서 대시보드** | 구직자들의 자소서와 경력 정보를 카드 형식으로 조회. 기업의 인재상과의 일치도 점수 표시 | P0 (필수) |
| **인재 일치도 분석** | 기업이 등록한 인재상과 구직자의 경력/자격을 비교 분석하여 일치도 점수 계산 및 표시 (0~100%) | P0 (필수) |
| **지원 여부 확인** | 각 구직자가 자신의 기업에 지원했는지 여부 표시 | P0 (필수) |
| **상세 구직자 정보 조회** | 구직자 카드 클릭 시 해당 구직자의 상세 경력, 자격증, 자소서 정보 조회 | P1 (높음) |

---

## 4. 사용자 플로우

### 4.1 구직자 플로우

#### 플로우 1: 초기 사용자 (회원가입 및 첫 채용공고 탐색)

1. **회원가입**
   - 랜딩페이지에서 '회원가입' 선택
   - 사용자 유형 선택 화면에서 '구직자' 선택
   - 회원가입 폼에서 필수 정보 입력 (아이디, 비밀번호, 학적, 학점, 자격증, 경력)
   - 계정 생성 완료

2. **로그인**
   - 아이디와 비밀번호로 로그인
   - 로그인 성공 시 랜딩페이지로 이동

3. **채용공고 대시보드 확인**
   - 여러 기업의 채용공고가 카드 형식으로 표시
   - 각 카드에서 확인 가능한 정보: 기업명, 직급, 합격 확률(%), 찜 아이콘, 지원 현황
   - 카드를 스크롤하거나 필터로 조회

4. **기업 상세 정보 조회**
   - 공고 카드를 클릭하면 기업 상세 페이지로 이동
   - 기업 소개, 근무지, 복리후생, 채용 포지션 정보 확인
   - '지원하기' 버튼 클릭 시 해당 기업 지원 사이트로 새 창 열기

5. **찜하기**
   - 공고 카드 또는 상세 페이지의 하트 아이콘 클릭
   - 찜 추가 또는 제거
   - 찜한 공고 목록에서 별도로 조회 가능

6. **지원현황 입력**
   - 지원 후 대시보드로 돌아와서 해당 공고의 상태 수동 입력
   - 상태: 미지원 → 지원 완료 → 면접 중 → 합격 / 불합격

#### 플로우 2: 마이페이지 - 프로필 관리

1. **마이페이지 진입**
   - 헤더의 '마이페이지' 링크 클릭
   - 현재 프로필 정보 조회 (학적, 학점, 자격증, 경력)

2. **정보 수정**
   - 각 항목의 '수정' 버튼 클릭
   - 수정 폼 표시
   - 변경 사항 저장 → DB 업데이트
   - 프로필 정보 변경 시 대시보드의 합격 확률 자동 재산정

3. **자소서 분석 (선택사항)**
   - 마이페이지에서 '자소서 분석' 섹션 진입
   - 자소서 텍스트 입력
   - AI 분석 결과 확인: 피드백, 강점, 약점, 개선 방안
   - 같은 직군/직무의 다른 구직자들과의 상대적 평가

---

### 4.2 기업 인사팀 플로우

#### 플로우 1: 회원가입 및 인재상 설정

1. **회원가입**
   - 랜딩페이지에서 '회원가입' 선택
   - 사용자 유형 선택에서 '기업' 선택
   - 회원가입 폼: 회사명, 회사 이메일, 비밀번호 입력
   - 원하는 인재상 기본 조건 입력 (학점 범위, 필수 기술스택, 선호 경력, 인턴십 경험 등)

2. **로그인**
   - 회사 이메일과 비밀번호로 로그인
   - 대시보드로 이동

#### 플로우 2: 구직자 인재 발굴

1. **구직자 대시보드**
   - 구직자들의 자소서와 경력 정보가 카드 형식으로 표시
   - 각 카드에서 확인 가능한 정보:
     - 구직자 이름/학력
     - 경력 요약
     - 인재상 일치도 점수 (0~100%, 색상 코딩)
     - 자신의 기업에 지원 여부
   - 일치도 높은 순으로 정렬 (기본값) 또는 필터링 가능

2. **상세 구직자 정보 조회**
   - 카드를 클릭하면 구직자 상세 페이지로 이동
   - 상세 정보: 학적, 학점, 자격증, 경력 이력, 자소서
   - 인재상과의 일치도 상세 분석 표시

3. **마이페이지 - 인재상 관리**
   - 원하는 인재상 조건 수정/업데이트 가능
   - 변경 사항 저장 시 구직자 대시보드의 일치도 자동 재계산

---

## 5. 기술 스택

| 계층 | 기술 | 선택 이유 |
|------|------|---------|
| **프론트엔드** | HTML/CSS/JavaScript (바닐라) | 빠른 개발과 간결한 구조. 복잡한 상태 관리가 필요 없는 경우 효율적. 향후 React/Vue 마이그레이션 가능 |
| **백엔드** | Node.js + Express | 원티드 API 호출, 인증, 자소서 분석 AI 연동, 일치도 계산 로직 구현. JavaScript 통일로 개발 효율성 향상 |
| **데이터베이스** | PostgreSQL (Supabase) | 관계형 데이터 구조에 최적화. Supabase의 인증, 실시간 기능 활용 |
| **인증** | Supabase Auth | 회원가입/로그인 구현. OAuth 지원 및 세션 관리 용이 |
| **외부 API** | 원티드 OpenAPI (V1 + V2) | 합격 확률 예측, 기업 정보, 포지션 탐색 |
| **AI 분석** | OpenAI API 또는 유사 LLM | 자소서 분석, 피드백 생성, 경쟁자 비교분석 (상세 정의 필요) |
| **호스팅** | Vercel (프론트엔드) / Heroku 또는 AWS (백엔드) | 일반적인 클라우드 호스팅 (향후 조정 가능) |

---

## 6. 데이터 구조

### 6.1 핵심 엔티티 다이어그램

```
┌──────────────┐
│     User     │ (구직자 또는 기업)
├──────────────┤
│ id (PK)      │
│ email        │
│ password_hash│
│ user_type    │ (job_seeker / recruiter)
│ created_at   │
│ updated_at   │
└──────┬───────┘
       │
       ├─────────────────┬──────────────────┐
       │                 │                  │
       v                 v                  v
┌──────────────────┐ ┌──────────────────┐ ┌────────────────────┐
│  JobSeekerProfile│ │RecruiterProfile  │ │    SavedJob        │
├──────────────────┤ ├──────────────────┤ ├────────────────────┤
│ id (PK)          │ │ id (PK)          │ │ id (PK)            │
│ user_id (FK)     │ │ user_id (FK)     │ │ user_id (FK)       │
│ education        │ │ company_name     │ │ job_posting_id     │
│ gpa              │ │ desired_traits   │ │ company_name       │
│ created_at       │ │ (JSON)           │ │ position_name      │
│ updated_at       │ │ created_at       │ │ created_at         │
└────────┬─────────┘ │ updated_at       │ └────────────────────┘
         │           └──────────────────┘
         │
         ├────────────────┐
         │                │
         v                v
┌──────────────────┐ ┌──────────────────┐
│  Certification   │ │   Experience     │
├──────────────────┤ ├──────────────────┤
│ id (PK)          │ │ id (PK)          │
│ user_id (FK)     │ │ user_id (FK)     │
│ cert_name        │ │ company_name     │
│ issued_date      │ │ job_title        │
│ expires_at       │ │ start_date       │
│ created_at       │ │ end_date         │
│ updated_at       │ │ description      │
└──────────────────┘ │ created_at       │
                     │ updated_at       │
                     └──────────────────┘

         │
         v
┌──────────────────┐
│   CoverLetter    │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ content          │
│ ai_analysis      │ (JSON - feedback, strengths, weaknesses)
│ created_at       │
│ updated_at       │
└──────────────────┘

┌──────────────────────┐
│   ApplicationStatus  │
├──────────────────────┤
│ id (PK)              │
│ job_seeker_id (FK)   │
│ job_posting_id       │
│ status               │ (not_applied, applied, interviewing, accepted, rejected)
│ created_at           │
│ updated_at           │
└──────────────────────┘
```

### 6.2 테이블 상세 정의

#### 1. **User** (사용자 - 구직자 또는 기업)
| 컬럼명 | 타입 | 설명 | 제약 |
|--------|------|------|-----|
| id | UUID | 사용자 고유 ID | PK, Supabase 자동 생성 |
| email | VARCHAR(255) | 사용자 이메일 | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | 비밀번호 해시 | NOT NULL, Supabase 관리 |
| user_type | ENUM | 사용자 유형 | job_seeker / recruiter, NOT NULL |
| created_at | TIMESTAMP | 계정 생성 시간 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 마지막 수정 시간 | DEFAULT CURRENT_TIMESTAMP |

#### 2. **JobSeekerProfile** (구직자 프로필)
| 컬럼명 | 타입 | 설명 | 제약 |
|--------|------|------|-----|
| id | UUID | 프로필 ID | PK |
| user_id | UUID | 사용자 ID | FK (User.id), NOT NULL, UNIQUE |
| education | VARCHAR(255) | 학적 | NULL 가능 |
| gpa | DECIMAL(3,2) | 학점 (0.00 ~ 4.50) | NULL 가능 |
| created_at | TIMESTAMP | 생성 시간 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 마지막 수정 시간 | DEFAULT CURRENT_TIMESTAMP |

#### 3. **RecruiterProfile** (기업 인사팀 프로필)
| 컬럼명 | 타입 | 설명 | 제약 |
|--------|------|------|-----|
| id | UUID | 프로필 ID | PK |
| user_id | UUID | 사용자(기업) ID | FK (User.id), NOT NULL, UNIQUE |
| company_name | VARCHAR(255) | 회사명 | NOT NULL |
| desired_traits | JSON | 원하는 인재상 (학점, 기술스택, 경력 등) | NULL 가능 |
| created_at | TIMESTAMP | 생성 시간 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 마지막 수정 시간 | DEFAULT CURRENT_TIMESTAMP |

#### 4. **Certification** (자격증)
| 컬럼명 | 타입 | 설명 | 제약 |
|--------|------|------|-----|
| id | UUID | 자격증 ID | PK |
| user_id | UUID | 사용자 ID | FK (User.id), NOT NULL |
| cert_name | VARCHAR(255) | 자격증명 | NOT NULL |
| issued_date | DATE | 취득 일자 | NOT NULL |
| expires_at | DATE | 만료 일자 | NULL 가능 |
| created_at | TIMESTAMP | 생성 시간 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 마지막 수정 시간 | DEFAULT CURRENT_TIMESTAMP |

#### 5. **Experience** (경력)
| 컬럼명 | 타입 | 설명 | 제약 |
|--------|------|------|-----|
| id | UUID | 경력 ID | PK |
| user_id | UUID | 사용자 ID | FK (User.id), NOT NULL |
| company_name | VARCHAR(255) | 회사명 | NOT NULL |
| job_title | VARCHAR(255) | 직책/직무 | NOT NULL |
| start_date | DATE | 근무 시작일 | NOT NULL |
| end_date | DATE | 근무 종료일 | NULL 가능 (현직) |
| description | TEXT | 업무 설명 | NULL 가능 |
| created_at | TIMESTAMP | 생성 시간 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 마지막 수정 시간 | DEFAULT CURRENT_TIMESTAMP |

#### 6. **SavedJob** (찜한 채용공고)
| 컬럼명 | 타입 | 설명 | 제약 |
|--------|------|------|-----|
| id | UUID | 찜 기록 ID | PK |
| user_id | UUID | 구직자 ID | FK (User.id), NOT NULL |
| job_posting_id | VARCHAR(255) | 원티드 API의 공고 ID | NOT NULL |
| company_name | VARCHAR(255) | 기업명 | NOT NULL |
| position_name | VARCHAR(255) | 채용 포지션명 | NOT NULL |
| created_at | TIMESTAMP | 찜 시간 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 마지막 업데이트 | DEFAULT CURRENT_TIMESTAMP |

#### 7. **CoverLetter** (자소서 및 AI 분석)
| 컬럼명 | 타입 | 설명 | 제약 |
|--------|------|------|-----|
| id | UUID | 자소서 ID | PK |
| user_id | UUID | 구직자 ID | FK (User.id), NOT NULL |
| content | TEXT | 자소서 내용 | NOT NULL |
| ai_analysis | JSON | AI 분석 결과 (피드백, 강점, 약점, 개선안) | NULL 가능 |
| created_at | TIMESTAMP | 생성 시간 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 마지막 업데이트 | DEFAULT CURRENT_TIMESTAMP |

#### 8. **ApplicationStatus** (지원 현황)
| 컬럼명 | 타입 | 설명 | 제약 |
|--------|------|------|-----|
| id | UUID | 지원 현황 ID | PK |
| job_seeker_id | UUID | 구직자 ID | FK (User.id), NOT NULL |
| job_posting_id | VARCHAR(255) | 원티드 API의 공고 ID | NOT NULL |
| status | ENUM | 지원 상태 | not_applied / applied / interviewing / accepted / rejected |
| created_at | TIMESTAMP | 생성 시간 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 마지막 업데이트 | DEFAULT CURRENT_TIMESTAMP |

### 6.3 관계 설명
- **1:1 관계**:
  - User ↔ JobSeekerProfile (구직자 1명 = 프로필 1개)
  - User ↔ RecruiterProfile (기업 1개 = 프로필 1개)
  
- **1:N 관계**:
  - JobSeekerProfile ↔ Certification (구직자 1명 = 자격증 여러 개)
  - JobSeekerProfile ↔ Experience (구직자 1명 = 경력 여러 개)
  - User ↔ SavedJob (구직자 1명 = 찜한 공고 여러 개)
  - User ↔ CoverLetter (구직자 1명 = 자소서 여러 개)
  - User ↔ ApplicationStatus (구직자 1명 = 지원 현황 여러 개)

---

## 7. 개발 우선순위 및 단계별 계획

### 🎯 MVP (Minimum Viable Product) - Phase 1
**목표**: 구직자와 기업 모두 기본 기능을 통해 인재 매칭이 가능한 수준

**구직자 포함 기능**:
1. 로그인/회원가입 (사용자 유형 선택 포함)
2. 랜딩페이지/채용공고 대시보드
3. 합격 확률 예측 (원티드 API)
4. 기업 상세 정보 조회
5. 지원하기 외부 링크
6. 마이페이지 (프로필 조회/수정)
7. 지원현황 추적 (수동 입력)

**기업 포함 기능**:
1. 로그인/회원가입 (기업 유형)
2. 인재상 설정 및 관리
3. 구직자 자소서 대시보드
4. 인재 일치도 분석 및 표시
5. 지원 여부 확인
6. 상세 구직자 정보 조회

**기술 구현**:
- Supabase 데이터베이스 설계 및 구현
- Supabase Auth 연동
- Node.js/Express 백엔드 기본 API 구현
- 원티드 API 연동
- 일치도 계산 알고리즘 개발
- HTML/CSS/JavaScript 프론트엔드 구현

**개발 기간 가정**: 6~8주

---

### 📈 Phase 2 - AI 자소서 분석 추가
**목표**: 구직자에게 자소서 AI 분석 및 피드백 제공

**포함 기능**:
1. 자소서 입력 인터페이스
2. OpenAI API 연동 자동 분석
3. AI 피드백 (강점, 약점, 개선 방안) 표시
4. 경쟁자 비교분석 (같은 직군/직무 구직자 비교)

**개발 기간 가정**: 2~3주

---

### 🚀 Phase 3 - 고도화
**목표**: 사용자 경험 개선 및 추가 기능

**포함 기능**:
1. 필터링 및 정렬 기능 강화 (직군, 직무, 지역, 급여 등)
2. 추천 알고리즘 개선
3. 모바일 반응형 지원 (선택사항)
4. 실시간 알림 (새 공고, 지원 상태 변경 등)

**개발 기간 가정**: 3~4주

---

## 8. 유의사항 및 제약조건

### API 사용 유의사항
- **원티드 OpenAPI 인증**: API 키 관리 및 Rate Limiting 고려
- **OpenAI API**: 자소서 분석 비용 발생 (요청 기반 청구 모델)
- **데이터 동기화**: 원티드 API의 채용공고 데이터 주기적 동기화 필요

### 보안 고려사항
- **비밀번호 관리**: Supabase의 내장 보안 기능 활용
- **HTTPS**: 모든 통신 암호화
- **개인정보보호**: GDPR, CCPA 등 규정 준수
- **AI 데이터**: 자소서 데이터 안전성 및 개인정보 보호

### 성능 고려사항
- **캐싱**: 원티드 API 응답 캐싱
- **일치도 계산**: 대량 구직자 데이터에 대한 일치도 계산 최적화
- **데이터베이스 인덱싱**: 자주 조회하는 컬럼에 인덱스 추가

### 향후 확장 계획
- 모바일 앱 개발 (React Native)
- 고급 필터링 및 추천 알고리즘
- 채용 통계 및 시장 분석
- 사용자 커뮤니티 기능 (면접 후기, 연봉 정보)

---

## 부록: 가정사항 정리

| 항목 | 가정사항 |
|------|--------|
| **AI 자소서 분석** | OpenAI API (GPT) 또는 유사 LLM 활용 (상세 정의 필요) |
| **경쟁자 비교분석** | 같은 직군/직무의 다른 구직자들 기반 상대 평가 |
| **지원 추적 방식** | 구직자가 수동으로 상태 입력 (향후 자동화 가능) |
| **인재상 일치도 계산** | 학점, 기술스택, 경력 경험도 등을 정량화하여 점수 산출 (알고리즘 상세 정의 필요) |
| **원티드 API 연동** | 백엔드에서 API 호출 후 프론트엔드로 데이터 전달 (보안상 권장) |
| **호스팅 환경** | Vercel (프론트) / Heroku 또는 AWS (백엔드) (향후 조정 가능) |

---

**작성자**: AI 기획 에이전트  
**작성일**: 2026-07-14  
**버전**: 2.0  
**마지막 수정**: 2026-07-14
