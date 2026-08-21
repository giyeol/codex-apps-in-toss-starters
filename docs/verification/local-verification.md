# 로컬 검증 영수증

- Runtime: Node.js v24.8.0, pnpm 11.9.0 (`fnm exec --using=24.8.0`).
- Fresh commands: `pnpm -C mock-api check`, `pnpm test:tooling`, `pnpm generate:check`, `pnpm public:safety`, `node tooling/scripts/verify-projects.mjs`.
- `verify:projects`는 8개 각각에서 frozen install, lint, check, 일반 build와 루트 `.ait` 하나를 확인했어요. `build:qr` 계약은 생성 출력 테스트로만 검사했고 demo appName으로 실행하지 않았어요.

| 프로젝트 | artifact bytes |
| --- | ---: |
| starter 01 weekend | 431024 |
| complete 01 weekend | 431026 |
| starter 02 habit | 431466 |
| complete 02 habit | 431498 |
| starter 03 travel | 431317 |
| complete 03 travel | 431314 |
| starter 04 gift | 431038 |
| complete 04 gift | 431034 |

local mock-api check와 complete 대표 상태 4개의 브라우저 캡처는 PASS예요. starter 전체 브라우저 분기, Cloudflare dry-run/live, QR/기기, 수동 콘솔 업로드, publication, review, release, revenue는 모두 PENDING이에요. 저장소는 GitHub private 상태로 커밋·푸시했으며 공개 전환은 별도 승인 전까지 PENDING이에요.
