# Team Project 1

## 프로젝트 소개
팀 협업 프로젝트입니다.

## 👥 팀원
- SangUk (feature/SangUk)
- JungMin (feature/JungMin)
- HyunJun (feature/HyunJun)

## 📋 브랜치 전략
- **main**: 최종 배포 브랜치
- **feature/SangUk**: SangUk의 개발 브랜치
- **feature/JungMin**: JungMin의 개발 브랜치
- **feature/HyunJun**: HyunJun의 개발 브랜치

## 📁 프로젝트 구조

### MVP Sprint 1 - 3페이지 구현
```
src/pages/
├── LoginSignUpPage.html      - 로그인/회원가입 (멀티스텝 폼)
├── SeekerMyPage.html         - 구직자 마이페이지
└── CompanyDetailPage.html    - 기업 상세정보
```

## 🚀 설치 및 실행

이 프로젝트는 순수 HTML, CSS, JavaScript로 구성된 정적 웹사이트입니다.

```bash
# 로컬에서 실행 (HTTP 서버 필요)
python3 -m http.server 8000
# 또는
npx http-server

# 브라우저에서 열기
http://localhost:8000/src/pages/LoginSignUpPage.html
```

### 필요 사항
- 모던 브라우저 (Chrome, Firefox, Safari, Edge)
- HTTP 서버 (로컬스토리지 및 CORS 문제 방지)

## 📝 기능 목록

### LoginSignUpPage.html (로그인/회원가입)
- [x] 로그인 폼 (이메일/비밀번호)
- [x] 회원가입 멀티스텝 폼
  - Step 1: 사용자 타입 선택 (구직자/기업)
  - Step 2: 계정정보 입력 (이메일, 비밀번호, 확인)
  - Step 3: 선택정보 입력 (학적, 학점, 기술스택, 경력)
- [x] 실시간 비밀번호 검증 (8자, 대소문자, 숫자, 특수문자)
- [x] 로컬스토리지 저장/로드

### SeekerMyPage.html (구직자 마이페이지)
- [x] 프로필 카드 (이름, 이메일)
- [x] 기본정보 카드 (학적, 학점)
- [x] 자격증 관리 (추가/수정/삭제)
- [x] 경력 관리 (추가/수정/삭제)
- [x] 스카웃 탭 (받은/거절한/수락한 - 더미 데이터)
- [x] 로그아웃/계정삭제 버튼

### CompanyDetailPage.html (기업 상세정보)
- [x] 기업 헤더 (배경, 로고, 이름, 산업, 위치, 규모)
- [x] 합격확률 카드 (동적 계산, 색상 인디케이터)
- [x] 요구사항 체크리스트 (학점, 기술스택, 경험, 인턴십)
- [x] 지원/찜 액션 (토글)
- [x] 채용포지션 리스트 (더미 데이터)
- [x] 기업정보 & 복리후생

## 🎨 디자인 시스템
- 색상: Primary Blue (#0052CC), Green (#2ECC40), Orange (#FF8C00)
- 타이포그래피: 시스템 폰트 스택 (-apple-system, Roboto 등)
- 반응형: 모바일(320px) / 태블릿(480px) / 데스크톱(1024px+)
- 접근성: WCAG 2.1 AA (포커스 표시, 명도 대비, 터치 타겟 44px+)

## 🔄 버전 이력

### v0.1.0 (2026-07-15) - MVP Sprint 1
**추가된 기능:**
- LoginSignUpPage.html: 로그인/회원가입 페이지 (멀티스텝, 실시간 검증)
- SeekerMyPage.html: 구직자 마이페이지 (프로필, 자격증, 경력, 스카웃)
- CompanyDetailPage.html: 기업 상세정보 (합격확률, 포지션, 지원)

**기술 스택:**
- HTML5, CSS3 (변수, 그리드, 플렉스박스)
- Vanilla JavaScript (로컬스토리지, DOM 조작)
- 반응형 디자인 (모바일-퍼스트)

## 👥 팀원
- SangUk (feature/SangUk)
- JungMin (feature/JungMin)
- HyunJun (feature/HyunJun)

## 📋 브랜치 전략
- **main**: 최종 배포 브랜치
- **feature/SangUk**: SangUk의 개발 브랜치
- **feature/JungMin**: JungMin의 개발 브랜치
- **feature/HyunJun**: HyunJun의 개발 브랜치

## 개발 워크플로우
각 팀원은 자신의 feature 브랜치에서 작업하고, 완료 후 main으로 Pull Request를 생성합니다.

```bash
# 본인의 브랜치로 이동
git checkout feature/YourName

# 작업 후 커밋
git add .
git commit -m "작업 내용"

# 원격 저장소에 푸시
git push origin feature/YourName
```
