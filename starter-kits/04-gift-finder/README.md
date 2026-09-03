# 상황별 선물 찾기

이 폴더는 오전에 만든 HTML을 미니앱으로 옮긴 뒤, 본인 토스 앱의 QR까지 확인하는 실습 폴더예요. 앱을 처음부터 다시 만들지 마세요.

시작하기 전에 ChatGPT 데스크톱에서 **이 폴더**를 열어요. Node.js는 `v24.`로 시작하고, pnpm은 `11.9.0`이어야 해요. `v25`는 쓰지 마세요.

`START_HERE.md`는 이 예시가 어떤 유형인지만 적어요. 할 일은 이 문서를 따라요.

## 바꿔도 되는 곳

- 문구와 예시 데이터는 `src/content`
- 화면 표시 이름과 대표 색상은 `pnpm setup` → `service.config.json`
- 오전에 만든 HTML의 문구와 흐름만 반영해요

## 바꾸지 마세요

- `src/platform`
- 로그인, 결제, 실제 광고 ID, 새 서버, 외부 계정, SDK 교체

## 순서

1. `SERVICE_BRIEF.md`에 사용자·핵심 행동·주요 화면 또는 상태·제외 범위를 적어요. 오전에 만든 HTML을 기준으로 해요.
2. 이 폴더에서 `pnpm install`을 실행해요. 이때 Apps in Toss 웹 프레임워크(Granite), TDS, `ait`가 이 폴더에 설치돼요. Granite를 따로 깔지 마세요.
3. `pnpm doctor`로 준비 상태를 확인해요.
4. Apps in Toss 콘솔에서 만든 appName을 준비한 뒤 `pnpm setup`을 실행해요. 미니앱 등록은 이 폴더를 연 뒤에 해요.
5. `pnpm dev`로 브라우저에서 기준본의 핵심 기능을 확인해요. 멈추려면 `Ctrl+C`예요.
6. `PROMPTS.md`의 글을 Codex에 붙여 HTML 문구를 `src/content`에 반영해요. 한 번에 하나만 바꾸고, 끝나면 `pnpm check` 결과를 확인해요.
7. `pnpm build:qr`로 첫 `.ait`를 만들어요. 콘솔에 수동 업로드하고 본인 토스 앱의 최신 QR에서 확인해요. 수업 QR은 `pnpm build`가 아니에요. `pnpm build`는 demo appName을 쓰는 로컬 검사용이에요.
8. 더 바꾸면 `pnpm check`와 `pnpm build:qr`을 다시 실행하고, 새 `.ait`를 올려 두 번째 QR에서 변경 결과를 확인해요.

문서 순서: `START_HERE.md` → `SERVICE_BRIEF.md` → 이 문서 → `PROMPTS.md` → `QR_CHECKLIST.md`

막히면 저장소 루트 [`docs/RECOVERY.md`](../../docs/RECOVERY.md)를 봐요. 이 폴더만 있으면 같은 오류에 10분만 쓰고 새 복사본에서 시작해요. API 키나 배포 명령은 필요 없어요.
