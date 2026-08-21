# QR 테스트 체크리스트

- [ ] 콘솔 appName과 service.config.json의 appName이 같아요.
- [ ] `pnpm ready:qr`가 통과해요.
- [ ] `pnpm check`가 통과해요.
- [ ] `pnpm build:qr`로 새 `.ait` 파일을 만들었어요.
- [ ] 방금 만든 `.ait` 파일을 콘솔에 업로드했어요.
- [ ] 본인 토스 앱으로 최신 QR을 열어 핵심 기능을 끝까지 사용했어요.
- [ ] 브라우저 확인과 QR 실기기 확인을 구분해 기록했어요.

업로드할 때마다 새 QR과 deploymentId가 생길 수 있으므로, 마지막으로 업로드한 파일의 QR인지 확인해요. 첫 QR이 확인되면 개인화하고, 두 번째 QR에서 변경된 내용까지 확인해요.

검토 요청은 QR 테스트와 다른 단계예요. 선택적으로 이어가려면 [QR 이후 다음 단계](REVIEW_NEXT_STEPS.md)를 확인해요.
