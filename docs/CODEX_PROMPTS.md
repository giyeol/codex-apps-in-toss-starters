# Codex에 붙여 넣는 글은 어디에 있나요

수업에서 Codex에 붙여 넣는 글은 두 곳에 있어요. 이 문서는 그 위치와 공통 규칙만 적어요.

- 오전 공통 HTML: [`common-demo/PROMPT.md`](../common-demo/PROMPT.md). 다 같이 「선물 뽑기」 화면을 만들 때 써요.
- 오후 자유 주제: [`app/PROMPTS.md`](../app/PROMPTS.md). 내 HTML(`REFERENCE.html`)의 화면을 앱 화면(`src/features/active`)으로 옮길 때 써요.

오후에 내 주제의 HTML을 새로 만들 때는 오전과 같은 순서예요. 누구를 위한 화면인가 → 그 사람이 무엇을 하는가 → Codex에 그대로 말하기 → 브라우저에서 보기. 오전 프롬프트의 주제 부분만 내 주제로 바꿔 써요.

## 모든 요청 끝에 붙이는 글

“먼저 바꿀 파일과 범위를 짧게 말해 주세요. 화면은 `src/features/active`, 글과 예시는 `src/content`에만 넣고, 앱 뼈대(`src/app`, `src/ui`)와 `src/platform`은 수정하지 마세요. 앱 영문 이름과 화면 표시명은 그대로 두고, 대표 색상만 `pnpm setup`으로 바꿔요. 끝나면 `pnpm check`를 실행하고 결과를 짧게 알려 주세요.”

앱 전체를 다시 쓰기, 로그인, 서버, 결제, 실제 광고 번호, 다른 회사 계정 추가는 이 수업 범위가 아니에요. 한 번에 하나만 바꾸고, 같은 오류에는 10분만 써요.
