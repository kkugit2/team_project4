# SQL 실행 방법 (터미널에서 보기 위함)

## 🎯 핵심: 이것만 하세요

### 1️⃣ Supabase 대시보드 접속
```
https://app.supabase.com
```

### 2️⃣ 프로젝트 선택
- 프로젝트: `Immersive AI`

### 3️⃣ SQL Editor → + New Query

### 4️⃣ 파일 복사
```
supabase/schema_clean.sql 의 모든 내용 복사
```

### 5️⃣ 붙여넣기 후 Run

---

## 📊 결과 확인

Database → Tables 에서 11개 테이블 확인:
1. profiles
2. jobseeker_profile
3. company_profile
4. applications
5. bookmarks
6. self_intros
7. feedback_results
8. scouts
9. job_cache
10. tag_cache
11. viewed_candidates

---

## ✅ 완료!

그 다음:
```bash
npm run dev
```

http://localhost:3000 에서 테스트하세요.
