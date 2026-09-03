# Apps in Toss 수업용 스타터킷

비공식 교육 자료예요. Toss 또는 Apps in Toss의 공식 문서·지원 채널을 대체하지 않아요. 이 저장소의 코드와 문서는 [MIT 라이선스](LICENSE)로 공개하며, 포함된 토스페이스 자산은 각 폴더의 별도 라이선스와 [토스페이스 저작권 안내](https://toss.im/tossface/copyright)를 따라요.

공통 완료선은 내 `.ait` 파일을 콘솔에 수동 업로드한 뒤 본인 토스 앱의 최신 QR에서 핵심 기능을 확인하는 것이에요. 이 저장소는 심사, 승인, 출시 또는 수익을 보장하지 않아요.

## 폴더 지도

- `starter-kits/`: 수강생이 시작하는 네 개의 최소 예제. 할 일은 각 폴더 `README.md`예요.
- `complete-examples/`: 같은 흐름의 선택 확장 참고본. 공통 시작본이 아니에요.
- `mock-api/`: 04에서 선택적으로 연결할 Hono/Cloudflare Worker
- [수강생 전체 동선](docs/LEARNER_PATH.md): 오전 HTML → 오후 스타터 → QR
- `docs/`: 운영체제별 준비, 유형 선택, 복구, QR 이후 안내와 검증 영수증
- [실습 결과물 예시](docs/RESULT_EXAMPLES.md): 네 유형의 설명과 완성 화면 이미지
- `tooling/`: starter/complete 생성 원본과 검사 도구

## 시작 동선

1. [준비물](docs/PREPARE.md)과 내 운영체제 점검표를 완료해요. Node.js는 `v24.`로 시작하고 pnpm은 `11.9.0`이어야 해요.
2. 오전에는 Codex로 HTML 목업을 만들어요.
3. [스타터 선택](docs/CHOOSE_A_STARTER.md) 후 **그 폴더**를 ChatGPT 데스크톱 Codex에서 열어요. `START_HERE.md`는 유형 설명이고, 할 일은 그 폴더 `README.md`예요.
4. `pnpm install`이 Apps in Toss 웹 프레임워크(Granite), TDS, `ait`를 그 폴더에 설치해요. Granite를 따로 깔지 마세요.
5. 오전에 만든 HTML 문구를 `PROMPTS.md`로 `src/content`에 반영해요. `src/platform`은 일반 실습 대상이 아니에요.
6. `pnpm build:qr`로 `.ait`를 만들어 콘솔에 수동 업로드하고 QR을 확인해요. `pnpm build`는 demo appName을 쓰는 로컬 검사용이에요.

막히면 [복구 안내](docs/RECOVERY.md)를 보고, 같은 오류에는 최대 10분만 쓰고 새 폴더에서 다시 시작해요. [QR 체크리스트](docs/QR_CHECKLIST.md)와 [유형별 Codex 프롬프트](docs/CODEX_PROMPTS.md)를 함께 사용해요.

지원 범위는 이 저장소의 로컬 설치·생성·테스트와 수업 실습 흐름이에요. 콘솔 계정, 검토 요청, 승인, 출시, QR·실기기 결과와 공개는 각각 별도 확인이 필요해요. 첫 QR 이후 선택적으로 검토를 준비하려면 [QR 이후 다음 단계](docs/REVIEW_NEXT_STEPS.md)를 확인해요.
