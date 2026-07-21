# 🚀 Supabase 최종 설정 가이드

## 현재 상태
✅ **완료됨:**
- Supabase 프로젝트 생성
- 환경변수 설정 (.env.local)
- 클라이언트 초기화 (lib/supabase.ts)
- 모든 비즈니스 로직을 async/await로 변경
- @supabase/supabase-js 설치
- 빌드 테스트 성공

⏳ **남은 작업:**
- SQL 스키마를 Supabase 대시보드에서 실행 (수동)
- 로컬 서버에서 Supabase 연동 테스트

---

## 🎯 다음 단계: SQL 스키마 실행

### 방법 1️⃣ : Supabase 대시보드에서 직접 실행 (가장 간단, 추천)

**1단계: Supabase 대시보드 접속**
```
https://app.supabase.com
```

**2단계: 프로젝트 선택**
- 프로젝트 이름: `Immersive AI`
- 또는 ID: `fekeiqjxzfibyzxukisk`

**3단계: SQL Editor로 이동**
- 좌측 메뉴 → `SQL Editor`

**4단계: 새 쿼리 생성**
- `+ New Query` 버튼 클릭

**5단계: SQL 입력**
- 다음 파일의 모든 내용을 복사:
  ```
  supabase/schema.sql
  ```
- 복사한 내용을 SQL Editor에 붙여넣기

**6단계: 실행**
- `Run` 버튼 클릭 (우측 상단, 또는 Ctrl+Enter)

**7단계: 결과 확인**
- ✅ 성공 메시지 나타남
- 에러가 있으면 아래 "트러블슈팅" 참고

---

## 🔍 실행 후 확인 사항

### 테이블 생성 확인
```
Supabase 대시보드 → Database → Tables
```

다음 11개 테이블이 생성되어야 함:
- ✅ profiles (사용자 기본)
- ✅ jobseeker_profile (구직자 정보)
- ✅ company_profile (기업 정보)
- ✅ applications (지원 현황)
- ✅ bookmarks (찜 목록)
- ✅ self_intros (자소서)
- ✅ feedback_results (피드백)
- ✅ scouts (스카웃)
- ✅ viewed_candidates (열람 로그)
- ✅ job_cache (공고 캐시)
- ✅ tag_cache (태그 캐시)

### RLS 정책 확인
```
Supabase 대시보시 → Database → Tables → [테이블] → RLS
```

각 테이블마다 "RLS enabled" ✅로 표시되어야 함

---

## 🏃 로컬 서버 시작 (Supabase 테스트)

### 1단계: 개발 서버 시작
```bash
npm run dev
```

### 2단계: 브라우저에서 열기
```
http://localhost:3000
```

### 3단계: 기능 테스트

**구직자 가입 테스트:**
1. 우측 상단 → "로그인"
2. "회원가입" 클릭
3. "구직자로 시작하기" 선택
4. 이메일/비밀번호 입력 (예: `test@example.com` / `password123`)
5. 학력/경력 정보 입력
6. "가입 완료" 클릭

**기업 가입 테스트:**
1. "로그인" → "회원가입"
2. "기업으로 시작하기" 선택
3. 회사명, 인재상 정보 입력
4. "가입 완료" 클릭

**Supabase 데이터베이스에서 확인:**
```
Supabase 대시보드 → SQL Editor

SELECT * FROM profiles;
SELECT * FROM jobseeker_profile;
SELECT * FROM company_profile;
```

위 쿼리들이 데이터를 반환하면 정상 연동! ✅

---

## 📊 아키텍처 다이어그램

```
┌─────────────────────────────────────┐
│   React 컴포넌트 (app/ 디렉토리)      │
│   - 페이지, 폼, 리스트, 카드 등      │
└──────────────┬──────────────────────┘
               │ (호출)
┌──────────────▼──────────────────────┐
│   비즈니스 로직 (lib/ 디렉토리)       │
│   - auth.ts, profiles.ts, scouts.ts │
│   - applications.ts, bookmarks.ts    │
│   - selfIntro.ts 등                 │
└──────────────┬──────────────────────┘
               │ (모두 async)
┌──────────────▼──────────────────────┐
│   데이터 접근 계층                    │
│   lib/localDb.ts                    │
│   - Supabase & localStorage 하이브리드│
└──────────────┬──────────────────────┘
               │
       ┌───────┴──────────┐
       │                  │
   ┌───▼────┐        ┌────▼──────┐
   │localStorage│      │Supabase   │
   │(Auth, Config)    │(Data)     │
   └────────┘        └───────────┘
```

---

## ⚠️ 트러블슈팅

### "테이블이 없습니다" 에러
```
Error: relation "profiles" does not exist
```
**해결:**
- SQL을 아직 실행하지 않았음
- 위 "SQL 스키마 실행" 단계 다시 확인
- Supabase 대시보드 → SQL Editor → Run 버튼 클릭

### "인증 실패" 에러
```
Error: Auth session not found
```
**해결:**
- `.env.local`의 SUPABASE_* 환경변수 확인:
  ```bash
  echo $NEXT_PUBLIC_SUPABASE_URL
  echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
  ```
- 환경변수가 비어있으면 SUPABASE_SETUP.md 참고

### "RLS 정책 위반" 에러
```
Error: new row violates row-level security policy
```
**해결:**
- 정상 동작임. RLS가 권한 없는 접근을 차단한 것
- 로그인 상태 확인
- 사용자 역할(jobseeker/company) 확인
- Supabase 대시보드 → Database → [테이블] → RLS 탭에서 정책 확인

### "Anon key 관련" 에러
```
Error: You are only allowed anon access...
```
**해결:**
- RLS 정책에서 로그인 전 접근 권한이 필요한 경우
- Supabase 대시보드 → SQL Editor에서 다시 Run해서 정책 재적용

---

## 🎉 완료 후 다음 단계

### 선택사항: 프로덕션 배포 준비
1. `npm run build` 성공 확인
2. `npm run lint` 성공 확인
3. 모든 페이지/기능 브라우저에서 수동 테스트
4. Vercel 배포 준비 (프로젝트의 다음 단계)

### 데이터 마이그레이션 (선택)
로컬 localStorage의 데이터를 Supabase로 옮기려면:
```bash
# 추후 지원 (현재: 새 사용자부터 Supabase에 저장)
npm run migrate:supabase
```

---

## 📚 참고 문서

| 문서 | 용도 |
|------|------|
| CLAUDE.md | 프로젝트 기술 스택 및 구조 |
| PRD_all.md | 서비스 기획 및 화면 명세 |
| Backend-Guideline.md | 백엔드 API 및 DB 스키마 |
| UI-UX-Guideline_all.md | 프론트엔드 디자인 시스템 |
| SUPABASE_SETUP.md | 초기 환경변수 설정 (이미 완료) |

---

## 🆘 문제가 해결되지 않으면?

1. **Supabase 공식 문서**
   ```
   https://supabase.com/docs
   ```

2. **SQL 에러 디버깅**
   - Supabase 대시보드 → SQL Editor → 실행 후 에러 메시지 복사
   - supabase/schema.sql에서 해당 줄 확인

3. **RLS 정책 확인**
   - Supabase 대시보드 → Database → [테이블] → RLS
   - 각 정책의 SQL 스크립트 읽기

---

## ✅ 최종 체크리스트

- [ ] Supabase 프로젝트에 접속 가능
- [ ] SQL Editor에서 supabase/schema.sql 전체 복사
- [ ] SQL Run 버튼 클릭 후 성공 메시지 확인
- [ ] Database → Tables에서 11개 테이블 확인
- [ ] 각 테이블의 RLS가 enabled ✅
- [ ] `npm run dev` 시작
- [ ] 구직자/기업 가입 테스트 완료
- [ ] Supabase 대시보드에서 프로필 데이터 저장 확인

---

**모든 항목이 완료되면 Supabase 연동 완료! 🎊**

이제 실제 데이터베이스와 연동된 풀스택 애플리케이션이 준비되었습니다.
