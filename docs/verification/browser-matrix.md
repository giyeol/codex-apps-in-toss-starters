# 브라우저·QR QA 영수증

로컬 check/build PASS는 브라우저, QR, 기기, 콘솔, live API 또는 공개 완료를 뜻하지 않아요. 실제 관찰 전 모든 행은 `PENDING`이며, complete와 Mock API·광고는 수강생 공통 완료가 아닌 선택 확장이에요.

## 완성 화면 대표 캡처 (2026-08-21)

아래 PASS는 Orca 내장 Chromium으로 로컬 complete 예시를 조작·점검하고, 같은 대표 상태를 `pnpm capture:examples`로 `390×844 @2x` 캡처한 결과만 뜻해요. 전체 입력 분기, 새로고침 복원, QR, 실기기, 콘솔, live Mock API와 광고 동작은 아래 강사 사전 QA 표에서 별도로 확인해요.

| 예시 | origin | 실제로 관찰한 대표 상태 | evidence | status |
| --- | --- | --- | --- | --- |
| complete 01 | `http://127.0.0.1:4171/` | 독립서점 활동 저장 1개, 저장 수와 카드 상태 반영 | `docs/assets/result-examples/01-weekend-activities.png` | PASS |
| complete 02 | `http://127.0.0.1:4172/` | 3일 완료 기록, 연속 달성 3일, 축하 문구 | `docs/assets/result-examples/02-habit-challenge.png` | PASS |
| complete 03 | `http://127.0.0.1:4173/` | 꼼꼼한 플래너 결과, 키워드·여행 팁·후속 액션 표시 | `docs/assets/result-examples/03-travel-style-test.png` | PASS |
| complete 04 | `http://127.0.0.1:4174/` | 기본 조건의 예비 추천 3개와 예상 가격 표시 | `docs/assets/result-examples/04-gift-finder.png` | PASS |

## 강사 사전 QA (실제 결과는 PENDING)

브라우저 초기화는 브라우저 전용이에요. 01은 개발자 도구에서 `localStorage.removeItem("course.weekend.saved.v1")` 후 `location.reload()`하고, 02는 `localStorage.removeItem("course.habit.v1")` 후 `location.reload()`해요. QR 첫 실행은 학생별 `appName`의 현재 저장 상태를 사용하며, 재업로드 뒤에는 기존 상태가 유지되는지 별도로 기록해요.

| 흐름 | 절차와 기대 결과 | actual/evidence | status |
| --- | --- | --- | --- |
| starter 01 | 카테고리를 고르고 작은 전시를 저장한 뒤 새로고침해 저장 1개가 복원돼요. | PENDING / — | PENDING |
| complete 01 | starter 01 흐름 뒤 무료 항목이 자동으로 가장 먼저 표시되는 우선순위를 확인해요. | PENDING / — | PENDING |
| starter 02 | 습관명과 메모를 입력하고 오늘 완료 후 새로고침해 기록과 연속일을 확인해요. | PENDING / — | PENDING |
| complete 02 | 위 흐름에서 3일 연속 완료 예시를 만들어 축하 문구가 표시되는지 확인해요. | PENDING / — | PENDING |
| starter 03 | 입력 패턴 3개로 각각 세 결과 대역에 도달하는지 확인해요. | PENDING / — | PENDING |
| complete 03 | 세 결과 대역을 확인하고 clipboard는 현재 환경에서 관찰한 성공 또는 차단 분기 하나를 기록하며, 반대 분기는 선택 검증으로 남겨요. | PENDING / — | PENDING |
| starter 04 | `giftApiUrl=null`에서 두 조건 `(friend, under-30000, birthday)`와 `(family, over-50000, housewarming)`의 추천 ID 순서가 각각 `dessert, tea, towel` 및 `tumbler, plant, towel`인지 확인해요. | PENDING / — | PENDING |
| complete 04 | starter 04 조건과 같은 추천 순서에 가격 표시가 추가되는지 확인해요. | PENDING / — | PENDING |
| 04 configured API success | 배포된 `/v1/gifts`를 설정하고 DevTools Slow 3G에서 loading 뒤 API 성공을 관찰해요. | PENDING / — | PENDING |
| 04 schema/retry/fallback | 배포된 base의 `/health`를 임시 `giftApiUrl`로 설정해 schema error, 재시도, 로컬 fallback을 재현해요. | PENDING / — | PENDING |
| 04 timeout | timeout 단위 테스트는 PASS지만 통제된 지연 endpoint가 없어 live browser는 PENDING이에요. | PENDING / — | PENDING |
| 광고 브라우저 대표 | 대표 starter에서 미지원 안내가 보이고 핵심 기능은 계속 동작하는지 확인해요. | PENDING / — | PENDING |

## 강사 QR 사전 QA (실제 결과는 PENDING)

complete는 QR 필수가 아니에요. 네 starter를 각각 최신 `.ait` 하나로 기록해요.

| starter | .ait path | SHA-256 또는 bytes | appName | build time | console upload time | device/Toss version | actual/evidence | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 weekend | `starter-kits/01-weekend-activities/*.ait` | — | `course-weekend-activities` | — | — | — | PENDING / — | PENDING |
| 02 habit | `starter-kits/02-habit-challenge/*.ait` | — | `course-habit-challenge` | — | — | — | PENDING / — | PENDING |
| 03 travel | `starter-kits/03-travel-style-test/*.ait` | — | `course-travel-style-test` | — | — | — | PENDING / — | PENDING |
| 04 gift | `starter-kits/04-gift-finder/*.ait` | — | `course-gift-finder` | — | — | — | PENDING / — | PENDING |
| 광고 QR 대표 | — | 공식 test ID | 대표 appName | — | — | — | 공식 test ID 확인 | PENDING |

## 수강생 공통 완료

수강생은 네 유형 중 자신이 고른 starter 하나만 브라우저에서 수정·확인하고, 그 starter의 최신 QR을 실기기에서 확인해요. complete, Mock API, 광고는 선택 확장이에요.

| 선택 starter | 브라우저 수정·확인 | 최신 QR 실기기 확인 | appName/기기/Toss version | actual/evidence | status |
| --- | --- | --- | --- | --- | --- |
| — | — | — | — | PENDING / — | PENDING |
