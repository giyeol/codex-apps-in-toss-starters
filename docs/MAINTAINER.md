# 유지보수 증거 지도

Node.js 24.8.0 이상 25 미만, pnpm 11.9.0 기준이에요. 로컬 PASS는 재현 가능한 저장소 증거이고, 외부 PENDING은 실제 환경에서 별도로 확인해야 해요.

수업에서 만드는 프로젝트는 `app/` 하나예요. 원본은 `tooling/base`이고, `tooling/project.mjs`의 값으로 렌더링해요.

| 범위 | 상태 | 증거 또는 다음 확인 |
| --- | --- | --- |
| 결정적 생성과 `app/` 출력 비교 | PASS | `pnpm test:tooling`, `pnpm generate:check` |
| 선물 뽑기 화면 모델·저장·테스트 광고 경계 | PASS | `src/features/active/model.test.ts`, storage/ad 단위 테스트, `pnpm check` |
| `app/` frozen 설치·lint·check·build·새 `.ait` | PASS | `node tooling/scripts/verify-projects.mjs`의 바이트 출력 |
| 자동 공개 후보 검사 | PASS | `pnpm public:safety`, CI generated job |
| 브라우저 대표 상태 | PASS | `docs/verification/browser-matrix.md` |
| 브라우저 전체 흐름 | PENDING | 새 상태에서 9칸 열기·새로고침 복원·처음부터를 수동 확인 |
| QR/기기 흐름 | PENDING | 최신 QR과 토스 앱에서 실제 기기 확인 |
| 공개·출판 | PASS | GitHub PUBLIC·HTTP 200 |
| 릴리스 | PENDING | 콘솔 업로드·심사·배포 승인 후 검증 |

PENDING 행은 로컬 빌드가 성공해도 PASS로 바꾸지 않아요.

발표 자료(`docs/*.pptx`, `docs/*.pdf`, `docs/aiers-lecture-deck.js`, `docs/assets/console/`, `docs/assets/live/`, `tooling/deck/`)는 저장소에 넣지 않아요. `.gitignore`로 제외돼 있어요.
