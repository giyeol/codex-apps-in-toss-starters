# 유지보수 증거 지도

Node.js 24.8.0 이상 25 미만, pnpm 11.9.0 기준이에요. 로컬 PASS는 재현 가능한 저장소 증거이고, 외부 PENDING은 실제 환경에서 별도로 확인해야 해요.

| 범위                                       | 상태    | 증거 또는 다음 확인                                                 |
| ------------------------------------------ | ------- | ------------------------------------------------------------------- |
| 결정적 생성과 8개 출력 비교                | PASS    | `pnpm test:tooling`, `pnpm generate:check`                          |
| 네 핵심 흐름과 선택 확장                   | PASS    | `tooling/tests/flavor-difference.test.mjs`, 유형별 `START_HERE.md`  |
| setup·저장소·테스트 광고 경계              | PASS    | `scripts/setup.mjs`, storage/ad 단위 테스트, `pnpm check`           |
| 8개 frozen 설치·lint·check·build·새 `.ait` | PASS    | `node tooling/scripts/verify-projects.mjs`의 프로젝트별 바이트 출력 |
| 자동 공개 후보 검사                        | PASS    | `pnpm public:safety`, CI generated job                              |
| local mock-api check                       | PASS    | `pnpm -C mock-api check`                                           |
| Mock API dry-run                           | PENDING | 정책상 로컬 실행 없이 승인된 workflow에서 영수증 확인               |
| complete 대표 브라우저 상태               | PASS    | `docs/verification/browser-matrix.md`의 캡처 4개                   |
| starter 전체 브라우저 흐름                 | PENDING | 새 상태에서 네 starter의 전체 분기와 저장 복원을 수동 확인          |
| QR/기기 흐름                               | PENDING | 최신 QR과 토스 앱에서 실제 기기 확인                                |
| live Mock API                              | PENDING | 수동 workflow 승인 뒤 HTTPS 응답·오류 경로 확인                     |
| 공개·출판                                  | PASS    | GitHub PUBLIC·HTTP 200, `ce77e9a`, Actions `32890336164`             |
| 릴리스                                     | PENDING | 콘솔 업로드·심사·배포 승인 후 검증                                  |

PENDING 행은 로컬 빌드가 성공해도 PASS로 바꾸지 않아요.

`mock-api-production` GitHub Environment의 required reviewer와 environment-scoped `CLOUDFLARE_API_TOKEN`·`CLOUDFLARE_ACCOUNT_ID`는 저장소 공개 승인 후 GitHub에서 별도로 설정해야 해요.
