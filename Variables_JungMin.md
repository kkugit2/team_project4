# 변수 정의서 (Variables_JungMin.md)

## 개요
이 문서는 매치보드 프로젝트의 모든 코드 파일(HTML, JavaScript)에서 사용되는 변수의 이름과 역할을 정리한 목록입니다.

---

## 1. HTML 파일들의 주요 변수

### index.html (로그인 페이지)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `login-form` | HTML 요소 | 로그인 폼 |
| `login-email` | HTML 입력 요소 | 로그인 이메일 입력 필드 |
| `login-password` | HTML 입력 요소 | 로그인 비밀번호 입력 필드 |
| `login-error` | HTML 요소 | 로그인 오류 메시지 표시 영역 |
| `login-submit` | HTML 요소 | 로그인 제출 버튼 |
| `form` | 변수 | 로그인 폼 요소 참조 |
| `errorBox` | 변수 | 오류 메시지 표시 요소 |
| `submitBtn` | 변수 | 제출 버튼 참조 |
| `email` | 문자열 | 사용자가 입력한 이메일 |
| `password` | 문자열 | 사용자가 입력한 비밀번호 |
| `data` | 객체 | Supabase 로그인 응답 데이터 |
| `error` | 객체 | 로그인 오류 객체 |
| `user` | 객체 | 로그인된 사용자 정보 |
| `role` | 문자열 | 사용자 역할 ("jobseeker" 또는 "company") |

### signup.html (회원가입 페이지)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `topnav-root` | HTML 요소 | 상단 네비게이션 마운트 포인트 |
| `role-select-section` | HTML 요소 | 역할 선택 섹션 |
| `signup-form-section` | HTML 요소 | 가입 폼 섹션 |
| `role-back-link` | HTML 요소 | 역할 재선택 링크 래퍼 |
| `role-back` | HTML 요소 | 역할 재선택 버튼 |
| `role-jobseeker` | HTML 요소 | 구직자 역할 선택 카드 |
| `role-company` | HTML 요소 | 기업 역할 선택 카드 |
| `signup-form` | HTML 요소 | 가입 폼 |
| `role` | 문자열 | 선택된 사용자 역할 |
| `handle` | 객체 | 폼 데이터 수집 함수 |

### jobseeker-home.html (구직자 홈/통계)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `auth` | 객체 | 인증된 사용자 정보 |
| `profile` | 객체 | 구직자 프로필 데이터 |
| `jobs` | 배열 | 채용 공고 데이터 |
| `safeProfile` | 객체 | 프로필 또는 기본값 |
| `insights` | 객체 | 계산된 통계 분석 결과 |
| `careerYears` | 숫자 | 경력 년수 |
| `skillCount` | 숫자 | 보유 기술 수 |
| `certCount` | 숫자 | 자격증 수 |
| `eligibleJobCount` | 숫자 | 지원 가능한 공고 수 |
| `stats` | 객체 | 통계 정보 |
| `compareCareer` | 객체 | 경력 연차 비교 데이터 |
| `compareSkills` | 객체 | 기술 수 비교 데이터 |
| `skillDonut` | 배열 | 기술 분류 데이터 (도넛 차트용) |
| `strengths` | 배열 | 강점 문구 |
| `improvements` | 배열 | 보완점 문구 |
| `i` | 객체 | 통계 항목 (루프 변수) |
| `meWidth` | 숫자 | 나의 값에 대한 바 너비 (%) |
| `avgWidth` | 숫자 | 평균값에 대한 바 너비 (%) |
| `maxCareer` | 숫자 | 경력 연차 최대값 |
| `maxSkills` | 숫자 | 기술 수 최대값 |
| `donutData` | 배열 | 도넛 차트 데이터 |
| `acc` | 숫자 | 누적 백분율 |
| `d` | 객체 | 도넛 데이터 항목 (루프 변수) |
| `colors` | 배열 | 도넛 차트 색상 배열 |
| `stops` | 문자열 | CSS conic-gradient 스톱 |
| `legend` | 문자열 | 도넛 범례 HTML |

### jobs.html (공고 둘러보기)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `user` | 객체 | 로그인된 사용자 정보 |
| `role` | 문자열 | 사용자 역할 |
| `jobs` | 배열 | 전체 채용 공고 목록 |
| `profile` | 객체 | 구직자 프로필 (로그인 시에만) |
| `bookmarkedIds` | Set | 찜한 공고 ID 집합 |
| `appliedIds` | Set | 지원한 공고 ID 집합 |
| `allJobs` | 배열 | 필터링 전 전체 공고 |
| `categories` | 배열 | 공고 직군 카테고리 |
| `activeCategory` | 문자열 | 현재 선택된 카테고리 |
| `activeSort` | 문자열 | 현재 정렬 방식 ("match", "due", "latest") |
| `bookmarkOnly` | 불린 | 찜한 공고만 보기 필터 |
| `pills` | 배열 | 필터 카테고리 목록 |
| `c` | 문자열 | 카테고리 (루프 변수) |
| `list` | 배열 | 필터링된 공고 목록 |
| `withScore` | 배열 | 매칭 스코어 계산된 공고 목록 |
| `j` | 객체 | 공고 항목 (루프 변수) |
| `match` | 객체 | 공고별 매칭 스코어 |
| `company` | 객체 | 기업 정보 |
| `logo` | 문자열 | 기업 로고 HTML |
| `badgeHtml` | 문자열 | 매칭도 배지 HTML |
| `appliedBadge` | 문자열 | 지원함 배지 HTML |
| `bookmarkBtn` | 문자열 | 찜하기 버튼 HTML |
| `jobId` | 숫자 | 공고 ID |
| `companyId` | 숫자 | 기업 ID |

### company-detail.html (기업 상세 페이지)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `params` | URLSearchParams | URL 쿼리 파라미터 |
| `companyId` | 숫자 | 조회할 기업 ID |
| `highlightJobId` | 숫자 | 강조할 공고 ID |
| `user` | 객체 | 로그인된 사용자 정보 |
| `role` | 문자열 | 사용자 역할 |
| `company` | 객체 | 기업 정보 |
| `jobsList` | 배열 | 기업의 채용 공고 목록 |
| `appliedIds` | Set | 지원한 공고 ID 집합 |
| `isJobseeker` | 불린 | 구직자 여부 |

### company-home.html (기업 홈 / 인재 랭킹)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `auth` | 객체 | 인증된 기업 사용자 정보 |
| `companyProfile` | 객체 | 기업 프로필 (인재상 정보) |
| `candidateRows` | 배열 | 익명화된 지원자 정보 |
| `byJobseeker` | Map | 지원자별 가장 최신 자소서 데이터 |
| `candidates` | 배열 | 중복 제거된 지원자 목록 |
| `sentScouts` | 배열 | 발송한 스카웃 목록 |
| `scoutMap` | 객체 | 지원자별 스카웃 정보 맵 |
| `ranked` | 배열 | 매칭 스코어로 정렬된 지원자 |
| `c` | 객체 | 지원자 항목 (루프 변수) |
| `match` | 객체 | 지원자별 매칭 스코어 |
| `idx` | 숫자 | 순위 인덱스 |
| `skillChips` | 문자열 | 기술 칩 HTML |
| `s` | 문자열 | 기술명 (루프 변수) |
| `scout` | 객체 | 발송한 스카웃 정보 |
| `isExpired` | 불린 | 스카웃 제안 만료 여부 |
| `scoutBtnHtml` | 문자열 | 스카웃 버튼 HTML |

### mypage.html (마이페이지)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `auth` | 객체 | 인증된 사용자 정보 |
| `profile` | 객체 | 구직자/기업 프로필 |
| `editWrap` | HTML 요소 | 프로필 수정 폼 래퍼 |
| `isOpen` | 불린 | 수정 폼 오픈 여부 |
| `handle` | 객체 | 폼 데이터 수집 함수 |
| `updated` | 객체 | 수정된 프로필 데이터 |
| `scouts` | 배열 | 발송한 스카웃 목록 |
| `s` | 객체 | 스카웃 항목 (루프 변수) |
| `isExpired` | 불린 | 스카웃 만료 여부 |
| `statusMap` | 객체 | 스카웃 상태 레이블 맵 |

### scout-management.html (스카웃 관리)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `auth` | 객체 | 인증된 기업 사용자 정보 |
| `scouts` | 배열 | 발송한 스카웃 목록 |
| `list` | 배열 | 스카웃 목록 |
| `jobseekerIds` | 배열 | 스카웃 대상 지원자 ID 배열 |
| `candidateInfo` | 배열 | 지원자 학교/전공 정보 |
| `infoMap` | 객체 | 지원자 ID별 정보 맵 |
| `now` | Date | 현재 시간 |
| `monthStart` | Date | 현재 월의 시작 날짜 |
| `sentThisMonth` | 숫자 | 이번 달 스카웃 발송 건수 |
| `s` | 객체 | 스카웃 항목 (루프 변수) |
| `activeStatus` | 문자열 | 현재 선택된 필터 상태 |
| `STATUS_LABELS` | 객체 | 스카웃 상태 레이블 맵 |
| `filtered` | 배열 | 상태로 필터링된 스카웃 목록 |
| `status` | 문자열 | 개별 스카웃의 유효한 상태 |
| `info` | 객체 | 지원자 정보 |
| `label` | 문자열 | 지원자 표시 레이블 |
| `daysLeft` | 숫자 | 스카웃 제안 남은 일수 |
| `expiryText` | 문자열 | 만료 기한 표시 텍스트 |
| `action` | 문자열 | 스카웃 액션 버튼 HTML |
| `statusPillClass` | 객체 | 상태별 스타일 클래스 맵 |

### resume-feedback.html (자소서 피드백)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `auth` | 객체 | 인증된 사용자 정보 |
| `params` | URLSearchParams | URL 쿼리 파라미터 |
| `preselectJobId` | 숫자 | 미리 선택된 공고 ID |
| `jobs` | 배열 | 모든 채용 공고 목록 |
| `jobSelect` | HTML 요소 | 공고 선택 드롭다운 |
| `profile` | 객체 | 구직자 프로필 |
| `currentJob` | 객체 | 현재 선택된 공고 |
| `lastSelfIntroId` | 숫자 | 마지막 제출한 자소서 ID |
| `jobId` | 숫자 | 선택된 공고 ID |
| `resumeText` | 문자열 | 자소서 텍스트 |
| `result` | 객체 | 자소서 분석 결과 |
| `el` | HTML 요소 | 비교 데이터 표시 영역 |
| `data` | 객체 | RPC 조회 결과 데이터 |
| `stats` | 객체 | 공고 지원자 통계 |
| `myProfile` | 객체 | 사용자의 구직자 프로필 |
| `myCareer` | 숫자 | 사용자의 경력 년수 |
| `mySkillCount` | 숫자 | 사용자의 기술 수 |
| `avgCareer` | 숫자 | 동일 공고 지원자 평균 경력 |
| `avgSkill` | 숫자 | 동일 공고 지원자 평균 기술 수 |
| `max` | 숫자 | 비교 바 최대값 |
| `meW` | 숫자 | 사용자 값에 대한 바 너비 (%) |

---

## 2. JavaScript 파일들의 주요 변수

### supabaseClient.js (Supabase 초기화)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `SUPABASE_URL` | 문자열 | Supabase 프로젝트 URL |
| `SUPABASE_PUBLISHABLE_KEY` | 문자열 | Supabase 퍼블리셔블 키 |
| `supabase` | 클라이언트 | Supabase 클라이언트 인스턴스 |
| `session` | 객체 | Supabase 세션 정보 |
| `profile` | 객체 | 사용자 프로필 |
| `error` | 객체 | 데이터베이스 오류 |
| `user` | 객체 | 로그인된 사용자 |
| `role` | 문자열 | 사용자 역할 |
| `allowedRoles` | 배열 | 허용된 역할 목록 |

### auth.js (인증 및 가입)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `PENDING_KEY` | 문자열 | LocalStorage 키 (보류 중인 가입) |
| `email` | 문자열 | 사용자 이메일 |
| `role` | 문자열 | 사용자 역할 |
| `profileData` | 객체 | 프로필 데이터 |
| `pending` | 객체 | 보류 중인 가입 정보 |
| `userId` | 문자열 | 사용자 ID |
| `profileErr` | 객체 | 프로필 저장 오류 |
| `container` | HTML 요소 | 폼 컨테이너 |
| `skills` | 배열 | 기술 스택 |
| `certifications` | 배열 | 자격증 목록 |
| `careerHistory` | 배열 | 경력 이력 |
| `careerYears` | 숫자 | 총 경력 년수 |
| `school` | 문자열 | 학교명 |
| `major` | 문자열 | 전공 |
| `graduation_status` | 문자열 | 졸업 여부 |
| `gpa` | 숫자 | 학점 |
| `gpa_scale` | 숫자 | 학점 만점 기준 |
| `company_name` | 문자열 | 기업명 |
| `preferred_gpa_min` | 숫자 | 선호 최소 학점 |
| `preferred_skills` | 배열 | 선호 기술 |
| `preferred_experience_type` | 배열 | 선호 경험 유형 |
| `internship_required` | 불린 | 인턴십 필수 여부 |
| `list` | HTML 요소 | 동적 행 리스트 |
| `addBtn` | HTML 요소 | 행 추가 버튼 |
| `wrap` | HTML 요소 | 새 행 래퍼 |
| `row` | HTML 요소 | 행 요소 |
| `item` | 객체 | 행 데이터 |
| `c` | 객체 | 경력 항목 (루프 변수) |
| `sum` | 숫자 | 경력 년수 누적합 |

### nav.js (상단 네비게이션)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `NAV_LINKS` | 객체 | 역할별 네비게이션 링크 정의 |
| `root` | HTML 요소 | 네비게이션 마운트 포인트 |
| `user` | 객체 | 로그인된 사용자 정보 |
| `role` | 문자열 | 사용자 역할 |
| `links` | 배열 | 현재 역할의 네비게이션 링크 |
| `linksHtml` | 문자열 | 네비게이션 HTML |
| `l` | 객체 | 링크 항목 (루프 변수) |
| `roleLabel` | 문자열 | 역할 레이블 ("구직자" 또는 "기업") |
| `initial` | 문자열 | 이메일의 첫 글자 |

### insights.js (구직자 통계)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `SKILL_CATEGORIES` | 배열 | 기술 분류 카테고리 |
| `skill` | 문자열 | 기술명 (루프 변수) |
| `s` | 문자열 | 기술명 (소문자) |
| `cat` | 객체 | 기술 카테고리 (루프 변수) |
| `label` | 문자열 | 기술 분류 레이블 |
| `skills` | 배열 | 사용자 기술 배열 |
| `counts` | 객체 | 카테고리별 기술 수 |
| `total` | 숫자 | 전체 기술 수 |
| `freq` | 객체 | 시장 기술 빈도 |
| `job` | 객체 | 공고 항목 (루프 변수) |
| `t` | 객체 | 기술 태그 (루프 변수) |
| `title` | 문자열 | 기술 제목 |
| `profile` | 객체 | 구직자 프로필 |
| `careerYears` | 숫자 | 경력 년수 |
| `certifications` | 배열 | 자격증 목록 |
| `eligibleJobs` | 배열 | 지원 가능 공고 |
| `from` | 숫자 | 공고 최소 요구 경력 |
| `to` | 숫자 | 공고 최대 요구 경력 |
| `marketAvgCareer` | 숫자 | 시장 평균 경력 |
| `marketAvgSkillCount` | 숫자 | 시장 평균 기술 수 |
| `mySkillsLower` | Set | 사용자 기술 소문자 집합 |
| `myInDemandSkills` | 배열 | 시장에서 수요 있는 기술 |
| `topMarketSkills` | 배열 | 시장의 상위 기술 |
| `strengths` | 배열 | 강점 문구 |
| `improvements` | 배열 | 보완점 문구 |
| `stats` | 객체 | 통계 정보 |
| `compareCareer` | 객체 | 경력 비교 데이터 |
| `compareSkills` | 객체 | 기술 비교 데이터 |
| `skillDonut` | 배열 | 기술 도넛 차트 데이터 |

### matching.js (매칭 스코어 계산)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `s` | 문자열 | 정규화할 문자열 |
| `listA` | 배열 | 첫 번째 리스트 |
| `listB` | 배열 | 두 번째 리스트 |
| `setB` | Set | listB의 정규화된 세트 |
| `matched` | 배열 | 일치한 항목 배열 |
| `n` | 숫자 | 클램프할 숫자 |
| `min` | 숫자 | 최소값 |
| `max` | 숫자 | 최대값 |
| `profile` | 객체 | 구직자 프로필 |
| `job` | 객체 | 채용 공고 |
| `careerYears` | 숫자 | 경력 년수 |
| `from` | 숫자 | 공고 최소 경력 |
| `to` | 숫자 | 공고 최대 경력 |
| `careerScore` | 숫자 | 경력 점수 (0-100) |
| `jobSkillTitles` | 배열 | 공고 기술 제목 |
| `matchedSkills` | 배열 | 일치한 기술 |
| `skillScore` | 숫자 | 기술 점수 (0-100) |
| `reqText` | 문자열 | 공고 요구사항 텍스트 |
| `certHits` | 배열 | 자격증 일치 항목 |
| `certScore` | 숫자 | 자격증 점수 (0-100) |
| `score` | 숫자 | 최종 매칭 점수 |
| `missingSkills` | 배열 | 부족한 기술 |
| `basis` | 객체 | 점수 계산 상세 정보 |
| `companyProfile` | 객체 | 기업 프로필 |
| `gpaScale` | 숫자 | 학점 만점 기준 |
| `gpaNormalized` | 숫자 | 정규화된 학점 |
| `minGpa` | 숫자 | 선호 최소 학점 |
| `gpaScore` | 숫자 | 학점 점수 |
| `preferredSkills` | 배열 | 선호 기술 |
| `careerHistory` | 배열 | 경력 이력 |
| `experienceTypes` | 배열 | 경험 유형 |
| `preferredTypes` | 배열 | 선호 경험 유형 |
| `experienceScore` | 숫자 | 경험 점수 |
| `hasInternship` | 불린 | 인턴십 경험 여부 |
| `internshipScore` | 숫자 | 인턴십 점수 |

### gauge.js (게이지 컴포넌트)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `score` | 숫자 | 표시할 점수 (0-100) |
| `size` | 숫자 | 게이지 크기 (px) |
| `stroke` | 숫자 | 게이지 선 두께 (px) |
| `unit` | 문자열 | 게이지 단위 텍스트 |
| `r` | 숫자 | 게이지 원의 반지름 |
| `c` | 숫자 | 게이지 원의 둘레 |
| `pct` | 숫자 | 표시할 백분율 |
| `offset` | 숫자 | SVG stroke-dashoffset |
| `tier` | 문자열 | 게이지 색상 등급 |

### resumeAnalysis.js (자소서 분석)
| 변수명 | 타입 | 역할 |
|--------|------|------|
| `resumeText` | 문자열 | 자소서 텍스트 |
| `job` | 객체 | 채용 공고 |
| `text` | 문자열 | 자소서 내용 |
| `lower` | 문자열 | 소문자로 변환한 자소서 |
| `jobSkills` | 배열 | 공고의 필요 기술 |
| `mentioned` | 배열 | 자소서에 언급된 기술 |
| `missing` | 배열 | 자소서에 미언급된 기술 |
| `strengths` | 배열 | 강점 문구 |
| `improvements` | 배열 | 보완점 문구 |
| `achievementSignals` | 배열 | 성과 표시 키워드 |
| `hasAchievement` | 불린 | 성과 표시 포함 여부 |
| `mentionedSkills` | 배열 | 언급된 기술 |
| `missingSkills` | 배열 | 미언급된 기술 |

---

## 3. 변수 역할 분류

### 인증 및 사용자 정보 변수
- `user`, `role`, `email`, `password`, `profile`, `auth`, `session`

### 프로필 관련 변수
- `profile`, `companyProfile`, `jobseekerProfile`, `profileData`, `existing`
- `career_years`, `skills`, `certifications`, `school`, `major`, `gpa`, `company_name`

### 공고 및 매칭 관련 변수
- `jobs`, `job`, `allJobs`, `companies`, `company`, `skills`, `skill_tags`
- `careerScore`, `skillScore`, `certScore`, `score`, `match`, `matchScore`

### UI 상태 변수
- `activeCategory`, `activeSort`, `activeStatus`, `bookmarkOnly`
- `isOpen`, `isJobseeker`, `isExpired`

### 컬렉션 및 맵 변수
- `bookmarkedIds`, `appliedIds`, `sentScouts`, `scoutMap`, `infoMap`
- `categories`, `NAV_LINKS`, `STATUS_LABELS`, `SKILL_CATEGORIES`

### 계산 결과 변수
- `insights`, `stats`, `compareCareer`, `compareSkills`, `skillDonut`
- `strengths`, `improvements`, `strengths`, `basis`

---

## 4. 최근 변경사항

**2026-07-15 기준 상태:**
- 모든 변수 정의가 현재 코드 상태와 일치합니다.
- 변수 이름 및 역할에서 수정할 사항 없음.

