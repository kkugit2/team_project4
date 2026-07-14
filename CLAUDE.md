# 프로젝트 규칙

이 문서는 프로젝트의 전역 규칙과 서브에이전트 워크플로우를 관리하는 문서입니다.
이 문서는 "현재 시점의 최신 상태"만 담는 Living Document로 관리합니다.
과거에 무엇이 어떻게 바뀌어왔는지는 이 문서에 남기지 않으며, 그 이력은 git 커밋 히스토리가 담당합니다.
아래 "PRD 반영 사항", "UI/UX 가이드라인 반영 사항" 섹션은 개발자 서브에이전트가 관리하며,
PRD.md/UI-UX-Guideline.md가 갱신될 때마다 해당 섹션 전체를 최신 내용으로 덮어씁니다 (append 아님).

## 서브에이전트 워크플로우

새 기능 요청이 들어오면 아래 순서로 서브에이전트를 자동으로 이어서 실행합니다.
각 단계가 완료되면 사용자에게 다시 묻지 않고 다음 단계로 자동 진행합니다.
또한 각 서브에이전트는 명시되지 않은 확인 절차는 거치지 않고 그대로 작업을 진행합니다. 명시되지 않은 부분에 대해 전적인 승인을 내립니다.
(단, 각 서브에이전트 프롬프트에 명시된 개별 확인 절차는 그대로 따릅니다).

1. **prd-writer** 실행 → `PRD.md` 작성/갱신 (최신 상태로 덮어쓰기)
2. PRD.md 작성 완료 → **ui-ux-designer** 자동 실행 → `UI-UX-Guideline.md` 작성/갱신 (최신 상태로 덮어쓰기)
3. UI-UX-Guideline.md 작성 완료 → **developer** 자동 실행 →
   - PRD.md, UI-UX-Guideline.md의 최신 내용을 이 CLAUDE.md의 해당 섹션에 반영 (섹션 전체 갱신, append 아님)
   - 더미데이터 생성
   - 코드 작성
   - 변수명 정리
4. developer의 코드 작성이 완료되면 → **test-deploy-manager** 자동 실행 →
   - 개발자 서브에이전트가 작성한 코드를 테스트
   - 테스트 통과 후 **자동 Hook 검증** 발동 (배포 전 최종 검증):
     - 불필요한 컨벤션 위반 코드 확인
     - 민간 정보(API 키, 토큰, 개인정보) 노출 여부 확인
     - .gitignore 파일 설정 완성도 확인
     - 문제 발견 시 사용자에게 보고, 해결 대기
     - 검증 통과 또는 해결 후 다음 단계 진행
   - git diff로 이번 버전의 변경 내용 파악
   - README.md 갱신 (기능 목록, 설치 방법, 배포 정보, 수정된 부분 — 수정된 부분도 누적 아닌 이번 버전 요약만)
   - git commit / push

기존 기능을 수정/확장하는 요청인지, 완전히 새로운 기능 요청인지 판단이 애매한 경우
(아래 "기능 인덱스" 참고), 서브에이전트는 임의로 새 문서를 만들지 말고 사용자에게 먼저 확인합니다.

## 기능 인덱스

### MVP Sprint 1 - 3페이지 구현
- **로그인/회원가입 페이지**: 멀티스텝 폼 (사용자타입선택 → 기본정보 → 추가정보), 실시간 유효성 검증, Supabase Auth 연동
- **구직자 마이페이지**: 프로필 조회/수정 (학적, 학점), 자격증 관리 (추가/수정/삭제), 경력 관리 (추가/수정/삭제), 스카웃 탭 표시 (미래 확장성)
- **기업 상세정보 페이지**: 기업 소개, 합격확률 카드 (요구사항 충족률), 채용포지션 리스트, 지원/찜 액션, 기업정보 섹션

## PRD 반영 사항

### 핵심 기능 (3페이지 구현 범위)

#### 1. 로그인/회원가입 (섹션 3.1, 4.1)
- **로그인**: 이메일/비밀번호 인증, Supabase Auth 활용
- **회원가입 (멀티스텝)**:
  - Step 1: 사용자 타입 선택 (구직자 / 기업)
  - Step 2: 계정 정보 입력 (이메일, 비밀번호, 비밀번호 확인)
  - Step 3: 프로필 정보 입력 (선택사항)
    - 구직자: 학적, 학점, 기술스택, 경력 여부
    - 기업: (기존 폼이므로 이번 구현 제외)
- **데이터 저장**: Supabase `auth`, `JobSeekerProfile`, `Certification`, `Experience` 테이블

#### 2. 구직자 마이페이지 (섹션 3.1, 4.1)
- **프로필 카드**: 프로필 이미지, 이름, 이메일, 편집 버튼
- **기본 정보 카드 (뷰/편집 모드)**:
  - 학적 정보 (학교, 학과, 입학/졸업년도, 상태)
  - 학점 정보 (GPA 0.0~4.5)
- **자격증 관리**: 목록 조회, 추가, 수정, 삭제 (모달)
- **경력 관리**: 목록 조회, 추가, 수정, 삭제 (모달)
- **스카웃 탭 (UI 준비)**: 받은/거절한/수락한 스카웃 탭 표시 (더미 상태)
- **로그아웃/계정삭제**: 하단 액션

#### 3. 기업 상세정보 페이지 (섹션 3.1, 섹션 3-1-1)
- **기업 헤더**: 배경 이미지, 로고, 기업명, 산업, 위치, 규모
- **합격 확률 카드**:
  - 퍼센트 표시 (색상: 75%↑ 초록, 50-74% 주황, <50% 빨강)
  - 요구사항 체크리스트 (학점, 기술스택, 경험, 인턴십)
  - 설명: "요구사항 N개 중 M개 충족"
- **지원 액션**:
  - [지원하기] 버튼 (외부 링크, 새 창)
  - [지원 완료] 버튼 (토글, 상태 추적)
  - [찜하기] 버튼 (토글)
- **기업 소개**: 회사 설명 텍스트
- **채용 포지션**: 포지션 카드 리스트 (더미 데이터)
- **기업 정보**: 업계, 규모, 설립일, 근무형태, 복리후생

## UI/UX 가이드라인 반영 사항

### 디자인 철학
**"신뢰 가능한 경력 플랫폼: 명확하고 효율적인 정보 구조"**
- 명확성 우선: 화면을 스캔할 때 1~2초 내에 정보 계층 파악 가능
- 최소 인지 부하: 불필요한 장식 최소화, 기능적 요소만 강조
- 접근성 기반: WCAG 2.1 AA 수준 이상

### 컬러 팔레트
#### 주색상
- **Primary Blue** (#0052CC): CTA 버튼, 주요 액션, 링크, 활성 상태
- **Primary Green** (#2ECC40): 긍정적 상태 (승인, 성공, 높은 일치도 75%↑)
- **Primary Orange** (#FF8C00): 주목 필요 (경고, 제한된 시간, 마감 임박, 50-74% 일치도)

#### 보조색상
- **Light Gray** (#F5F7FA): 배경, 구분선, 비활성 상태
- **Medium Gray** (#8A92A6): 서브 텍스트, 비활성 요소, 헬퍼 텍스트
- **Dark Gray** (#2C3E50): 본문 텍스트, 제목, 강조 텍스트
- **White** (#FFFFFF): 기본 배경

#### 상태색상
- **Error Red** (#DC3545): 에러 메시지, 검증 실패, <50% 합격확률
- **Warning Yellow** (#FFC107): 경고, 확인 필요
- **Info Cyan** (#17A2B8): 정보 제공

### 타이포그래피
- **폰트 스택**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif
- **크기 및 웨이트**:
  - H1: 32px Bold (1.25 줄높이)
  - H2: 24px Bold (1.33 줄높이)
  - H3: 18px SemiBold (1.4 줄높이)
  - Body Large: 16px Regular (1.5 줄높이)
  - Body Regular: 14px Regular (1.5 줄높이)
  - Body Small: 12px Regular (1.4 줄높이)
  - Caption: 11px Medium (1.4 줄높이)
- **텍스트 색상 조합 (명도 대비)**:
  - Primary Text (Dark Gray #2C3E50): 명도 대비 15.36:1 (배경 White)
  - Secondary Text (Medium Gray #8A92A6): 명도 대비 8.59:1
  - Link (Primary Blue #0052CC): 명도 대비 8.59:1

### 레이아웃 및 여백
- **그리드 시스템**: 8px 기본 단위
- **여백 토큰**:
  - xs: 4px (인라인 요소 간 간격)
  - sm: 8px (버튼 내부 패딩, 요소 간 타이트한 간격)
  - md: 16px (카드 패딩, 섹션 내 간격)
  - lg: 24px (섹션 간 간격)
  - xl: 32px (주요 섹션 분리)
  - 2xl: 48px (페이지 상하 여백)
- **컨테이너 너비**:
  - 모바일 (320-479px): 100% - 32px 패딩
  - 태블릿 (480-1023px): 100% - 48px 패딩
  - 데스크톱 (1024px+): 최대 1280px 중앙 정렬

### 주요 컴포넌트 스펙

#### Primary Button
- 높이: 48px (모바일), 40px (데스크톱)
- 배경: Primary Blue (#0052CC)
- 텍스트: White, 14px SemiBold
- 패딩: 12px × 24px
- 코너: 8px
- Hover: 배경 #003DA8, translateY(-1px), 섀도우 0 4px 12px rgba(0,82,204,0.2)
- Focus: 2px solid Primary Blue 아웃라인, 2px offset
- Disabled: 배경 #C5CCD4, 텍스트 #8A92A6, cursor not-allowed

#### Secondary Button
- 배경: Light Gray (#F5F7FA)
- 텍스트: Primary Blue (#0052CC)
- 보더: 1px solid Medium Gray (#8A92A6)
- Hover: 배경 #E8ECEF, 보더 Primary Blue

#### Form Input
- 높이: 44px (모바일), 40px (데스크톱)
- 패딩: 12px × 16px
- 보더: 1px solid Medium Gray (#8A92A6)
- 코너: 8px
- Focus: 2px solid Primary Blue, 0 0 0 4px rgba(0,82,204,0.1) 섀도우
- Error: 2px solid #DC3545, 배경 #FEF5F5
- Success: 2px solid #2ECC40

#### Card
- 배경: White (#FFFFFF)
- 보더: 1px solid #E8ECEF
- 패딩: 16px
- 코너: 12px
- 기본 섀도우: 0 1px 3px rgba(0,0,0,0.08)
- Hover: 보더 Primary Blue, 섀도우 0 4px 12px rgba(0,82,204,0.12), translateY(-2px), 200ms ease-out

#### Badge/Tag
- 높이: 24px
- 패딩: 4px × 12px
- 폰트: Caption (11px, Medium)
- 코너: 6px
- 상태별 색상: Success (초록)/Warning (주황)/Error (빨강)/Info (파랑) 배경, White 텍스트

#### Modal
- 배경 오버레이: rgba(0,0,0,0.5)
- 컨테이너: White, 너비 모바일 90vw / 데스크톱 최대 600px
- 코너: 12px
- 섀도우: 0 20px 64px rgba(0,0,0,0.15)
- 진입: opacity 0→1, scale 0.95→1 (200ms ease-out)
- 퇴출: opacity 1→0, scale 1→0.95 (150ms ease-in)

### 애니메이션 스펙
- **버튼/입력필드**: 200ms ease-out (색상, 섀도우)
- **카드**: 200ms ease-out (보더, 섀도우, translateY)
- **모달**: 200ms ease-out (진입), 150ms ease-in (퇴출)
- **토스트**: 300ms ease-out (translateX + opacity)
- **찜 아이콘**: 300ms ease-in-out (하트 scale, fill)
- **로딩 스피너**: 1000ms linear (무한 회전)
- **스켈레톤**: 600ms ease-in-out (opacity 깜박임)

### 접근성 (WCAG 2.1 AA)
- **명도 대비**: 모든 텍스트 4.5:1 이상 (일반), 3:1 (큰 텍스트)
- **키보드 네비게이션**: Tab/Shift+Tab, Enter 활성화, Escape 닫기, 화살표 드롭다운 옵션 선택
- **포커스 표시**: 2px solid Primary Blue, 2px offset
- **ARIA**: aria-label, aria-live="polite", role="alert" 등 활용
- **폼 접근성**: 모든 입력필드에 `<label>` 또는 aria-label, 에러 메시지 aria-live 포함
- **터치 타겟**: 최소 44px × 44px
- **색상**: 색상만으로 정보 전달 금지 (텍스트/아이콘 병행)
- **링크**: 새 창 링크에 `rel="noopener noreferrer"`, aria-label="새 창에서 열기"
