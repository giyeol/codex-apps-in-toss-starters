# 로컬 검증 영수증

- Runtime: Node.js v24.8.0, pnpm 11.9.0.
- Fresh commands: `pnpm test:tooling`, `pnpm generate:check`, `pnpm public:safety`, `node tooling/scripts/verify-projects.mjs`.
- `verify:projects`는 `app/`에서 frozen install, lint, check, 일반 build와 루트 `.ait` 하나를 확인해요. `build:qr` 계약은 생성 출력 테스트로만 검사했고 demo appName으로 실행하지 않았어요.

| 프로젝트 | artifact bytes |
| --- | ---: |
| app (선물 뽑기) | 아래 「최근 실행」 참고 |

## 최근 실행

- 2026-09-07: 프로젝트를 `app/` 하나로 합친 뒤 실행. 결과는 이 문서를 고친 커밋의 본문과 `docs/MAINTAINER.md`에 적어요.

브라우저 전체 분기, QR/기기, 수동 콘솔 업로드, review, release, revenue는 모두 PENDING이에요. `pnpm public:safety`는 `.generated-stage/`처럼 gitignore된 로컬 폴더까지 검사하니, 실패 항목이 커밋 대상인지 먼저 확인해요.
