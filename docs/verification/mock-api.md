# Mock API 검증 영수증

이 Worker는 공개 정적 데이터만 사용하고 runtime application secret을 요구하지 않아요. rate limit은 Origin 공유 key로 분당 120회인 수업 트래픽 완화 장치일 뿐 보안 경계가 아니며, Origin spoofing과 같은 Origin 공유 수강생의 동시 호출 한계가 있어요.

| 범위 | 상태 | 증거/다음 단계 |
| --- | --- | --- |
| local mock-api check | PASS | `pnpm -C mock-api check`: TypeScript와 Vitest 계약 테스트 통과 |
| Cloudflare dry-run | PENDING | 이 작업 환경 정책으로 실행하지 않으며 승인된 CI/환경에서 영수증 기록 |
| live HTTPS endpoint | PENDING | 수동 workflow 승인·배포 뒤 `/health` 영수증 확인 |
| QR/실기기 configured API | PENDING | `giftApiUrl`을 HTTPS endpoint로 명시 설정 후 loading/error/retry 확인 |

현재 04 선물 찾기의 `giftApiUrl`은 `null`이에요. 따라서 로컬 추천이 기본 동작이고, Mock API 성공·timeout·응답 schema 오류·로컬 예비 추천은 endpoint를 구성한 뒤에만 검증하는 확장 흐름이에요.
