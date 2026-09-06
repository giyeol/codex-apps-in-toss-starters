# Apps in Toss 수업용 연습 폴더

토스 앱 안에서 열리는 작은 앱을 수업에서 만들기 위한 연습 자료예요. Toss 공식 안내를 대신하지 않아요. 코드와 문서는 [MIT 라이선스](LICENSE)로 공개하고, 토스페이스 그림은 각 폴더 안내와 [토스페이스 저작권 안내](https://toss.im/tossface/copyright)를 따라요.

오늘 수업의 목표는 이래요. 내가 만든 앱 파일(`.ait`)을 앱인토스 콘솔에 직접 올리고, 본인 토스 앱에서 QR을 찍어 핵심 기능이 되는지를 확인하는 것이에요. 심사, 출시, 수익은 이 저장소가 보장하지 않아요.

## 오늘 할 일

1. [준비물](docs/PREPARE.md)을 끝내요. 컴퓨터용 ChatGPT, Plus, node(`v24.`로 시작), pnpm(`11.9.0`)이 필요해요.
2. 오전에는 다 같이 [`common-demo`](common-demo/README.md) 폴더에서 「선물 뽑기」 HTML 화면을 Codex로 만들어요.
3. 오후는 자유 주제예요. 준비해 온 아이디어·HTML을 활용하거나, 오전에 배운 순서로 내 주제의 HTML을 만들어요. 사람 한 명·핵심 행동 하나·화면 하나로 좁혀요.
4. 전원 같은 폴더 [`app`](app/README.md)을 Codex에서 열어요. 처음 화면은 오전에 만든 선물 뽑기가 앱 뼈대에 들어가 있는 모습이에요. 폴더를 고르는 단계는 없어요. 할 일은 그 폴더의 `README.md`예요.
5. 내 HTML을 그 폴더에 `REFERENCE.html`로 복사하고, `pnpm install`과 `pnpm doctor`를 실행해요. 앱을 돌리는 데 필요한 도구가 그 폴더에 받아져요.
6. `PROMPTS.md`의 글로 내 HTML의 화면을 앱 화면(`src/features/active`)으로 옮기고 `pnpm check`를 실행해요. 앱 뼈대, 앱 이름, `src/platform` 폴더는 건드리지 않아요.
7. `pnpm build:qr`로 토스에 올릴 파일을 만들고, 콘솔에 직접 올린 뒤 본인 토스 앱에서 QR로 핵심 기능을 끝까지 확인해요.

막히면 [복구 안내](docs/RECOVERY.md)를 봐요. 같은 오류에는 10분만 쓰고 새 복사본에서 다시 시작해요.

## 폴더 안내

- `common-demo/`: 오전 공통 자료. 기획서, 프롬프트, 기준본, 완성본
- `app/`: 오후에 전원이 여는 공통 연습 폴더. 처음 화면은 선물 뽑기
- [하루 순서](docs/LEARNER_PATH.md): 오전 공통 HTML → 오후 자유 주제 HTML → 공통 연습 폴더 → QR
- `docs/`: 준비, 복구, QR 이후 안내
- [수강생 안내](docs/learner/README.md): 오늘의 순서, 붙여 넣는 글, 화면 잡기, 앱 등록 정보, 선택 안내

심사 요청을 이어서 하려면 [QR 이후 다음 단계](docs/REVIEW_NEXT_STEPS.md)를 봐요.

## 자료를 고치는 사람에게

`app/`은 `tooling/base`에서 만들어 둔 결과예요. 고칠 때는 `tooling/base`를 고친 뒤 저장소 맨 위에서 `pnpm generate`를 실행해요. 확인은 `pnpm test:tooling`, `pnpm generate:check`, `pnpm public:safety`예요. 자세한 것은 [유지보수 증거 지도](docs/MAINTAINER.md)를 봐요.
