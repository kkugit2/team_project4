# CLAUDE.md

바이브 코딩으로 이 저장소를 작업할 때는 이 문서를 먼저 따르고, 화면 작업은 `@UI-UX-Guideline.md`, 데이터/API 작업은 `@Backend-Guideline.md`를 반드시 함께 참고한다.

## [기술 스택]
- Next.js 16 (App Router) + React 19 + TypeScript (`strict: true`)
- 스타일: CSS Modules(`*.module.css`) + `app/globals.css`의 디자인 토큰. Tailwind 미사용.
- 상태/영속성: 현재는 백엔드 미연동 단계 — `lib/localDb.ts`를 통한 `localStorage` 목업. Supabase/원티드/Claude 키가 준비되면 각 `lib/*` 모듈의 **내부 구현만** 교체한다 (호출부/컴포넌트는 변경하지 않는다).
- 배포 대상: Vercel (예정, 아직 미설정)

## [MCP]
- Supabase: 백엔드 (Postgres + Auth) — 아직 프로젝트 미생성, 연동 전
- Vercel: 프론트엔드 배포 — 아직 미설정

## [API]
- 원티드 Open API: 회사(Company) · 포지션(Job) · 검색(Search) · 태그(Tag) 4개 카테고리만 사용 (AI 예측/통계/recruit-company API 사용 안 함 — Backend-Guideline 2장)
- Claude API: 자소서 피드백 생성 (`lib/mockLlm.ts`가 실 연동 시 교체될 지점)

## [준수 사항]
1. 화면/스타일 작업 전 `UI-UX-Guideline.md`를, 데이터 모델/매칭 로직/스카웃 규칙 작업 전 `Backend-Guideline.md`를 확인한다.
2. `lib/*` 모듈의 함수 시그니처는 Backend-Guideline 4장 API 라우트 표와 1:1 대응한다 — 실 백엔드 연동 시 시그니처를 바꾸지 않고 내부만 교체한다.
3. 매칭 스코어(`lib/matchScore.ts`)와 스카웃 한도/만료(`lib/scouts.ts`)는 순수 함수로 유지한다 (I/O 금지) — 나중에 서버 라우트로 그대로 옮길 수 있어야 한다.
4. `shared_with_company` 동의 필터는 `lib/selfIntro.ts`의 `listCandidatesForCompany` 한 곳에서만 적용한다. 다른 화면에서 임의로 재필터링하지 않는다.
5. 코드 작성 후에는 반드시 `npm run build`(타입 에러 확인) → `npm run lint` → 실제 화면 수동 동작 확인 순으로 테스트하고, 문제 발생 시 보고 후 다음 단계로 넘어간다.

## [디렉토리 구조]
```
app/                    Next.js 라우트 (App Router)
  page.tsx              4-1 구직자 랜딩
  (auth)/login, signup/  4-3·4-4 로그인/가입
  job/[id]/              4-7 공고 상세
  mypage/                4-5 구직자 마이페이지
  self-intro/            4-8 자소서 피드백
  company/, company/mypage/   4-2·4-6 기업 화면
  api/wanted/*, api/tags/*     원티드 프록시 경계 (지금은 mock 반환)
components/             common / nav / job / profile / applications / bookmarks / scout / candidate / selfIntro
lib/                     인증, 프로필, 매칭 스코어, 스카웃, 자소서/피드백, 원티드 클라이언트 등 (localStorage 기반 목업)
data/                    mock 시드 데이터 (jobs, companies, tags, candidates, scouts)
types/                   공유 TypeScript 타입 (Backend-Guideline 3장 스키마와 대응)
```

## [프론트엔드 지침]
@UI-UX-Guideline.md

## [백엔드 지침]
@Backend-Guideline.md
