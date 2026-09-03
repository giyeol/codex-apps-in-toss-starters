# AI 실습 범위

이 폴더는 비공식 Apps in Toss 수업용 스타터예요. Toss 공식 지원 채널이 아니에요.

수강생이 ChatGPT 데스크톱 Codex로 **이 폴더**를 연 상태예요. 오전에 만든 HTML 목업을 이 미니앱에 반영하는 단계예요.

## 시작 조건

- Node.js는 `v24.`로 시작하고 pnpm은 `11.9.0`이어야 해요. `v25`는 쓰지 마세요.
- 할 일은 `README.md` 순서예요. 붙여넣을 글은 `PROMPTS.md`예요.
- `pnpm install`이 `@apps-in-toss/web-framework`(Granite), TDS, `ait`를 이 폴더에 설치해요. Granite를 전역으로 깔지 마세요.

## 해도 되는 일

- `src/content`의 문구와 예시 데이터
- `pnpm setup`으로 `service.config.json`의 표시 이름·대표 색상
- `SERVICE_BRIEF.md`에 적힌 범위의 작은 변경
- 변경 후 `pnpm check`

## 하지 마세요

- 앱을 처음부터 다시 만들기
- `src/platform` 수정
- 로그인, 결제, 실제 광고 ID, 새 서버, 외부 계정, SDK 교체
- 수업 QR을 `pnpm build`로 만들기. `pnpm build:qr`을 쓰세요.
- 이 폴더 밖의 `tooling/`이나 다른 키트를 수강생 실습으로 수정하기
