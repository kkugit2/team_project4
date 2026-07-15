# 데이터 설명 (원티드 OpenAPI 기반 채용 데이터)

이 문서는 `/data` 폴더의 CSV 5개가 어떤 데이터인지, 서로 어떻게 연결되는지, 그리고 이 데이터로 **할 수 있는 것과 할 수 없는 것**을 정리한 것입니다. 코드를 작성하기 전에 반드시 이 문서를 먼저 읽어주세요.

## 0. 데이터 출처와 가장 중요한 전제

- 이 CSV들은 **원티드(Wanted) OpenAPI**(`openapi.json`, `openapi (1).json` — V1/V2 스펙)를 통해 조회한 결과를 덤프한 것입니다.

## 1. 전체 관계도

```
categories.csv (직군/직무 마스터, 418행)
        │  parent_id/child_id 로 매핑
        ▼
companies.csv (기업 마스터, 2,442행) ──company.id 로 조인──┐
        │                                                    │
        │                                                    ▼
        │                                    jobs.csv (공고 요약, 10,000행)
        │                                                    │  id 로 1:1 조인 (동일 10,000건)
        │                                                    ▼
        │                                    job_details.csv (공고 상세, 10,000행)
        │
        └── attractions.csv (기업 매력태그 마스터, 87행) — job_details.csv의 company.company_tags 와 연관
```

- `jobs.csv.id` ↔ `job_details.csv.id` : **1:1 관계**, 동일 포지션의 요약본/상세본
- `jobs.csv["company.id"]` / `job_details.csv["company.id"]` ↔ `companies.csv["company.id"]` : **N:1 관계**
- `categories.csv.parent_id` ↔ `jobs.csv/job_details.csv`의 `category_tags.parent_tag.id`
- `categories.csv.child_id` ↔ `category_tags.child_tags` 안의 각 항목 id (JSON 배열 문자열이므로 파싱 필요)
- `attractions.csv.id/title` ↔ 정확한 조인 컬럼은 없으나, `job_details.csv["company.company_tags"]`(텍스트 태그: "50명이하", "퇴사율5%이하" 등)와 같은 계열의 마스터 데이터로 추정됨. 매칭은 title 문자열 유사도로 확인 필요.

## 2. 파일별 상세

### 2.1 `jobs.csv` — 채용공고 목록(요약)
- **10,000행**, 고유 `company.id` 2,439개
- 용도: 채용공고 리스트/검색/필터 화면의 메인 소스
- 주요 컬럼:
  - `id`, `status`(전부 "active"), `due_time`(86.6% 결측 → 상시채용이 대부분), `name`(포지션명)
  - `company.id`, `company.name`
  - `reward.total/recommender/recommendee` (채용보상금, 원문 포맷 문자열 "￦1,000,000" 형태)
  - `address.country/location/full_location`
  - `title_img.origin/thumb`, `logo_img.origin/thumb` (이미지 URL)
  - `category_tags.parent_tag.id/title` (직군, 단일값)
  - `category_tags.child_tags` (직무, **JSON 배열 문자열** — `json.loads` 또는 `ast.literal_eval` 필요)
  - `employment_type` (regular/contract/intern, 정규직이 92%로 압도적)
  - `additional_apply_type` (외국인/병역특례/장애인우대, JSON 배열 문자열, 대부분 결측)
  - `url` (원티드 실제 공고 페이지 링크)
  - ⚠️ `category_tags.parent_tag` 컬럼은 맨 끝에 중복으로 존재, 전부 빈 값 → **무시하고 사용하지 말 것**

### 2.2 `job_details.csv` — 채용공고 상세
- **10,000행**, `jobs.csv`와 `id` 기준 1:1 매핑 (동일 공고의 상세 버전)
- 용도: 공고 상세페이지, 그리고 **AI 예측 API의 `jd` 입력값 생성**에 사용
- 핵심 텍스트 컬럼 (예측 API의 jd로 합쳐서 쓸 것):
  - `detail.intro` (회사/팀 소개)
  - `detail.main_tasks` (주요업무)
  - `detail.requirements` (자격요건)
  - `detail.preferred_points` (우대사항)
  - `detail.benefits` (복지)
  - `detail.hire_rounds` (전형 단계, 예: "서류 전형 ＞ 임원 면접 ＞ 최종 합격")
- 기타 컬럼:
  - `annual_from`/`annual_to` (요구 경력 연차 범위, 숫자)
  - `skill_tags` (요구 스킬 태그, JSON 배열 문자열, 결측 많음)
  - `company.company_tags` (기업 특성 태그: "교육","보상","50명이하","설립4~9년","퇴사율5%이하" 등)
  - `address.geo_location.location.lat/lng` (위경도, 지도 시각화용)
- ⚠️ 아래 컬럼들은 **100% 결측이거나 하위 항목으로 이미 flatten되어 남은 빈 껍데기 컬럼**이므로 무시:
  `category_tags`, `address.geo_location`, `address.geo_location.bounds`

### 2.3 `companies.csv` — 기업 마스터
- **2,442행**, `jobs.csv`/`job_details.csv`의 `company.id`와 완전 매칭
- `company.company_confirm` 전체 True (인증된 기업만 수집됨)
- `company.description`, `company.link`(자체 홈페이지), `company.url`(원티드 내 페이지)
- ⚠️ `company.geo_location`, `company.address`는 100% 결측 (job_details.csv 쪽 address 정보를 대신 사용할 것)

### 2.4 `categories.csv` — 직군/직무 마스터
- **418행**, 직군(`parent`) 20개 / 직무(`child`) 418개
- 순수 lookup 테이블. ID → 한글명 매핑 및 대시보드 필터 드롭다운 구성에 사용
- 직군 20개: 개발, 마케팅·광고, 경영·비즈니스, 영업, 고객서비스·리테일, 디자인, 제조·생산, 엔지니어링·설계, HR, 미디어, 정보보호, 금융, 물류·무역, 법률·법집행기관, 식·음료, 의료·제약·바이오, 교육, 게임 제작, 건설·시설, 공공·복지

### 2.5 `attractions.csv` — 기업 매력태그 마스터
- **87행**, `id`/`title`만 존재 (예: "재택근무", "유연근무", "AI 선도 기업", "장애인전형" 등)
- 원티드 V2 API의 `attraction_tags` 필터에 대응하는 마스터 데이터로 추정
- 순수 lookup 테이블, 필터 UI 구성용

## 3. 데이터 파싱 시 주의사항

1. **JSON 배열 문자열 컬럼**: `category_tags.child_tags`, `additional_apply_type`, `skill_tags`, `company.company_tags`, `images` 등은 CSV 안에 JSON 배열이 **문자열 형태**로 들어있음. `pandas` 로드 후 `json.loads()` 또는 `ast.literal_eval()`로 파싱 필요 (작은따옴표/큰따옴표 혼용 여부 확인할 것).
2. **결측치가 100%인 컬럼은 스키마 flatten 과정에서 생긴 잔여 컬럼**이므로 드롭하고 시작할 것 (위 각 섹션의 ⚠️ 표시 참고).
3. **`due_time` 결측 = "상시채용"**으로 해석할 것 (에러/누락이 아님).
4. `id` 컬럼명이 파일마다 겹치므로(`jobs.csv.id`, `job_details.csv.id`, `categories.csv.child_id` 등), 조인 시 컬럼명 충돌에 주의.

## 4. 이 데이터로 가능한 것 / 불가능한 것

**가능 (현재 데이터만으로):**
- 채용공고 탐색/검색/필터 대시보드 (직군·직무·지역·연차·고용형태·매력태그 기준)
- 기업별 채용 현황, 인기 공고, 채용보상금 비교
- 지도 기반 공고 시각화 (위경도 존재)
- `main_tasks`+`requirements` 텍스트를 활용한 키워드 분석, 직무별 요구 스킬 트렌드 분석

**불가능 (데이터 자체가 없음, API 연동 필요):**
- 실제 서류합격률/지원경쟁률 예측 → 원티드 AI 예측 API가 실시간으로 호출 가능해져야 함
- 과거 합격자/불합격자 통계 기반 인사이트 → 애초에 그런 라벨 데이터가 존재하지 않음
