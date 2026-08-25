# 로컬 검증 영수증

- Runtime: Node.js v24.8.0, pnpm 11.9.0 (`fnm exec --using=24.8.0`).
- Fresh commands: `pnpm -C mock-api check`, `pnpm test:tooling`, `pnpm generate:check`, `pnpm public:safety`, `node tooling/scripts/verify-projects.mjs`.
- `verify:projects`는 8개 각각에서 frozen install, lint, check, 일반 build와 루트 `.ait` 하나를 확인했어요. `build:qr` 계약은 생성 출력 테스트로만 검사했고 demo appName으로 실행하지 않았어요.

| 프로젝트 | artifact bytes |
| --- | ---: |
| starter 01 weekend | 445727 |
| complete 01 weekend | 445726 |
| starter 02 habit | 446759 |
| complete 02 habit | 446789 |
| starter 03 travel | 446364 |
| complete 03 travel | 446364 |
| starter 04 gift | 446435 |
| complete 04 gift | 446435 |

local mock-api check와 complete 대표 상태 4개의 브라우저 캡처는 PASS예요. starter 전체 브라우저 분기, Cloudflare dry-run/live, QR/기기, 수동 콘솔 업로드, review, release, revenue는 모두 PENDING이에요. 공개 후보는 MIT 라이선스와 Git 이력 안전 검사를 통과했고, GitHub visibility `PUBLIC`, 비인증 HTTP `200`, 코드 커밋 `ce77e9a`, [Actions verify `32890336164`](https://github.com/giyeol/codex-apps-in-toss-starters/actions/runs/32890336164) PASS를 확인했어요.
