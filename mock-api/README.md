# Gift Finder Mock API

이 Worker는 공개 정적 추천 데이터만 쓰므로 runtime application secret은 없어요. 다만 배포 credential인 `CLOUDFLARE_API_TOKEN`과 `CLOUDFLARE_ACCOUNT_ID`는 보호된 GitHub Environment `mock-api-production`에만 설정해야 해요.

로컬에서는 Node 24.8.0으로 `pnpm install --frozen-lockfile`, `pnpm check`, 필요 시 `pnpm dev`를 실행해요. 배포는 승인된 GitHub Actions workflow만 사용하며, workflow가 `${deployment-url}/health`를 확인하고 JSON 영수증을 남겨요.

배포가 확인되면 04 선물 찾기의 `service.config.json`에서 `giftApiUrl`에 `${deployment-url}/v1/gifts`를 넣어요. 기본값 `null`은 로컬 fallback을 사용하며, dry-run/live/browser/QR은 아직 PENDING이에요.
