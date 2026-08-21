# Apps in Toss 수업용 스타터킷

비공식 교육 자료예요. Toss 또는 Apps in Toss의 공식 문서·지원 채널을 대체하지 않으며, 현재 공개 출판과 라이선스는 모두 `PENDING`이에요.

## 폴더 지도

- `starter-kits/`: 수강생이 시작하는 네 개의 최소 예제
- `complete-examples/`: 같은 흐름의 선택 확장 참고본
- `mock-api/`: 04에서 선택적으로 연결할 Hono/Cloudflare Worker
- [수강생 전체 동선](docs/LEARNER_PATH.md): 준비부터 첫 QR, 개인화, 두 번째 QR까지의 한 가지 진행 순서
- `docs/`: 운영체제별 준비, 유형 선택, 복구, QR 이후 안내와 검증 영수증
- [실습 결과물 예시](docs/RESULT_EXAMPLES.md): 네 유형의 설명과 완성 화면 이미지
- `tooling/`: starter/complete 생성 원본과 검사 도구

## 시작 동선

공통 첫 목표는 내 `.ait` 파일을 만들고 콘솔에 수동 업로드한 뒤 최신 QR로 핵심 기능을 확인하는 것이에요. 이 저장소는 공개, 심사, 승인, 출시 또는 수익을 보장하지 않아요.

1. [준비물](docs/PREPARE.md)과 내 운영체제 점검표를 완료해요.
2. [스타터 선택](docs/CHOOSE_A_STARTER.md) 후 선택 폴더의 `README.md`를 열어요.
3. `SERVICE_BRIEF.md`로 사용자·핵심 행동·주요 화면 또는 상태·제외 범위를 정해요.
4. `pnpm install` → `pnpm doctor` → `pnpm setup` → `pnpm dev` 순서로 기준본을 브라우저에서 확인해요.
5. 점심 직후 `pnpm build:qr`로 만든 `.ait` 하나를 콘솔에 수동 업로드하고 첫 QR을 확인해요.
6. `PROMPTS.md`를 이용해 `src/content`와 표시 이름·대표 색상을 개인화하고 `pnpm check`로 확인해요. `src/platform`은 일반 실습 대상이 아니에요.
7. 새 `.ait`를 다시 업로드해 두 번째 QR에서 변경 결과를 확인해요. `pnpm build`는 demo appName을 쓰는 로컬 CI용이에요.

수업 당일 흐름은 오전 유형 선택·기획·기준본 준비, 13:00 첫 QR, 13:45 개인화, 15:30 두 번째 QR, 16:15 결과 공유, 16:40 다음 단계 정리예요. 정확한 체크포인트는 [수강생 전체 동선](docs/LEARNER_PATH.md)을 따라요.

막히면 [복구 안내](docs/RECOVERY.md)를 먼저 보고, 같은 오류에는 최대 10분만 쓰고 새 폴더에서 다시 시작해요. [QR 체크리스트](docs/QR_CHECKLIST.md)와 [유형별 Codex 프롬프트](docs/CODEX_PROMPTS.md)를 함께 사용해요.

지원 범위는 이 저장소의 로컬 설치·생성·테스트와 수업 실습 흐름이에요. 콘솔 계정, 검토 요청, 승인, 출시, QR·실기기 결과와 공개는 각각 별도 확인이 필요해요. 첫 QR 이후 선택적으로 검토를 준비하려면 [QR 이후 다음 단계](docs/REVIEW_NEXT_STEPS.md)를 확인해요.
