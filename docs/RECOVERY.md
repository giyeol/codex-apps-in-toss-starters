# 복구

같은 오류에는 최대 10분만 사용해요. 아래 체크포인트 중 마지막으로 통과한 곳으로 돌아가고, 기존 폴더를 덮어쓰지 마세요.

| 체크포인트 | 확인할 증거 | 다음 행동 |
| --- | --- | --- |
| 1. 준비 완료 | Node 24, pnpm 11.9.0, Git, Codex 실행 | `pnpm install`로 이동 |
| 2. 설치 완료 | `pnpm doctor` 통과 | appName을 확인하고 `pnpm setup` 실행 |
| 3. 기준본 완료 | `pnpm dev` 브라우저에서 핵심 기능 작동 | 첫 `pnpm build:qr` 실행 |
| 4. 첫 QR 완료 | 기준본이 최신 QR에서 실행 | `src/content` 개인화 |
| 5. 개인화 완료 | `pnpm check` 통과 | 새 `.ait` 빌드와 두 번째 QR |

## 깨끗한 시작본으로 돌아가기

1. 현재 폴더 이름 뒤에 `-old`를 붙여 보존해요.
2. 현재 배포된 깨끗한 복사본을 **새 폴더**에 다시 받아요.
3. 새 폴더에서 `pnpm install`과 `pnpm doctor`를 먼저 실행해요.
4. 이전 폴더에서 직접 만든 `src/content/`의 문구와 데이터만 한 항목씩 옮겨요.
5. `src/platform`, lockfile, 설정 파일 전체를 복사하지 않아요.

현재는 강의 태그가 아직 만들어지지 않았어요. 향후 강의용 태그가 실제로 만들어지고 안내 문서에 이름이 기록된 경우에만 그 태그를 새 폴더에 clone해 같은 방식으로 복구해요.

브라우저 저장 상태가 섞였을 때만 개발자 도구에서 01은 `localStorage.removeItem("course.weekend.saved.v1")`, 02는 `localStorage.removeItem("course.habit.v1")`를 실행한 뒤 새로고침해요. 이 작업은 브라우저 저장값만 지우며 QR 환경의 저장값을 지우지 않아요.
