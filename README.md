# Apps in Toss 수업용 연습 폴더

토스 앱 안에서 열리는 작은 앱을 수업에서 만들기 위한 연습 자료예요. Toss 공식 안내를 대신하지 않아요. 코드와 문서는 [MIT 라이선스](LICENSE)로 공개하고, 토스페이스 그림은 각 폴더 안내와 [토스페이스 저작권 안내](https://toss.im/tossface/copyright)를 따라요.

오늘 수업의 목표는 이래요. 내가 만든 앱 파일(`.ait`)을 앱인토스 콘솔에 직접 올리고, 본인 토스 앱에서 QR을 찍어 핵심 기능이 되는지를 확인하는 것이에요. 심사, 출시, 수익은 이 저장소가 보장하지 않아요.

## 오늘 할 일

1. [준비물](docs/PREPARE.md)을 끝나요. 컴퓨터용 ChatGPT, Plus, node(`v24.`로 시작), pnpm(`11.9.0`)이 필요해요.
2. 오전에는 컴퓨터용 ChatGPT에서 Codex로 웹페이지 초안을 만들어요.
3. [연습용 앱 고르기](docs/CHOOSE_A_STARTER.md)에서 폴더 하나를 고르고, 그 폴더를 Codex에서 열어요. 할 일은 그 폴더의 `README.md`예요.
4. 그 폴더에서 `pnpm install`을 실행해요. 앱을 돌리는 데 필요한 도구가 그 폴더에 받아져요.
5. 오전에 만든 글을 `PROMPTS.md`의 안내대로 `src/content` 폴더에 넣어요. `src/platform` 폴더는 건드리지 않아요.
6. `pnpm build:qr`로 토스에 올릴 파일을 만들고, 콘솔에 직접 올린 뒤 QR을 확인해요.

막히면 [복구 안내](docs/RECOVERY.md)를 봐요. 같은 오류에는 10분만 쓰고 새 복사본에서 다시 시작해요.

## 폴더 안내

- `starter-kits/`: 수업에서 여는 연습용 앱 네 개
- `complete-examples/`: 다 만들어 둔 참고용. 수업에서 처음 여는 폴더가 아니에요
- [하루 순서](docs/LEARNER_PATH.md): 오전 웹페이지 초안 → 오후 연습 폴더 → QR
- `docs/`: 준비, 앱 고르기, 복구, QR 이후 안내
- [완성 화면 예시](docs/RESULT_EXAMPLES.md)

심사 요청을 이어서 하려면 [QR 이후 다음 단계](docs/REVIEW_NEXT_STEPS.md)를 봐요.
