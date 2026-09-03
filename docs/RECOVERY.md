# 복구

같은 오류에는 최대 10분만 써요. 아래 단계 중 마지막으로 통과한 곳으로 돌아가고, 지금 쓰던 폴더 위에 덮어쓰지 마세요.

| 단계 | 확인 | 다음 |
| --- | --- | --- |
| 1. 준비 완료 | node 24, pnpm 11.9.0, Codex가 켜짐 | `pnpm install` |
| 2. 설치 완료 | `pnpm doctor` 통과 | 콘솔의 앱 영문 이름을 확인하고 `pnpm setup` |
| 3. 미리보기 완료 | `pnpm dev`로 브라우저에서 핵심 기능이 됨 | `pnpm build:qr` |
| 4. 첫 QR 완료 | 본인 토스 앱의 최신 QR에서 기본 화면이 열림 | `src/content`에 내 글 넣기 |
| 5. 글 반영 완료 | `pnpm check` 통과 | 새 `.ait` 파일을 만들고 두 번째 QR |

## 깨끗한 복사본으로 돌아가기

1. 지금 폴더 이름 뒤에 `-old`를 붙여 남겨 둬요.
2. 깨끗한 복사본을 **새 폴더**에 다시 받아요.
3. 새 폴더에서 `pnpm install`과 `pnpm doctor`를 먼저 실행해요.
4. 이전 폴더에서 직접 만든 `src/content/`의 글만 하나씩 옮겨요.
5. `src/platform` 폴더와 설정 파일 전체를 복사하지 않아요.

브라우저에 예전 값이 섞였을 때만, 개발자 도구에서 01은 `localStorage.removeItem("course.weekend.saved.v1")`, 02는 `localStorage.removeItem("course.habit.v1")`를 실행한 뒤 새로고침해요. 컴퓨터 브라우저 값만 지워지고, 토스 앱 QR 안의 값은 지우지 않아요.
