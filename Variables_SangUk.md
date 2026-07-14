# 변수 정리 (MVP Sprint 1 - HTML/CSS/JavaScript 3페이지)

**작성일**: 2026-07-15  
**기술 스택**: HTML5 + CSS3 + Vanilla JavaScript  
**파일**: LoginSignUpPage.html, SeekerMyPage.html, CompanyDetailPage.html

---

## 1. CSS 변수 시스템 (모든 파일 공통)

### 색상 변수 (--color-*)

| 변수명 | HEX 값 | RGB | 용도 |
|--------|--------|-----|------|
| `--color-primary-blue` | #0052CC | 0, 82, 204 | CTA 버튼, 링크, 활성 상태 |
| `--color-primary-green` | #2ECC40 | 46, 204, 64 | 성공, 높은 일치도 (75%↑) |
| `--color-primary-orange` | #FF8C00 | 255, 140, 0 | 경고, 중간 일치도 (50-74%) |
| `--color-light-gray` | #F5F7FA | 245, 247, 250 | 배경, 비활성 상태 |
| `--color-medium-gray` | #8A92A6 | 138, 146, 166 | 서브 텍스트, 비활성 요소 |
| `--color-dark-gray` | #2C3E50 | 44, 62, 80 | 본문 텍스트, 제목 |
| `--color-white` | #FFFFFF | 255, 255, 255 | 기본 배경 |
| `--color-error` | #DC3545 | 220, 53, 69 | 에러, 낮은 일치도 (<50%) |

### 타이포그래피 변수 (--font-size-*)

| 변수명 | 값 | 용도 |
|--------|-----|------|
| `--font-size-h1` | 32px | 페이지 제목 |
| `--font-size-h2` | 24px | 섹션 제목, 모달 제목 |
| `--font-size-h3` | 18px | 카드 제목, 폼 라벨 |
| `--font-size-body-large` | 16px | 설명 텍스트 |
| `--font-size-body` | 14px | 일반 본문 |
| `--font-size-small` | 12px | 메타 정보 |
| `--font-size-caption` | 11px | 배지, 태그 |

### 여백 변수 (--spacing-*)

| 변수명 | 값 | 용도 |
|--------|-----|------|
| `--spacing-xs` | 4px | 인라인 요소 간격 |
| `--spacing-sm` | 8px | 버튼 패딩, 타이트한 간격 |
| `--spacing-md` | 16px | 카드 패딩, 섹션 내 간격 |
| `--spacing-lg` | 24px | 섹션 간 간격 |
| `--spacing-xl` | 32px | 주요 섹션 분리 |
| `--spacing-2xl` | 48px | 페이지 상하 여백 |

---

## 2. LoginSignUpPage.html 변수

### 페이지 상태 및 UI 요소 ID

| 요소 ID | 타입 | 설명 | 초기 상태 |
|---------|------|------|---------|
| `loginPage` | div | 로그인 페이지 컨테이너 | display: block (active) |
| `signupPage` | div | 회원가입 페이지 컨테이너 | display: none |
| `step1`, `step2`, `step3` | div | 회원가입 단계별 섹션 | step1만 active |
| `progressFill` | div | 진행률 막대 | width: 33.33% (Step 1) |
| `stepCounter` | span | 현재 단계 표시 | "1" |

### 로그인 폼 입력필드

| 입력필드 ID | 타입 | 검증 규칙 | 에러 메시지 ID |
|------------|------|----------|---------------|
| `loginEmail` | email | 이메일 형식 검증 | `loginEmailError` |
| `loginPassword` | password | 비밀번호 필수 | 별도 없음 |
| `loginForm` | form | 폼 제출 처리 | - |

### 회원가입 Step 2 입력필드

| 입력필드 ID | 타입 | 검증 규칙 | 값 예시 |
|------------|------|----------|--------|
| `signupEmail` | email | 유효한 이메일 | user@example.com |
| `signupPassword` | password | 8자 이상, 대소문자+숫자+특수문자 | P@ssw0rd |
| `signupPasswordConfirm` | password | 비밀번호 일치 | P@ssw0rd |

### 비밀번호 검증 체크리스트

| 체크 ID | 검증 조건 | 아이콘 |
|---------|---------|--------|
| `check1` | 8자 이상 | ○ → ✓ |
| `check2` | 대문자, 소문자, 숫자 포함 | ○ → ✓ |
| `check3` | 특수 문자 (!@#$%^&*) 포함 | ○ → ✓ |

### 회원가입 Step 3 입력필드

| 입력필드 ID | 타입 | 옵션/범위 | 필수 여부 |
|------------|------|----------|---------|
| `education` | select | high_school, bachelor, master, associate, none | 선택사항 |
| `gpa` | select | 0.0 ~ 4.5 (0.1 단위) / none | 선택사항 |
| `skillInput` | text | 자유 입력 | 선택사항 |
| `experience` (radio) | radio | entry, internship, experienced | 선택사항 |

### JavaScript 변수

| 변수명 | 타입 | 초기값 | 설명 |
|--------|------|--------|------|
| `selectedUserType` | string | null | 'seeker' 또는 'recruiter' |
| `selectedSkills` | array | [] | 추가된 기술 스택 배열 |
| `editingId` | number/null | null | 편집 중인 자격증/경력 ID |

### 로컬스토리지 저장 데이터

```javascript
// userSignup 객체
{
  userType: 'seeker' | 'recruiter',
  email: string,
  password: string,
  education: string | null,
  gpa: string | null,
  skills: array,
  experience: string | null
}

// 로그인 상태
isLoggedIn: 'true' | 'false'
userEmail: string
```

### 주요 JavaScript 함수

| 함수명 | 인자 | 반환값 | 설명 |
|--------|------|--------|------|
| `switchToLogin()` | - | void | 로그인 페이지로 전환 |
| `switchToSignup()` | - | void | 회원가입 페이지로 전환 |
| `selectUserType(type, element)` | type: string, element: DOM | void | 사용자 타입 선택 |
| `moveToStep(step)` | step: 1-3 | void | 회원가입 단계 이동 |
| `validateStep1()` | - | boolean | Step 1 검증 |
| `validateStep2()` | - | boolean | Step 2 검증 |
| `validatePassword(password)` | password: string | void | 비밀번호 검증 (실시간) |
| `validatePasswordMatch()` | - | void | 비밀번호 일치 확인 |
| `togglePasswordVisibility(inputId)` | inputId: string | void | 비밀번호 보이기/숨기기 |
| `addSkill(event)` | event: KeyboardEvent | void | 기술 스택 추가 |
| `removeSkill(skill)` | skill: string | void | 기술 스택 제거 |
| `completeSignup()` | - | void | 회원가입 완료 |

---

## 3. SeekerMyPage.html 변수

### 프로필 섹션 ID

| 요소 ID | 타입 | 설명 |
|---------|------|------|
| `profileName` | h1 | 사용자 이름 |
| `profileEmail` | p | 사용자 이메일 |
| `educationCard` | div | 학적 카드 |
| `gpaCard` | div | 학점 카드 |
| `educationContent` | div | 학적 표시 영역 |
| `gpaContent` | div | 학점 표시 영역 |

### 리스트 컨테이너 ID

| 요소 ID | 내용 | 빈 상태 메시지 |
|---------|------|---------------|
| `certificateList` | 자격증 목록 | "아직 등록한 자격증이 없습니다" |
| `experienceList` | 경력 목록 | "아직 등록한 경력이 없습니다" |
| `scoutList` | 스카웃 목록 | "스카웃이 없습니다" |

### 자격증 모달 입력필드

| 입력필드 ID | 타입 | 검증 규칙 | 필수 여부 |
|------------|------|----------|---------|
| `certificateModal` | div | 모달 컨테이너 | - |
| `certTitle` | h2 | 모달 제목 | - |
| `certName` | text | 자격증명 | 필수 |
| `certIssued` | date | 취득 일자 (YYYY-MM-DD) | 필수 |
| `certExpires` | date | 만료 일자 (YYYY-MM-DD) | 선택사항 |
| `certIssuer` | text | 발급 기관 | 선택사항 |

### 경력 모달 입력필드

| 입력필드 ID | 타입 | 검증 규칙 | 필수 여부 |
|------------|------|----------|---------|
| `experienceModal` | div | 모달 컨테이너 | - |
| `expTitle` | h2 | 모달 제목 | - |
| `expCompany` | text | 회사명 | 필수 |
| `expPosition` | text | 직급/직무 | 필수 |
| `expStart` | date | 근무 시작일 | 필수 |
| `expEnd` | date | 근무 종료일 | 선택사항 |
| `isCurrent` | checkbox | 현직 여부 | - |
| `expDescription` | textarea | 업무 설명 | 선택사항 |

### 스카웃 탭 ID

| 요소 ID | 설명 |
|---------|------|
| `.tab` | 탭 버튼 |
| `.tab.active` | 활성 탭 |
| `scoutCount` | 받은 스카웃 개수 |

### JavaScript 데이터 구조

#### userData 객체
```javascript
{
  name: string,
  email: string,
  education: string,
  gpa: string,
  certificates: [{ id, name, issued, expires, issuer }],
  experiences: [{ id, company, position, start, end, isCurrent, description }],
  scouts: {
    received: [{ id, company, position, message, salary, expiresDays, status }],
    rejected: [...],
    accepted: [...]
  }
}
```

#### 자격증 객체
```javascript
{
  id: number,
  name: string,
  issued: string (YYYY-MM-DD),
  expires: string (YYYY-MM-DD),
  issuer: string
}
```

#### 경력 객체
```javascript
{
  id: number,
  company: string,
  position: string,
  start: string (YYYY-MM-DD),
  end: string (YYYY-MM-DD),
  isCurrent: boolean,
  description: string
}
```

#### 스카웃 객체
```javascript
{
  id: number,
  company: string,
  position: string,
  message: string,
  salary: string,
  expiresDays: number,
  status: 'pending' | 'accepted' | 'rejected'
}
```

### 주요 JavaScript 함수

| 함수명 | 인자 | 반환값 | 설명 |
|--------|------|--------|------|
| `init()` | - | void | 페이지 초기화 |
| `renderProfile()` | - | void | 프로필 표시 |
| `renderCertificates()` | - | void | 자격증 목록 렌더링 |
| `renderExperiences()` | - | void | 경력 목록 렌더링 |
| `renderScouts()` | - | void | 스카웃 목록 렌더링 |
| `openCertificateModal()` | - | void | 자격증 추가 모달 열기 |
| `closeCertificateModal()` | - | void | 자격증 모달 닫기 |
| `editCertificate(id)` | id: number | void | 자격증 편집 |
| `saveCertificate(e)` | e: Event | void | 자격증 저장 |
| `deleteCertificate(id)` | id: number | void | 자격증 삭제 |
| `openExperienceModal()` | - | void | 경력 추가 모달 열기 |
| `closeExperienceModal()` | - | void | 경력 모달 닫기 |
| `editExperience(id)` | id: number | void | 경력 편집 |
| `saveExperience(e)` | e: Event | void | 경력 저장 |
| `deleteExperience(id)` | id: number | void | 경력 삭제 |
| `switchScoutTab(tab, element)` | tab: string, element: DOM | void | 스카웃 탭 전환 |
| `acceptScout(id)` | id: number | void | 스카웃 수락 |
| `rejectScout(id)` | id: number | void | 스카웃 거절 |
| `logout()` | - | void | 로그아웃 |
| `deleteAccount()` | - | void | 계정 삭제 |

---

## 4. CompanyDetailPage.html 변수

### 회사 정보 표시 ID

| 요소 ID | 타입 | 설명 |
|---------|------|------|
| `companyName` | h1 | 회사명 |
| `industry` | span | 산업 분류 |
| `location` | span | 위치 |
| `size` | span | 직원 수 |
| `description` | p | 회사 설명 (말줄임 4줄) |

### 합격 확률 카드 ID

| 요소 ID | 설명 | 색상 매핑 |
|---------|------|---------|
| `passRateCard` | 카드 컨테이너 | green (75%↑) / orange (50-74%) / red (<50%) |
| `passRateNumber` | 합격 확률 % | green / orange / red |
| `passRateDesc` | 요구사항 충족 설명 | - |
| `check1` | 학점 체크리스트 | ✓ / ✗ |
| `check2` | 기술스택 체크리스트 | ✓ / ✗ |
| `check3` | 경험 체크리스트 | ✓ / ✗ |
| `check4` | 인턴십 체크리스트 | ✓ / ✗ |

### 액션 버튼 ID

| 요소 ID | 동작 | 상태 변화 |
|---------|------|---------|
| `bookmarkBtn` | 찜하기 | 🤍 → ❤️ (bookmarked) |
| `appliedBtn` | 지원 완료 | secondary → success |

### 포지션 리스트 ID

| 요소 ID | 설명 |
|---------|------|
| `positionList` | 채용 포지션 카드 컨테이너 |

### 기업 정보 ID

| 요소 ID | 설명 |
|---------|------|
| `infoIndustry` | 산업 |
| `infoSize` | 규모 |
| `infoFounded` | 설립일 |
| `infoWorkType` | 근무 형태 |
| `benefitsList` | 복리후생 목록 |

### JavaScript 변수

| 변수명 | 타입 | 초기값 | 설명 |
|--------|------|--------|------|
| `isBookmarked` | boolean | false | 찜 상태 |
| `isApplied` | boolean | false | 지원 완료 상태 |
| `editingId` | number/null | null | 편집 중인 항목 ID |

### 회사 데이터 구조 (companyData)

```javascript
{
  id: number,
  name: string,
  industry: string,
  description: string,
  location: string,
  size: string,
  founded: string,
  workType: string,
  benefits: string[],
  positions: [
    {
      id: number,
      title: string,
      requirements: string,
      skills: string[],
      location: string,
      deadline: string (YYYY-MM-DD),
      isUrgent: boolean
    }
  ]
}
```

### 사용자 데이터 구조 (userData)

```javascript
{
  gpa: number,
  skills: string[],
  experience: string,
  internship: boolean
}
```

### 합격 확률 계산 로직

```
1. 학점: userData.gpa >= 3.5 → 충족
2. 기술스택: userData.skills에 회사 필요 스킬 포함 → 충족
3. 경험: userData.experience >= 2년 → 충족
4. 인턴십: userData.internship === true → 충족

충족률(%) = (충족 항목 수 / 4) * 100
색상: 75%↑ 초록, 50-74% 주황, <50% 빨강
```

### 주요 JavaScript 함수

| 함수명 | 인자 | 반환값 | 설명 |
|--------|------|--------|------|
| `init()` | - | void | 페이지 초기화 |
| `renderCompanyInfo()` | - | void | 회사 정보 표시 |
| `renderPassRate()` | - | void | 합격 확률 계산 및 표시 |
| `renderPositions()` | - | void | 채용 포지션 렌더링 |
| `toggleBookmark()` | - | void | 찜하기 토글 |
| `applyCompany()` | - | void | 지원하기 (외부 링크) |
| `toggleApplied()` | - | void | 지원 완료 토글 |
| `openPosition(title)` | title: string | void | 포지션 상세 페이지 |
| `goBack()` | - | void | 뒤로가기 |

---

## 5. CSS 클래스 시스템

### 버튼 클래스

| 클래스 | 스타일 | 상태 변화 |
|--------|--------|---------|
| `.primary` | 파란색 배경, 흰색 텍스트 | hover: 어두운 파랑 + 1px 상승 |
| `.secondary` | 회색 배경, 파란색 텍스트 | hover: 더 밝은 회색 |
| `.danger` | 빨강 배경, 흰색 텍스트 | hover: 어두운 빨강 |
| `.success` | 초록 배경, 흰색 텍스트 | - |
| `.text-link` | 배경 없음, 파란색 텍스트 | underline |
| `.edit-btn` | 텍스트 링크 스타일 | - |
| `.add-btn` | 텍스트 링크 스타일 | - |

### 상태 클래스

| 클래스 | 설명 |
|--------|------|
| `.active` | 활성 상태 (탭, 페이지) |
| `.selected` | 선택된 상태 (사용자 타입 카드) |
| `.checked` | 체크된 상태 (체크리스트, 라디오) |
| `.unchecked` | 체크되지 않은 상태 |
| `.error` | 에러 상태 (입력필드) |
| `.success` | 성공 상태 (입력필드) |
| `.disabled` | 비활성 상태 (버튼, 입력필드) |
| `.bookmarked` | 찜된 상태 (주황색 아이콘) |

### 컨테이너 클래스

| 클래스 | 용도 |
|--------|------|
| `.card` | 카드 컴포넌트 |
| `.button-group` | 버튼 그룹 (Flex) |
| `.form-group` | 폼 필드 그룹 |
| `.form-section` | 폼 섹션 |
| `.item-card` | 항목 카드 |
| `.item-list` | 항목 목록 (flex-column) |
| `.modal` | 모달 배경 |
| `.modal.active` | 활성 모달 |
| `.modal-content` | 모달 콘텐츠 |
| `.empty-state` | 빈 상태 표시 |

---

## 6. 이벤트 핸들링

### LoginSignUpPage 이벤트

| 이벤트 타입 | 트리거 | 처리 함수 |
|------------|--------|---------|
| click | 사용자 타입 카드 | `selectUserType(type, element)` |
| click | "다음 단계" 버튼 | `moveToStep(step)` |
| submit | 로그인 폼 | 로그인 검증 및 처리 |
| input | 비밀번호 입력 | `validatePassword(value)` |
| input | 비밀번호 확인 입력 | `validatePasswordMatch()` |
| keypress (Enter) | 기술 스택 입력 | `addSkill(event)` |

### SeekerMyPage 이벤트

| 이벤트 타입 | 트리거 | 처리 함수 |
|------------|--------|---------|
| click | "+ 자격증 추가" | `openCertificateModal()` |
| submit | 자격증 폼 | `saveCertificate(event)` |
| click | 자격증 "삭제" | `deleteCertificate(id)` |
| click | "+ 경력 추가" | `openExperienceModal()` |
| submit | 경력 폼 | `saveExperience(event)` |
| click | 경력 "삭제" | `deleteExperience(id)` |
| click | 스카웃 탭 | `switchScoutTab(tab, element)` |
| click | "수락" 버튼 | `acceptScout(id)` |
| click | "거절" 버튼 | `rejectScout(id)` |

### CompanyDetailPage 이벤트

| 이벤트 타입 | 트리거 | 처리 함수 |
|------------|--------|---------|
| click | 찜 버튼 | `toggleBookmark()` |
| click | "지원하기" 버튼 | `applyCompany()` |
| click | "지원 완료" 버튼 | `toggleApplied()` |
| DOMContentLoaded | 페이지 로드 | `init()` |

---

## 7. 로컬스토리지 데이터 구조

### userSignup 객체 (JSON)

```javascript
{
  "userType": "seeker" | "recruiter",
  "email": "user@example.com",
  "password": "P@ssw0rd",
  "education": "bachelor" | null,
  "gpa": "3.8" | null,
  "skills": ["React", "TypeScript", "Node.js"],
  "experience": "entry" | "internship" | "experienced" | null
}
```

### 로그인 상태 플래그

```javascript
isLoggedIn: "true" | "false"
userEmail: "user@example.com"
```

---

## 8. 반응형 레이아웃

### 미디어 쿼리 Breakpoint

| 화면 크기 | 클래스 | 레이아웃 |
|---------|--------|---------|
| 320-479px | mobile | 단일 컬럼, 패딩 16px, 버튼 높이 48px |
| 480-1023px | tablet | 2컬럼, 패딩 24px |
| 1024px+ | desktop | 3컬럼+, 패딩 40px, 최대너비 1280px |

### 반응형 처리

```css
/* 모바일 전용 */
@media (max-width: 479px) {
  .button-group { flex-direction: column; }
  .item-card { flex-direction: column; }
}

/* 데스크톱 전용 */
@media (min-width: 1024px) {
  .container { padding: var(--spacing-2xl); }
}
```

---

## 9. 더미 데이터 샘플

### 회사 데이터 (CompanyDetailPage)

```javascript
{
  id: 1,
  name: '테크스타트업 A',
  industry: 'IT/Software',
  location: '서울시 강남구 테헤란로 123',
  size: '50-100명',
  founded: '2020년 1월',
  workType: '하이브리드',
  benefits: ['국민/건강/고용 보험', '연차, 반차, 병가', '러닝클럽, 스터디 모임'],
  positions: [
    {
      id: 1,
      title: 'Senior Backend Engineer',
      requirements: '경력: 3년 이상 (필수)',
      skills: ['Python', 'Go', 'AWS'],
      location: '서울 강남',
      deadline: '2026-08-15',
      isUrgent: false
    }
  ]
}
```

### 사용자 데이터 (CompanyDetailPage, SeekerMyPage)

```javascript
// CompanyDetailPage userData
{
  gpa: 3.8,
  skills: ['React', 'TypeScript', 'Node.js'],
  experience: '2년',
  internship: true
}

// SeekerMyPage userData
{
  name: '김지은',
  email: 'ji.kim@example.com',
  education: '서울대학교 컴퓨터공학과 (2023년 졸업)',
  gpa: '3.8 / 4.5',
  certificates: [
    {
      id: 1,
      name: 'AWS Certified Solutions Architect',
      issued: '2024-03-15',
      expires: '2026-03-15',
      issuer: 'AWS'
    }
  ]
}
```

---

## 10. 접근성 (WCAG 2.1 AA)

### ARIA 속성 사용

| 속성 | 용도 |
|------|------|
| `role="alert"` | 에러 메시지 자동 읽음 |
| `aria-live="polite"` | 동적 콘텐츠 알림 |
| `aria-label` | 텍스트 없는 버튼에 라벨 |
| `aria-describedby` | 헬퍼 텍스트 연결 |

### 포커스 스타일

```css
outline: 2px solid var(--color-primary-blue);
outline-offset: 2px;
```

### 명도 대비

- 일반 텍스트: 최소 4.5:1
- 큰 텍스트: 최소 3:1
- 그래픽 요소: 최소 3:1

---

## 11. 주요 파일 위치

| 파일명 | 경로 | 설명 |
|--------|------|------|
| LoginSignUpPage.html | src/pages/ | 로그인/회원가입 페이지 |
| SeekerMyPage.html | src/pages/ | 구직자 마이페이지 |
| CompanyDetailPage.html | src/pages/ | 기업 상세정보 페이지 |

---

## 12. 번들 크기 및 성능

| 항목 | 크기 | 최적화 |
|------|------|--------|
| LoginSignUpPage.html | ~25KB | 인라인 CSS/JS |
| SeekerMyPage.html | ~30KB | 인라인 CSS/JS |
| CompanyDetailPage.html | ~25KB | 인라인 CSS/JS |
| 총 합계 | ~80KB | 압축 시 ~20KB |

---

**문서 최종 수정**: 2026-07-15  
**기술**: HTML5 + CSS3 + Vanilla JavaScript (React/TypeScript 미사용)  
**파일 수**: 3개 (HTML 페이지)  
**CSS 변수**: 21개 (색상 8개, 폰트 7개, 여백 6개)  
**JavaScript 함수**: 50+ 개 (페이지별 30+)  
**접근성 수준**: WCAG 2.1 AA  
**브라우저 호환성**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
