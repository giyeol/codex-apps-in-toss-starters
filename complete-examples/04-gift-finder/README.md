# 상황별 선물 찾기

1. `SERVICE_BRIEF.md`에 사용자·핵심 행동·주요 화면 또는 상태·제외 범위를 적어요.
2. 이 폴더에서 `pnpm install`을 실행하고 `pnpm doctor`로 준비 상태를 확인해요.
3. Apps in Toss 콘솔에서 만든 appName을 준비한 뒤 `pnpm setup`을 실행해요.
4. 한 터미널에서 `pnpm dev`를 실행해 변경 전 기준본의 핵심 기능을 확인해요. 멈추려면 `Ctrl+C`를 눌러요.
5. 점심 직후 `pnpm build:qr`로 첫 `.ait`를 만들고, 콘솔에 수동 업로드해 최신 QR에서 기준본을 확인해요.
6. `PROMPTS.md`를 이용해 콘텐츠는 `src/content`에서, 표시 이름·대표 색상은 `pnpm setup`과 `service.config.json`에서 바꿔요. `src/platform`은 일반 실습에서 수정하지 마세요.
7. `pnpm check`와 `pnpm build:qr`를 다시 실행하고, 새 `.ait`를 올려 두 번째 QR에서 변경 결과를 확인해요. 일반 `pnpm build`는 demo appName을 쓰는 로컬 CI용이에요.

이 예시는 API 키나 배포 명령이 필요하지 않아요. `SERVICE_BRIEF.md` → 이 문서 → `PROMPTS.md` → `QR_CHECKLIST.md` 순서로 사용하고, 막히면 [공통 복구 안내](../../docs/RECOVERY.md)를 확인해요.
