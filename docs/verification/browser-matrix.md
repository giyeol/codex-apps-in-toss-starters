# 브라우저·QR QA 영수증

로컬 check/build PASS는 브라우저, QR, 기기, 콘솔 또는 공개 완료를 뜻하지 않아요. 실제 관찰 전 모든 행은 `PENDING`이에요. 프로젝트는 `app/` 하나이고, 처음 화면은 선물 뽑기예요.

## 대표 화면 캡처 (2026-09-07)

아래 PASS는 Playwright 내장 Chromium으로 로컬 `app/`을 `pnpm dev`로 띄우고, 첫 화면을 `390×844 @2x`로 캡처한 결과만 뜻해요. 캡처는 발표 자료용으로 저장소 밖(`docs/assets/live/`, gitignore)에 두어요.

| 프로젝트 | origin | 실제로 관찰한 대표 상태 | status |
| --- | --- | --- | --- |
| app | `http://127.0.0.1:4183/` | 선물 뽑기 첫 화면: 쌓인 금액 0원, 상자 9칸, 안내 문구, 처음부터 버튼 | PASS |

## 강사 사전 QA (실제 결과는 PENDING)

브라우저 초기화는 브라우저 전용이에요. 개발자 도구에서 `localStorage.removeItem("course.gift.v1")` 후 `location.reload()`해요. QR 첫 실행은 학생별 `appName`의 현재 저장 상태를 사용하며, 재업로드 뒤에는 기존 상태가 유지되는지 별도로 기록해요.

| 흐름 | 절차와 기대 결과 | actual/evidence | status |
| --- | --- | --- | --- |
| 상자 열기 | 상자를 누르면 2초 동안 「광고 보는 중…」이 보이고, 그 상자에 1~3원이 적히며 쌓인 금액이 늘어나요. | PENDING / — | PENDING |
| 광고 중 중복 입력 | 광고 표시 중에는 다른 상자를 눌러도 반응하지 않아요. | PENDING / — | PENDING |
| 새로고침 복원 | 상자 몇 개를 연 뒤 새로고침해도 열린 상자와 금액이 그대로예요. | PENDING / — | PENDING |
| 9개 완료 | 9개를 다 열면 교환 안내 문장이 보여요. | PENDING / — | PENDING |
| 처음부터 | 「처음부터」를 누르면 상자와 금액이 초기화돼요. | PENDING / — | PENDING |
| 광고 브라우저 대표 | 하단 「테스트 광고 연결」에서 미지원 안내가 보이고 핵심 기능은 계속 동작해요. | PENDING / — | PENDING |

## 강사 QR 사전 QA (실제 결과는 PENDING)

| 프로젝트 | .ait path | SHA-256 또는 bytes | appName | build time | console upload time | device/Toss version | actual/evidence | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| app | `app/*.ait` | — | 강사 콘솔 appName | — | — | — | PENDING / — | PENDING |
| 광고 QR 대표 | — | 공식 test ID | 대표 appName | — | — | — | 공식 test ID 확인 | PENDING |

## 수강생 공통 완료

수강생은 `app/`의 화면을 자기 주제로 바꾼 뒤 브라우저에서 확인하고, 최신 QR을 실기기에서 확인한 뒤 검토 요청을 눌러요. 테스트 광고는 선택 확장이에요.

| 수강생 | 브라우저 수정·확인 | 최신 QR 실기기 확인 | appName/기기/Toss version | actual/evidence | status |
| --- | --- | --- | --- | --- | --- |
| — | — | — | — | PENDING / — | PENDING |
