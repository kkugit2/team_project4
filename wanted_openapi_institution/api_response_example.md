# Wanted API - 텍스트 기반 서류합격예측 API 예시

## API 정보

**엔드포인트:** `POST /v1/ai/pass/text-prediction/async`  
**설명:** [유료] 텍스트 서류합격예측 실행(비동기)  
**문의:** team-ml@wantedlab.com

---

## 요청 (Request)

### 엔드포인트
```
POST https://api.wanted.co.kr/v1/ai/pass/text-prediction/async
```

### 헤더
```http
Content-Type: application/json
wanted-client-id: {your-client-id}
wanted-client-secret: {your-client-secret}
```

### 요청 본문 (Request Body)
```json
{
  "data": [
    {
      "position_id": 24601,
      "resume_text": "5년 경력의 백엔드 개발자입니다. Python과 Java를 사용하며, AWS 인프라 관리 경험이 있습니다.",
      "position_description": "포지션명: 서버 개발자\n주요 업무: 백엔드 API 개발\n자격요건: 3년 이상 서버 개발 경력"
    }
  ],
  "callback_url": "https://your-server.com/callback",
  "request_id": "req-12345"
}
```

### 요청 파라미터 설명

| 필드 | 타입 | 필수 | 설명 |
|-----|------|------|------|
| `data` | Array | O | 예측 요청 데이터 리스트 (최대 50개) |
| `data[].position_id` | Integer | O | 포지션 ID |
| `data[].resume_text` | String | O | 이력서 텍스트 |
| `data[].position_description` | String | O | 포지션 설명 |
| `callback_url` | String | O | 결과 수신 콜백 URL |
| `request_id` | String | X | 요청 식별자 (UUID 자동 생성) |

---

## 응답 (Response)

### 성공 응답 (200 OK)
```json
{
  "request_id": "55e41f9f-a5a6-4836-8490-68914ff51b64"
}
```

### 응답 설명
- **request_id**: 콜백에서 어떤 요청의 결과인지 구분하기 위한 ID
- **처리 방식**: 비동기 처리 (API 호출 즉시 반환)
- **결과 전달**: `callback_url`로 결과 전달

---

## 콜백 (Callback) 응답 예시

### 콜백 요청 구조
서버가 `callback_url`로 POST 요청을 보냄:

```json
{
  "request_id": "55e41f9f-a5a6-4836-8490-68914ff51b64",
  "predictions": [
    {
      "position_id": 24601,
      "prediction_score": 0.85,
      "prediction_label": "합격예상",
      "confidence": 0.92,
      "details": {
        "skills_match": 0.88,
        "experience_match": 0.82,
        "education_match": 0.75
      }
    }
  ],
  "status": "completed",
  "timestamp": "2024-07-14T10:30:45Z"
}
```

### 응답 필드 설명

| 필드 | 타입 | 설명 |
|-----|------|------|
| `request_id` | String | 원래 요청의 ID |
| `predictions` | Array | 예측 결과 배열 |
| `predictions[].position_id` | Integer | 포지션 ID |
| `predictions[].prediction_score` | Float | 예측 점수 (0~1) |
| `predictions[].prediction_label` | String | 예측 레이블 ("합격예상", "탈락예상", "보류") |
| `predictions[].confidence` | Float | 신뢰도 (0~1) |
| `predictions[].details.skills_match` | Float | 스킬 매칭 점수 |
| `predictions[].details.experience_match` | Float | 경력 매칭 점수 |
| `predictions[].details.education_match` | Float | 학력 매칭 점수 |
| `status` | String | 처리 상태 ("completed", "failed") |
| `timestamp` | String | 처리 완료 시간 (ISO 8601) |

---

## 에러 응답 (Error Response)

### 401 - 인증 실패
```json
{
  "error_code": "Unauthorized",
  "message": "비인증 사용자"
}
```

### 422 - 요청 데이터 누락
```json
{
  "error_code": "ValidationError",
  "message": "필수 요청 데이터 누락",
  "data": {
    "detail": "data: 필드는 필수입니다"
  }
}
```

### 403 - 접근 권한 없음
```json
{
  "error_code": "Forbidden",
  "message": "해당 API를 사용할 수 있는 계약이 필요합니다",
  "data": {
    "contact": "team-ml@wantedlab.com"
  }
}
```

---

## 사용 예시 (Python)

```python
import requests
import json

# 인증 정보
client_id = "x7eN3AyKUtFUcR2WIUFbWYfS"
client_secret = "eyWwO6XiEQml5BHYY2KLr7arU37GBbuR6tmzSUb1woeifrt3"

# 헤더 설정
headers = {
    'wanted-client-id': client_id,
    'wanted-client-secret': client_secret,
    'Content-Type': 'application/json'
}

# 요청 데이터
payload = {
    "data": [
        {
            "position_id": 24601,
            "resume_text": "5년 경력 백엔드 개발자입니다. Python, Java 숙련",
            "position_description": "서버 개발자 - 3년 이상 경력"
        }
    ],
    "callback_url": "https://your-domain.com/api/callback",
    "request_id": "req-001"
}

# API 호출
response = requests.post(
    "https://api.wanted.co.kr/v1/ai/pass/text-prediction/async",
    json=payload,
    headers=headers,
    timeout=10
)

# 응답 처리
if response.status_code == 200:
    result = response.json()
    print(f"Request ID: {result['request_id']}")
    print("비동기 처리 중... 결과는 callback_url로 전달됩니다.")
else:
    print(f"에러: {response.status_code}")
    print(response.text)
```

---

## 주의사항

⚠️ **유료 API**
- 본 API는 별도의 계약 후에만 사용 가능합니다.
- 사용 문의: team-ml@wantedlab.com

⚠️ **비동기 처리**
- API 호출 후 즉시 `request_id`만 반환됩니다.
- 실제 예측 결과는 별도로 `callback_url`을 통해 전달됩니다.
- 콜백 수신 준비가 필요합니다.

⚠️ **데이터 제한**
- 한 번의 호출로 최대 50개의 데이터만 처리 가능합니다.

⚠️ **Callback URL**
- 공개 인터넷에서 접근 가능한 URL이어야 합니다.
- HTTPS 권장 (보안상)
- 유효한 HTTP 응답 상태 코드 반환 필요 (200-299)

---

## 관련 API

### 비슷한 API: 지원예측 (Apply Prediction)
```
POST /v1/ai/apply/text-prediction/async
```
- 이력서와 포지션 설명으로 **지원 적합도** 예측
- 요청/응답 구조는 동일

---

## 현재 상태

❌ **실제 API 호출 테스트: 실패**
- 원인: 실제 API 엔드포인트 정보 필요
- 가능한 이유:
  1. 현재 계약이 활성화되어 있지 않음
  2. 다른 베이스 URL 사용 중
  3. 추가 인증 정보 필요

✓ **해결 방법:**
- Wanted 담당자에게 연락: team-ml@wantedlab.com
- API 문서의 정확한 엔드포인트 확인
- 계약 상태 확인
