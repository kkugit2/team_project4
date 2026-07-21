# Variable_re_HyeonJun.md — 프로젝트 전체 변수 정리

> 대상: `app/`, `components/`, `lib/`, `data/`, `types/` 전 파일(65개)
> 각 파일에서 코드 작성 시 생긴 주요 변수(React 상태, 파생값, props, 모듈 상수, 함수 내 핵심 변수, exported 타입/데이터 등)와 그 역할을 정리했다. 자명한 반복문 인덱스, 단순 이벤트 인자 등은 제외했다.

---

## 1. app/ — 라우트

### app/layout.tsx
- `metadata`: Next.js 페이지 메타데이터(타이틀/설명)를 정의하는 모듈 레벨 상수
- `children`: RootLayout에 전달되는 하위 라우트 트리(페이지 콘텐츠)

### app/api/wanted/jobs/route.ts
- `category`: 쿼리스트링에서 추출한 공고 직군 필터 값
- `skillTagsParam`: 쿼리스트링에서 추출한 스킬 태그 id 목록(콤마 구분 원본 문자열)
- `skillTags`: skillTagsParam을 숫자 배열로 파싱한 스킬 태그 id 필터 목록
- `jobs`: 필터링을 거쳐 최종 응답으로 반환될 공고 목록(초기값 MOCK_JOBS)

### app/api/wanted/jobs/[id]/route.ts
- `id`: 라우트 파라미터로 전달된 조회 대상 공고 ID
- `job`: id로 조회한 공고 상세 데이터(없으면 404 처리)

### app/api/wanted/companies/[id]/route.ts
- `id`: 라우트 파라미터로 전달된 조회 대상 회사 ID
- `company`: id로 조회한 회사 상세 데이터(없으면 404 처리)

### app/api/wanted/search/route.ts
- `query`: 검색어 쿼리파라미터를 정규화(trim/lowercase)한 값
- `jobs`: 검색어와 직군/회사명이 매칭되는 공고 목록
- `companies`: 검색어와 이름이 매칭되는 회사 목록

### app/api/tags/[type]/route.ts
- `TAG_MAP`: 태그 타입(skill/category/attraction)별 마스터 태그 목록을 매핑하는 모듈 레벨 상수
- `type`: 라우트 파라미터로 전달된 태그 타입 문자열
- `tags`: TAG_MAP에서 조회한 해당 타입의 태그 목록(없으면 404 처리)

### app/(auth)/login/page.tsx
- `role`: 로그인 폼에서 선택된 역할(구직자/기업) 상태
- `email`: 로그인 폼의 이메일 입력 상태
- `password`: 로그인 폼의 비밀번호 입력 상태
- `result`: login 호출 결과(성공 시 세션 정보, 실패 시 AppError)

### app/(auth)/signup/jobseeker/page.tsx
- `email`: 회원가입 폼의 이메일 입력 상태
- `password`: 회원가입 폼의 비밀번호 입력 상태
- `profile`: 구직자 프로필 입력 폼 데이터 상태(학적/학점/자격증/경력 등)
- `skillTags`: 태그 API에서 불러온 스킬 태그 마스터 목록 상태
- `showOnboarding`: 온보딩(프로필 상세 입력) 폼 노출 여부 상태
- `result`: signUpJobseeker 호출 결과(성공 시 세션, 실패 시 AppError)

### app/(auth)/signup/company/page.tsx
- `email`: 기업 회원가입 폼의 이메일 입력 상태
- `password`: 기업 회원가입 폼의 비밀번호 입력 상태
- `profile`: 기업 인재상 프로필 입력 폼 데이터 상태(선호 학점/스킬/경험/인턴 여부 등)
- `skillTags`: 태그 API에서 불러온 스킬 태그 마스터 목록 상태
- `result`: signUpCompany 호출 결과(성공 시 세션, 실패 시 AppError)

### app/page.tsx
- `session`: 현재 로그인 세션 정보(역할/사용자 ID 포함)
- `sessionLoading`: 세션 로딩 중 여부를 나타내는 플래그
- `jobs`: 원티드에서 가져온 전체 공고 목록 상태
- `category`: 사용자가 선택한 직군 필터 상태
- `sort`: 정렬 기준 상태("due" 마감임박순 또는 "score" 충족률순)
- `profile`: 로그인한 구직자의 프로필 정보 상태
- `forceRerender`: 찜 토글 후 강제 리렌더를 위한 더미 카운터 상태
- `isJobseeker`: 현재 세션이 구직자 역할인지 여부를 나타내는 파생 값
- `profileReady`: 구직자이고 프로필이 충족률 계산 가능한 수준으로 완성됐는지 여부
- `categories`: jobs에서 중복 제거해 추출한 직군 목록(필터 옵션용)
- `scored`: 각 공고에 대해 프로필 기반 합격확률(passProbability)을 계산해 붙인 목록
- `filtered`: 선택된 직군으로 걸러내고 정렬 기준에 따라 정렬한 최종 공고 목록
- `bookmarked`: 찜 토글 요청의 결과(찜 추가/해제 여부) 반환값

### app/job/[id]/page.tsx
- `id`: usePromise(params)로 언래핑한 라우트 파라미터 공고 ID
- `session`: 현재 로그인 세션 정보
- `job`: 공고 상세 데이터 상태
- `company`: 공고가 속한 회사 상세 데이터 상태
- `notFound`: 공고를 찾지 못했을 때 표시할 상태 플래그
- `passProbability`: 로그인한 구직자 기준으로 계산된 합격확률 상태
- `application`: 해당 공고에 대한 현재 사용자의 지원 기록 상태
- `bookmarked`: 해당 공고의 찜 여부 상태
- `isJobseeker`: 현재 세션이 구직자 역할인지 여부를 나타내는 파생 값
- `profile`(이펙트 내 지역 변수): 구직자 프로필 데이터, 충족률 계산에 사용

### app/mypage/page.tsx
- `userId`: 로그인한 구직자의 사용자 ID
- `profile`: 구직자 프로필 데이터 상태(폼 편집 대상)
- `skillTags`: 태그 API에서 불러온 스킬 태그 마스터 목록 상태
- `applications`: 사용자의 지원현황 목록 상태
- `bookmarks`: 사용자의 찜 목록 상태
- `scouts`: 사용자가 받은 스카웃 제안 목록 상태
- `jobsById`: 지원/찜 목록에 필요한 공고 상세를 id로 조회해 캐싱한 맵 상태
- `reload`: 지원현황/찜/스카웃/관련 공고 데이터를 다시 불러와 상태를 갱신하는 콜백
- `apps`(reload 내부): 방금 조회한 최신 지원현황 목록
- `marks`(reload 내부): 방금 조회한 최신 찜 목록
- `ids`(reload 내부): 지원/찜에 연관된 공고 ID 중복 제거 목록
- `result`(handleRespondScout 내부): 스카웃 응답 처리 결과(성공 또는 AppError)

### app/self-intro/page.tsx
- `session`: 현재 로그인 세션 정보
- `searchParams`: URL 쿼리 파라미터 접근 객체(초기 jobId 추출용)
- `jobs`: 자소서 작성 대상 선택을 위한 전체 공고 목록 상태
- `jobId`: 선택된 목표 공고 ID 상태
- `content`: 자기소개서 입력 텍스트 상태
- `consent`: 자소서를 기업에 공유 동의할지 여부 상태(기본 미체크)
- `feedback`: LLM이 생성한 강점/보완점 피드백 결과 상태
- `comparison`: 경쟁자 비교 분석 결과 상태
- `job`(handleSubmit 내부): 선택된 공고의 상세 데이터
- `selfIntro`(handleSubmit 내부): 방금 제출/저장된 자기소개서 레코드
- `result`(handleSubmit 내부): 자소서 기반 생성된 피드백 결과
- `others`(handleSubmit 내부): 같은 공고에 제출된 다른 지원자들의 자소서 본문 목록(경쟁자 비교용)

### app/company/page.tsx
- `companyId`: 로그인한 기업 사용자의 ID
- `companyProfile`: 기업의 인재상 프로필 데이터 상태
- `candidates`: 정보 제공에 동의한 지원자 요약 목록 상태
- `sentScouts`: 이 기업이 발송한 스카웃 목록 상태
- `remainingQuota`: 이번 달 남은 스카웃 발송 가능 건수 상태
- `reload`: 기업 프로필/지원자/스카웃/잔여 한도를 다시 불러오는 콜백
- `sentJobseekerIds`: 이미 스카웃을 보낸 지원자 ID 집합(중복 발송 방지용 파생 값)
- `ranked`: 각 지원자에 대해 인재상 부합도(fitScore)를 계산해 내림차순 정렬한 목록
- `result`(handleSendScout 내부): 스카웃 발송 처리 결과(성공 또는 AppError)

### app/company/mypage/page.tsx
- `companyId`: 로그인한 기업 사용자의 ID
- `profile`: 기업 인재상 프로필 데이터 상태(폼 편집 대상)
- `skillTags`: 태그 API에서 불러온 스킬 태그 마스터 목록 상태
- `viewed`: 이 기업이 열람한 지원자 로그 목록 상태
- `sentScouts`: 이 기업이 발송한 스카웃 목록 상태
- `remainingQuota`: 이번 달 남은 스카웃 발송 가능 건수 상태

---

## 2. components/ — UI 컴포넌트

### components/nav/SessionProvider.tsx
- `SessionContextValue.session`: 현재 로그인한 사용자의 세션 정보(역할 포함), 비로그인 시 null
- `SessionContextValue.isLoading`: localStorage 기반 세션 확인이 끝났는지 여부(마운트 전에는 true)
- `SessionContextValue.refresh`: 세션 상태를 localStorage에서 다시 읽어와 갱신하는 함수
- `SessionContextValue.logout`: 로그아웃 처리 후 세션 상태를 null로 초기화하는 함수
- `session`(state): 현재 세션 객체를 보관하는 React 상태
- `isLoading`(state): 세션 로딩 완료 여부를 나타내는 React 상태

### components/common/Toast.tsx
- `ToastContextValue.showToast`: 지정한 메시지를 토스트로 잠시 노출시키는 함수
- `message`(state): 현재 화면에 표시 중인 토스트 문구, 없으면 null
- `timerRef`: 토스트 자동 숨김을 위한 타이머 핸들을 보관해 중복 호출 시 이전 타이머를 취소하는 데 사용

### components/nav/AuthGuard.tsx
- `requiredRole`(prop): 이 화면 접근에 필요한 역할(jobseeker/company)
- `children`(prop): 인가 통과 시 렌더링할 하위 컨텐츠
- `session`, `isLoading`: SessionProvider에서 가져온 현재 세션과 로딩 상태, 역할 불일치/미로그인 시 로그인 페이지로 리다이렉트하는 조건에 사용

### components/nav/RoleNav.tsx
- `session`, `logout`: 현재 로그인 세션과 로그아웃 함수(SessionProvider에서 획득)
- `pathname`: 현재 경로, 활성 네비게이션 링크 표시에 사용
- `isCompany`: 세션 역할이 company인지 여부, 기업 전용 네비게이션/스타일 분기에 사용
- `links`: 로그인 여부와 역할에 따라 동적으로 구성되는 네비게이션 링크 목록

### components/common/Logo.tsx
- `name`(prop): 로고에 표시할 회사/공고명(첫 글자만 사용)
- `color`(prop): 로고 배경색
- `size`(prop): 로고 크기 변형("sm"|"md"|"lg", 기본 "md")

### components/common/ScoreBadge.tsx
- `label`(prop): 점수 배지에 표시할 라벨 텍스트
- `value`(prop): 0~100 사이의 점수 값, 막대 채움 너비와 색상 등급 결정에 사용

### components/common/DisclaimerBanner.tsx
- `children`(prop): 배너 안에 표시할 안내 문구/콘텐츠

### components/common/EmptyState.tsx
- `message`(prop): 빈 상태일 때 보여줄 안내 문구
- `linkHref`(prop): 빈 상태에서 유도할 행동의 이동 경로(선택)
- `linkLabel`(prop): 해당 링크의 버튼/텍스트 라벨(선택)

### components/common/Modal.tsx
- `title`(prop): 모달 상단에 표시할 제목
- `children`(prop): 모달 본문 콘텐츠
- `onClose`(prop): 오버레이 클릭 시 모달을 닫는 콜백

### components/job/JobCard.tsx
- `job`(prop): 카드에 표시할 공고 데이터(회사명, 직군, 연봉 등)
- `passProbability`(prop): 합격확률/충족률 값, null이면 배지를 표시하지 않음
- `applied`(prop): 이 공고에 지원했는지 여부, 지원완료 배지 표시에 사용
- `bookmarked`(prop): 찜 여부, 찜 아이콘 활성 상태 표시에 사용
- `onToggleBookmark`(prop): 찜 아이콘 클릭 시 호출되는 콜백(선택적으로 제공되면 버튼 노출)

### components/job/JobFilterBar.tsx
- `JobSort`(type): 정렬 기준 값 타입("due" 마감임박순 | "score" 충족률순)
- `categories`(prop): 직군 필터 드롭다운에 노출할 카테고리 목록
- `category`(prop): 현재 선택된 직군 필터 값
- `onCategoryChange`(prop): 직군 필터 변경 콜백
- `sort`(prop): 현재 선택된 정렬 기준
- `onSortChange`(prop): 정렬 기준 변경 콜백
- `showScoreSort`(prop): 충족률순 정렬 옵션을 노출할지 여부(비로그인 등 상황에 따라 숨김)

### components/profile/DynamicListField.tsx
- `label`(prop): 필드 라벨 텍스트
- `hint`(prop): 필드 아래 보조 설명(선택)
- `items`(prop): 현재까지 추가된 항목 목록(자격증 등)
- `onChange`(prop): 항목 목록이 추가/삭제될 때 호출되는 콜백
- `placeholder`(prop): 입력창 플레이스홀더
- `draft`(state): 아직 추가되지 않은 입력 중인 텍스트

### components/profile/GpaScaleInput.tsx
- `SCALE_OPTIONS`: 선택 가능한 학점 만점 기준 목록(4.5/4.3/4.0), 학교별 스케일 정규화 비교를 위해 사용
- `gpa`(prop): 현재 입력된 학점 값(없으면 null)
- `gpaScale`(prop): 현재 선택된 학점 만점 기준
- `onChange`(prop): 학점 또는 만점 기준 변경 시 호출되는 콜백

### components/profile/JobseekerProfileForm.tsx
- `value`(prop): 편집 중인 구직자 프로필 전체 데이터
- `onChange`(prop): 프로필 값이 변경될 때 상위로 전달하는 콜백
- `skillTags`(prop): 선택 가능한 기술 스택 태그 마스터 목록
- `set`: 프로필 특정 필드 하나만 갱신해 onChange로 전달하는 헬퍼 함수
- `toggleSkill`: 스킬 태그 id의 선택/해제를 토글하는 함수
- `updateCareer`: 특정 인덱스의 경력 항목을 부분 수정하는 함수
- `removeCareer`: 특정 인덱스의 경력 항목을 삭제하는 함수
- `emptyCareerEntry`(module function): 빈 경력 항목 초기값을 생성하는 헬퍼

### components/profile/CompanyProfileForm.tsx
- `value`(prop): 편집 중인 기업 프로필 전체 데이터(인재상 조건 포함)
- `onChange`(prop): 프로필 값이 변경될 때 상위로 전달하는 콜백
- `skillTags`(prop): 선호 기술 스택 선택용 태그 마스터 목록
- `set`: 기업 프로필 특정 필드 하나만 갱신해 onChange로 전달하는 헬퍼 함수
- `toggleSkill`: 선호 기술 스택 태그 id의 선택/해제를 토글하는 함수

### components/job/ApplyButton.tsx
- `applyUrl`(prop): 원티드 외부 지원 페이지 URL
- `jobId`(prop): 지원 기록 시 연결할 공고 ID
- `userId`(prop): 로그인한 사용자 ID(없으면 로그인 유도)
- `application`(prop): 이미 지원 기록이 있으면 해당 데이터, 없으면 null
- `onApplied`(prop): 지원 완료 기록 후 상위에 알리는 콜백
- `showConfirm`(state): "지원 완료하셨나요?" 확인 모달의 노출 여부
- `awaitingReturn`(ref): 외부 탭을 열고 복귀를 기다리는 중인지 추적하는 플래그(리렌더 유발 안 함)
- `openExternal`: 원티드 지원 페이지를 새 탭으로 열고 복귀 대기 상태로 전환하는 함수
- `confirmApplied`: 모달 응답에 따라 실제 지원 기록 저장 여부를 결정하는 함수

### components/job/JobDetailSections.tsx
- `job`(prop): 공고 상세 데이터(모집기간, 근무지, 업무, 요건 등)
- `company`(prop): 연결된 회사 상세 정보(없을 수 있음)
- `passProbability`(prop): 합격확률/충족률 값, null이면 관련 섹션 미노출
- `actionSlot`(prop): 액션 버튼(지원하기 등)을 삽입할 슬롯

### components/applications/ApplicationListItem.tsx
- `STATUS_OPTIONS`: 지원 상태 선택 드롭다운에 쓰일 상태값-라벨 매핑 목록(지원완료/서류합격/면접중/최종합격/불합격)
- `application`(prop): 표시할 지원 기록 데이터(상태, 지원일 등)
- `job`(prop): 지원한 공고 정보(회사명, 직군 등)
- `onStatusChange`(prop): 지원 상태 변경 시 호출되는 콜백
- `onRemove`(prop): 지원 기록 삭제 시 호출되는 콜백

### components/bookmarks/BookmarkListItem.tsx
- `job`(prop): 찜한 공고 정보
- `applied`(prop): 해당 공고에 지원했는지 여부, 지원완료 배지 표시에 사용
- `onRemove`(prop): 찜 해제 클릭 시 호출되는 콜백

### components/scout/ScoutInboxItem.tsx
- `STATUS_LABEL`: 스카웃 상태 코드를 한국어 라벨로 매핑하는 상수
- `scout`(prop): 수신한 스카웃 데이터(회사명, 메시지, 발송/만료일, 상태)
- `onRespond`(prop): 수락/거절 버튼 클릭 시 호출되는 콜백

### components/selfIntro/FeedbackResult.tsx
- `feedback`(prop): LLM이 생성한 자소서 피드백(강점/보완점 목록)
- `comparison`(prop): 경쟁자 비교분석 결과(표본 수, 분량 백분위, 평균 길이 또는 표본 부족 상태)

### components/selfIntro/SelfIntroForm.tsx
- `jobs`(prop): 목표 공고 선택 드롭다운에 노출할 공고 목록
- `jobId`(prop): 현재 선택된 목표 공고 ID
- `onJobIdChange`(prop): 목표 공고 선택 변경 콜백
- `content`(prop): 입력 중인 자기소개서 본문
- `onContentChange`(prop): 자기소개서 본문 변경 콜백
- `consent`(prop): 기업 공유 동의 체크박스 상태(기본 미체크 원칙)
- `onConsentChange`(prop): 동의 체크박스 변경 콜백
- `onSubmit`(prop): 분석하기 버튼 클릭 시 제출을 트리거하는 콜백

### components/scout/ScoutModal.tsx
- `candidateLabel`(prop): 스카웃 대상 지원자의 익명화 표시 라벨
- `remainingQuota`(prop): 이번 달 남은 스카웃 발송 가능 건수
- `onSend`(prop): 메시지와 함께 스카웃 발송을 확정하는 콜백
- `onClose`(prop): 모달 닫기 콜백
- `message`(state): 작성 중인 스카웃 제안 메시지 내용

### components/scout/ScoutButton.tsx
- `candidateLabel`(prop): 스카웃 대상 지원자의 익명화 표시 라벨
- `remainingQuota`(prop): 이번 달 남은 스카웃 발송 가능 건수(모달에 전달)
- `alreadySent`(prop): 이미 스카웃을 보냈는지 여부, true면 버튼 대신 비활성 상태 배지 표시
- `onSend`(prop): 스카웃 발송 확정 시 호출되는 콜백
- `open`(state): 스카웃 작성 모달의 열림/닫힘 상태

### components/candidate/CandidateCard.tsx
- `candidate`(prop): 지원자 요약 정보(익명 라벨, 학교/전공, 스킬 태그, 자사 지원 여부 등)
- `fitScore`(prop): 해당 지원자의 인재상 부합도(충족률) 값
- `content`(prop): 자소서 요약/발췌 내용
- `alreadySent`(prop): 이 지원자에게 스카웃을 이미 보냈는지 여부
- `remainingQuota`(prop): 이번 달 남은 스카웃 발송 가능 건수
- `onView`(prop): 카드가 처음 조회(노출)될 때 호출되는 콜백(로그 기록용)
- `onSendScout`(prop): 스카웃 발송 확정 시 호출되는 콜백
- `viewed`(ref): 조회 로그가 이미 기록되었는지 추적해 중복 호출을 막는 플래그

### components/scout/SentScoutList.tsx
- `STATUS_LABEL`: 스카웃 상태 코드를 한국어 라벨로 매핑하는 상수
- `scouts`(prop): 기업이 발송한 스카웃 목록(상태별 필터링된 결과 표시용)

---

## 3. lib/ — 로직/데이터 접근 모듈

### lib/localDb.ts
- `isBrowser`: `window` 객체 존재 여부로 브라우저 환경인지 판별하는 내부 헬퍼 함수
- `key`: localStorage에 접근할 테이블/싱글턴의 식별자 문자열
- `raw`: localStorage에서 읽어온 직렬화된 JSON 원본 문자열
- `rows`: 특정 key에 대응하는 레코드 배열(테이블 전체 데이터)
- `matches`: 특정 행을 찾기 위한 조건 판별 콜백 함수
- `updater`: 찾은 행을 새 값으로 변환하는 콜백 함수
- `idx`: `matches` 조건에 맞는 행의 배열 인덱스
- `prefix`: 생성되는 ID 앞에 붙는 도메인 구분 접두사(예: "user", "scout")
- `rand`: `crypto.randomUUID()` 또는 타임스탬프+난수 기반의 유일성 보장 문자열

### lib/constants.ts
- `TABLE_KEYS`: Supabase 테이블명과 대응되는 localStorage 키 모음(인증/프로필/지원/찜/자소서/스카웃 등)
- `MATCH_WEIGHTS`: 매칭 스코어 계산 시 학점/기술스택/경험/인턴십 항목별 기본 가중치(25/35/25/15)
- `SCOUT_MONTHLY_LIMIT`: 기업이 최근 30일간 발송 가능한 스카웃 최대 건수(10건)
- `SCOUT_EXPIRY_DAYS`: 스카웃 제안이 발송 후 만료되기까지의 기간(7일)
- `MIN_COMPARISON_SAMPLE`: 경쟁자 비교분석을 수행하기 위한 최소 자소서 표본 수(5건)

### lib/errors.ts
- `AppError`: 백엔드 공통 에러 응답 포맷을 정의하는 인터페이스(`{ error: { code, message } }`)
- `code`: 에러를 구분하는 문자열 코드(예: SCOUT_LIMIT_EXCEEDED)
- `message`: 사용자에게 노출할 사람이 읽을 수 있는 에러 설명
- `ERROR_CODES`: 프로젝트 전역에서 재사용하는 에러 코드 상수 모음(스카웃 한도초과, 인증실패, 이메일중복, 미존재, 권한없음)

### lib/format.ts
- `amount`: 원 단위 숫자를 "만원" 단위 문자열로 변환할 원본 금액
- `dateStr`: 마감일 원본 문자열(null이면 "상시모집" 처리)
- `iso`: ISO 8601 형식의 날짜/시간 문자열, 화면 표기용으로 포맷 변환됨
- `pad`: 한 자리 숫자를 두 자리 문자열로 0-패딩하는 내부 헬퍼
- `ScoreLevel`: 점수를 "high"/"mid"/"low" 3단계로 분류하는 타입
- `value`: `scoreLevel` 판정에 쓰이는 점수 값(65 이상 high, 40 이상 mid, 그 외 low)

### lib/auth.ts
- `AuthUserRecord`: 목업 인증 사용자 레코드(userId, email, 평문 password, role)
- `password`: 데모 전용으로 평문 저장되는 비밀번호(MVP 한계로 명시됨)
- `findUserByEmail`: 이메일로 등록된 사용자 레코드를 찾는 내부 헬퍼
- `createSession`: 로그인/가입 성공 시 세션 객체를 만들어 localStorage 싱글턴에 저장하는 함수
- `JobseekerSignupInput`: 구직자 회원가입 시 필요한 입력(email, password, 선택적 profile)
- `CompanySignupInput`: 기업 회원가입 시 필요한 입력(email, password, companyName, 선택적 profile)
- `userId`: `genId`로 생성된 신규 사용자의 고유 식별자
- `profile`: 회원가입 시 초기값과 입력값을 병합해 저장하는 구직자/기업 프로필 객체

### lib/scouts.ts
- `THIRTY_DAYS_MS`: 30일을 밀리초로 환산한 상수(월 발송 한도 롤링 윈도우 계산용)
- `companyId`: 스카웃을 발송한 기업의 식별자, 발송 건수 집계/한도 검사 기준
- `allScouts`/`rows`: 전체 스카웃 레코드 배열
- `now`: 만료/한도 계산의 기준 시각(테스트 용이성을 위해 인자로 주입 가능)
- `cutoff`: "최근 30일" 판단의 시작 시점 타임스탬프
- `limit`: 월간 발송 허용 한도(기본값 SCOUT_MONTHLY_LIMIT)
- `sentAt`/`expiresAt`: 스카웃 발송 시각과 만료 시각(발송 시점에 +7일로 고정)
- `scout`: 새로 생성되는 스카웃 레코드(id, 상태, 발송/만료 시각 포함)
- `SeededFlags`: 신규 구직자에게 데모용 스카웃을 이미 시드했는지 기록하는 플래그 구조체
- `flags.scoutsSeededFor`: 이미 데모 스카웃이 시드된 구직자 userId 목록
- `seeded`: `SEED_SCOUT_TEMPLATES`를 기반으로 생성된 신규 구직자용 데모 스카웃 배열

### lib/profiles.ts
- `userId`: 프로필을 조회/수정할 대상 사용자의 식별자
- `found`: localStorage에서 조회된 기존 프로필(없으면 빈 프로필 기본값 사용)
- `profile`: 갱신하여 저장할 구직자/기업 프로필 객체
- `companyName`: 기업 프로필이 없을 때 빈 프로필 생성 시 사용할 회사명 기본값

### lib/wanted.ts
- `toDomainJob`/`toDomainJobDetail`/`toDomainCompany`: 원티드 API 원본 응답을 내부 도메인 타입으로 변환하는 어댑터(실 API 필드 어긋남 방어용)
- `JobFilters`: 공고 목록 조회 시 필터 조건(category, skillTags)을 담는 인터페이스
- `params`: 쿼리스트링 조립에 쓰이는 URLSearchParams 객체
- `qs`: 최종 조립된 쿼리스트링 문자열
- `res`: `/api/wanted/*` 프록시 라우트에 대한 fetch 응답 객체
- `raw`: 프록시 응답을 파싱한 원본 JSON 배열(도메인 변환 전)

### lib/tags.ts
- `type`: 조회할 태그 종류(skill/category/attraction 등 TagType)
- `res`: `/api/tags/:type` 캐시 우선 조회 라우트의 fetch 응답 객체

### lib/matchScore.ts
- `JobseekerScoringInput`: 매칭 계산에 필요한 구직자 항목만 뽑은 타입(gpa, gpaScale, skillTagIds, careerHistory)
- `CompanyScoringInput`: 매칭 계산에 필요한 기업 인재상 항목만 뽑은 타입(preferredGpaMin, preferredSkillTagIds, preferredExperienceType, internshipRequired)
- `COMPANY_GPA_REFERENCE_SCALE`: 기업의 preferredGpaMin이 4.5만점 기준으로 입력된다고 가정하는 정규화 기준값
- `gpaApplicable`: 기업이 학점 조건을 설정했는지 여부(미설정 시 항목 자체를 총점에서 제외)
- `gpaMet`: 구직자의 정규화된 학점이 기업 기준 이상인지 여부
- `matchedSkillIds`: 구직자 스킬과 기업 선호 스킬의 교집합 태그 id 목록
- `skillsApplicable`/`skillsMet`: 기업이 선호 스킬을 설정했는지, 1개 이상 일치하는지 여부
- `experienceApplicable`/`experienceMet`: 기업이 선호 경험 유형을 설정했는지, 구직자 경력 중 일치 항목이 있는지 여부
- `internshipApplicable`/`internshipMet`: 기업이 인턴십을 필수로 요구하는지, 구직자 경력에 인턴 경험이 있는지 여부
- `basis`: 항목별(gpa/skills/experience/internship) 적용여부·충족여부·가중치·매칭스킬을 담은 상세 근거 객체
- `applicableWeight`: 기업이 실제로 설정한(적용 가능한) 항목들의 가중치 합계(분모)
- `metWeight`: 그중 실제로 충족한 항목들의 가중치 합계(분자)
- `score`: 최종 충족률(0~100, 적용 가능 가중치가 0이면 0)
- `computeJobseekerPassProbability`: 구직자 관점 "합격 확률" 용도로 재노출된 computeMatchScore 별칭
- `computeCandidateFitScore`: 기업 관점 "지원자 적합도" 용도로 재노출된 computeMatchScore 별칭(공식 동일, 인자만 반대)

### lib/applications.ts
- `userId`/`jobId`: 지원현황을 조회/기록/삭제할 대상 사용자와 공고의 식별자
- `existing`: 이미 등록된 지원 기록(중복 기록 방지를 위해 사전 확인)
- `status`: 지원 상태값(기본 "self_reported", PRD 자진신고 플로우 기준)
- `appliedAt`: 지원 기록이 생성된 시각(ISO 문자열)

### lib/bookmarks.ts
- `userId`/`jobId`: 찜 여부를 조회/토글할 대상 사용자와 공고의 식별자
- `bookmarked`: 토글 시점의 기존 찜 여부(true면 삭제, false면 추가로 분기)
- `createdAt`: 찜이 생성된 시각(ISO 문자열)

### lib/mockLlm.ts
- `LlmFeedback`: 자소서 분석 결과 타입(strengths, improvements 배열)
- `extractJobKeywords`: 공고의 skillTagIds를 태그 제목 문자열 배열로 변환하는 헬퍼
- `resumeText`/`trimmed`: 분석 대상 자소서 원문과 공백 제거된 버전
- `keywords`: 해당 공고에서 요구하는 스킬 태그 제목 목록
- `normText`: 대소문자 무시 비교를 위해 소문자화한 자소서 본문
- `hitKeywords`/`missingKeywords`: 자소서에 언급된 공고 키워드 목록과 언급되지 않은 키워드 목록
- `sentenceCount`: 자소서 내 문장 종결부호(.!?) 개수로 추정한 문장 수
- `strengths`/`improvements`: 규칙 기반으로 누적되는 강점/보완점 문구 배열(Claude API 연동 시 이 반환 형태만 유지하면 됨)

### lib/competitorComparison.ts
- `ComparisonOk`: 비교 가능 상태의 결과 타입(sampleSize, averageLength, lengthPercentile 포함)
- `ComparisonInsufficient`: 표본 부족 상태의 결과 타입(sampleSize만 포함)
- `currentContent`: 비교 기준이 되는 본인 자소서 본문
- `otherContents`: 같은 공고에 제출된 본인 제외 다른 자소서 본문 배열
- `sampleSize`: 비교 대상 타 자소서 개수(MIN_COMPARISON_SAMPLE 미만이면 비교 생략)
- `lengths`: 타 자소서들의 공백제거 후 글자 수 배열
- `averageLength`: 타 자소서들의 평균 글자 수
- `currentLength`: 본인 자소서의 공백제거 후 글자 수
- `below`: 본인 자소서보다 짧거나 같은 타 자소서 개수
- `lengthPercentile`: 본인 자소서 분량이 타 자소서 대비 위치하는 백분위

### lib/selfIntro.ts
- `selfIntro`: 신규 제출되는 자소서 레코드(id, userId, jobId, content, 제출시각, 공유동의여부)
- `sharedWithCompany`(input): 자소서 제출 시 기업 공유 동의 여부(옵트인)
- `si`: 특정 selfIntroId로 조회된 자소서 레코드
- `result`: 생성되어 저장되는 피드백 결과(selfIntroId, strengths, improvements, generatedAt)
- `realShared`: 실제 가입 구직자 중 `sharedWithCompany=true`로 동의한 자소서 목록(유일한 노출 관문)
- `realCandidates`: `realShared`를 기반으로 익명화(지원자 XXXX)하여 구성한 실제 후보 요약 목록
- `appliedToThisCompany`: 해당 후보가 조회 기업의 실제 공고(wantedCompanyId 매칭)에 지원했는지 여부
- `seededCandidates`: `MOCK_CANDIDATES` 기반으로 생성된 데모용 가상 후보 요약 목록(기업 랜딩 단독 데모용)
- `companyProfile`: 후보 리스트를 조회하는 주체 기업의 프로필(wantedCompanyId 등 매칭 기준 포함)

### lib/viewedCandidates.ts
- `companyId`/`jobseekerId`: 열람 기록을 남기거나 조회할 기업과 구직자(후보)의 식별자
- `rows`: 저장된 전체 열람 기록 배열
- `viewedAt`: 열람이 최초로 기록된 시각(ISO 문자열, 중복 기록 방지 후 1회만 저장)

---

## 4. data/ — 목업 시드 데이터

### data/mockTags.ts
- `SKILL_TAGS`: 원티드 스킬 태그 마스터 목업 배열 — id/type("skill")/title(Python, React 등 16개 기술 스택)로 구성
- `CATEGORY_TAGS`: 직군 카테고리 태그 목업 배열 — id(101~107)/type("category")/title(서버·프론트·데이터 등 7개 직군)
- `ATTRACTION_TAGS`: 기업 매력/복지 태그 목업 배열 — id(201~206)/type("attraction")/title(자율출퇴근, 재택근무 등 6개)
- `ALL_TAGS`: 위 세 배열을 합친 전체 태그 리스트
- `findTagById`: id로 `ALL_TAGS`에서 태그 하나를 찾는 조회 함수
- `findTagsByIds`: id 배열로 매칭되는 태그들을 찾아 반환하는 조회 함수

### data/mockCompanies.ts
- `MOCK_COMPANIES`: 원티드 `/companies/{id}` 응답 형태를 흉내낸 회사 목업 배열(8개) — id/name/color/description/benefits/cultureTagIds(매력태그 id 배열)/avgSalary 필드 보유
- `findCompanyById`: id로 `MOCK_COMPANIES`에서 회사 하나를 찾는 조회 함수

### data/mockJobs.ts
- `MOCK_JOBS`: 원티드 `/jobs`, `/jobs/{id}` 응답 형태를 흉내낸 공고 상세 목업 배열(8개) — id/companyId/category/position/location/dueTime/applyUrl/skillTagIds/salary/intro/mainTasks/requirements/preferredPoints/hireRounds/benefits/promoImages 등 `JobDetail` 전 필드 포함
- `findJobById`: id로 `MOCK_JOBS`에서 공고 하나를 찾는 조회 함수

### data/mockCandidates.ts
- `MockCandidate`(인터페이스): 기업용 랜딩(4-2) 데모를 위한 가상 지원자 타입 — jobseekerId/displayLabel/school/major/gpa/gpaScale/skillTagIds/careerHistory/selfIntroId/jobId/content 필드
- `MOCK_CANDIDATES`: 미리 시드된 가상 지원자 6명 배열 — 각기 다른 공고(jobId)에 지원한 지원자 A~F, 실제 localStorage 제출자와 합쳐져 `lib/selfIntro.listCandidatesForCompany`에서 사용됨

### data/seedScouts.ts
- `SeedScoutTemplate`(인터페이스): 신규 구직자 스카웃함을 채우기 위한 데모 스카웃 템플릿 타입 — companyId/companyName/message 필드
- `SEED_SCOUT_TEMPLATES`: 신규 가입 구직자에게 1회 심어주는 데모 스카웃 2건 배열(테크노바, 클라우드메이트), `lib/scouts.ts`의 `seedDemoScoutsForNewJobseeker`에서 사용됨

---

## 5. types/ — 공유 타입

### types/index.ts
- (배럴 파일) `domain.ts`, `profile.ts`, `social.ts`의 모든 export를 재노출하는 진입점 — 별도 타입 정의 없음

### types/domain.ts
- `TagType`: 태그 종류를 구분하는 유니언 타입 — "skill" | "category" | "attraction"
- `Tag`: 원티드 태그 API 항목 타입 — id/type/title 필드
- `PromoImage`: 공고 홍보 이미지 타입 — label(설명)/bg(배경색) 필드
- `Job`: 채용 공고 기본 도메인 타입 — id/companyId/companyName/companyColor/category/position/location/dueTime/applyUrl/skillTagIds/salary(newHire, average) 필드
- `JobDetail`: `Job`을 확장한 공고 상세 타입 — intro/mainTasks/requirements/preferredPoints/hireRounds/benefits/promoImages 필드 추가
- `Company`: 회사 도메인 타입 — id/name/color/description/benefits/cultureTagIds/avgSalary(선택) 필드

### types/profile.ts
- `CareerEntry`: 경력 항목 타입 — company/period/role/isInternship 필드
- `JobseekerProfile`: 구직자 프로필 타입 — userId/school/major/graduationStatus/gpa/gpaScale/certifications/careerHistory/skillTagIds/resumeText 필드
- `CompanyProfile`: 기업(인재상) 프로필 타입 — userId/companyName/wantedCompanyId(선택)/preferredGpaMin/preferredSkillTagIds/preferredExperienceType/internshipRequired 필드
- `emptyJobseekerProfile`: userId만 받아 빈 값으로 초기화된 `JobseekerProfile` 객체를 생성하는 팩토리 함수
- `emptyCompanyProfile`: userId/companyName을 받아 빈 값으로 초기화된 `CompanyProfile` 객체를 생성하는 팩토리 함수

### types/social.ts
- `Role`: 사용자 역할 유니언 타입 — "jobseeker" | "company"
- `Session`: 로그인 세션 타입 — userId/email/role 필드
- `ApplicationStatus`: 지원 진행 상태 유니언 타입 — "self_reported" | "document_pass" | "interview" | "hired" | "rejected"
- `Application`: 지원 기록 타입 — userId/jobId/status/appliedAt 필드
- `Bookmark`: 찜(북마크) 기록 타입 — userId/jobId/createdAt 필드
- `SelfIntro`: 자소서 제출 타입 — id/userId/jobId/content/submittedAt/sharedWithCompany 필드
- `FeedbackResult`: LLM 자소서 피드백 결과 타입 — selfIntroId/strengths/improvements/generatedAt 필드
- `MatchCriterionBasis`: 매칭 항목 하나의 충족 근거 타입 — applicable/met/weight/detail(선택) 필드
- `MatchBasis`: 매칭 스코어 전체 항목별 근거 타입 — gpa/skills(matchedSkillIds 추가)/experience/internship 필드(각각 `MatchCriterionBasis`)
- `MatchScoreResult`: 매칭 계산 결과 타입 — score/basis 필드
- `MatchScore`: `MatchScoreResult`를 확장한 저장용 매칭 스코어 타입 — jobseekerId/companyId/computedAt 필드 추가
- `ScoutStatus`: 스카웃 상태 유니언 타입 — "sent" | "accepted" | "rejected" | "expired"
- `Scout`: 스카웃 제안 타입 — id/companyId/companyName/jobseekerId/message/status/sentAt/expiresAt 필드
- `ViewedCandidate`: 기업이 확인한 지원자 로그 타입 — companyId/jobseekerId/viewedAt 필드
- `CandidateSummary`: 기업에게 노출되는 익명화된 지원자 요약 타입 — jobseekerId/displayLabel/school/major/gpa/gpaScale/skillTagIds/careerHistory/selfIntroId/jobId/appliedToThisCompany 필드
