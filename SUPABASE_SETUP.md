# Supabase 연동 가이드

## 현재 상태
- ✅ Supabase 프로젝트 생성됨
- ✅ 환경변수 설정됨 (.env.local)
- ✅ 클라이언트 초기화됨 (lib/supabase.ts)
- ✅ 코드 마이그레이션 진행 중 (async/await)
- ⏳ 테이블 생성 대기 중

## 필요한 작업

### 1단계: Supabase에서 테이블 생성

**방법 A: SQL Editor 사용 (추천)**
```
1. https://app.supabase.com 접속
2. 프로젝트 선택 (이름: "Immersive AI" 또는 fekeiqjxzfibyzxukisk)
3. 좌측 메뉴: SQL Editor
4. "New Query" 클릭
5. supabase/schema.sql의 전체 내용 복사해서 붙여넣기
6. "Run" 버튼 클릭
```

**방법 B: SQL 파일 생성**
```
1. Supabase 대시보시 → SQL Editor → "+ New SQL"
2. 파일명: "001_init_schema.sql"
3. supabase/schema.sql 내용 붙여넣기
4. Save and Run
```

### 2단계: RLS(Row Level Security) 확인

자동으로 생성되는 정책:
- ✅ jobseeker_profile: 본인만 조회/수정
- ✅ company_profile: 본인만 조회/수정
- ✅ applications, bookmarks: 본인만 관리
- ✅ self_intros: 본인 전체, 기업은 shared=true만
- ✅ scouts: 송신/수신자 본인만

### 3단계: 로컬 데이터 마이그레이션 (선택)

현재 localStorage의 데이터를 Supabase로 이전:
```bash
# 준비 중 (추후 제공)
npm run migrate:supabase
```

## 생성되는 테이블

| 테이블 | 용도 | RLS |
|--------|------|-----|
| `profiles` | 사용자 기본 정보 | ✅ |
| `jobseeker_profile` | 구직자 프로필 | ✅ |
| `company_profile` | 기업 프로필 | ✅ |
| `applications` | 지원 현황 | ✅ |
| `bookmarks` | 찜 목록 | ✅ |
| `self_intros` | 자소서 | ✅ |
| `feedback_results` | 피드백 | ✅ |
| `scouts` | 스카웃 | ✅ |
| `viewed_candidates` | 열람 로그 | ✅ |
| `job_cache` | 공고 캐시 | ❌ |
| `tag_cache` | 태그 캐시 | ❌ |

## 코드 변경사항

### 변경 전 (localStorage)
```typescript
const apps = getTable<Application>(TABLE_KEYS.APPLICATIONS);
const filtered = apps.filter(a => a.userId === userId);
```

### 변경 후 (Supabase)
```typescript
const apps = await getTable<Application>(TABLE_KEYS.APPLICATIONS);
const filtered = apps.filter(a => a.userId === userId);
```

## 트러블슈팅

### "테이블이 없습니다" 에러
→ SQL을 실행하지 않았음. 위 "필요한 작업" → "1단계" 참고

### "인증 실패" 에러
→ .env.local의 SUPABASE_* 환경변수 확인

### "RLS 정책 위반" 에러
→ 정상 동작. RLS가 권한 없는 접근을 차단한 것.
→ 로그인 상태와 role 확인

## 아키텍처

```
App Layer (React Components)
    ↓ (호출)
lib/auth.ts, lib/profiles.ts, ... (비즈니스 로직)
    ↓ (호출)
lib/localDb.ts (데이터 접근 계층 - 이제 Supabase 지원)
    ↓
Supabase Client (lib/supabase.ts)
    ↓
Supabase Postgres DB
```

## 마이그레이션 타임라인

- ✅ **Phase 1**: Supabase 클라이언트 초기화
- ✅ **Phase 2**: 로컬DB 비즈니스 로직을 async로 변경
- ⏳ **Phase 3**: SQL 스키마 생성 (수동, Supabase 대시보드)
- ⏳ **Phase 4**: 로컬 데이터 마이그레이션 (선택)
- ⏳ **Phase 5**: 실제 배포 테스트

## 다음 단계

1. Supabase 대시보드에서 SQL 실행
2. `npm run build` 확인 (빌드 성공)
3. `npm run dev` 로컬 테스트
4. 프로필 생성/수정 테스트
5. Supabase 대시보드에서 데이터 확인

## 환경변수 확인

`.env.local`에 다음이 있어야 함:
```
NEXT_PUBLIC_SUPABASE_URL=https://fekeiqjxzfibyzxukisk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

모두 있으면 준비 완료!

---

**문제 발생 시:**
- Supabase 문서: https://supabase.com/docs
- SQL 에러: Supabase 대시보드 → SQL Editor에서 에러 메시지 확인
- 권한 에러: RLS 정책 설정 확인
