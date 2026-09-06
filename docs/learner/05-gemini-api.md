# Gemini 무료 API 붙이기 (선택)

내 컴퓨터의 Codex는 앱 안에서 안 돌아가요. 앱 안에서 AI가 답하게 하려면 밖에 있는 AI API를 불러야 해요. Google Gemini는 무료 사용량이 있어요.

## 순서

1. Google AI Studio에서 API 키를 만들어요. (aistudio.google.com → Get API key)
2. 키는 **Codex 대화창에 붙여 넣지 마세요.** 파일 `.env.local`에 `GEMINI_API_KEY=...`로 넣고, 그 파일은 공유하지 않아요.
3. Codex에게 이렇게 말해요.
   > `.env.local`의 `GEMINI_API_KEY`를 읽어서, 사용자가 적은 글을 Gemini API에 보내고 답을 화면에 보여 주는 기능을 만들어 줘. 키는 코드에 직접 쓰지 말고, 실패하면 “잠시 뒤 다시 시도해요” 문구를 보여 줘.

## 알아 둘 것

- 브라우저에서 바로 부르면 키가 노출돼요. 실제 출시 전에는 작은 서버(예: Cloudflare Worker)를 거치게 해야 해요. 오늘은 미리보기까지만.
- 무료 사용량을 넘으면 답이 안 와요. 실패 문구가 꼭 있어야 해요.
- 앱인토스 심사에서 외부 요청은 HTTPS여야 하고, 개인정보를 보내면 처리방침이 필요해요.
- 앱끼리 통신은 안 돼요. 외부 API만 돼요.
