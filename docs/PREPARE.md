# 준비물

터미널에서 먼저 아래 두 명령을 실행해 Node.js `v24.8.0` 이상 `v25` 미만의 Node 24 LTS와 pnpm `11.9.0`을 확인해요. Node 25 이상은 이 수업의 검증 대상이 아니에요.

```bash
node --version
pnpm --version
```

운영체제에 맞는 점검표를 먼저 사용해요.

- [macOS 준비 점검표](PREPARE_MACOS.md)
- [Windows 준비 점검표](PREPARE_WINDOWS.md)

Git과 ChatGPT 데스크톱 앱의 Codex를 실행하고 로그인해요. 최신 토스 앱에 본인 명의 계정으로 로그인하고, Apps in Toss 콘솔 가입과 사용할 워크스페이스를 미리 준비해요. QR 테스트는 만 19세 이상이면서 해당 워크스페이스 멤버인 계정에서 진행해야 해요.

콘솔의 미니앱 등록과 appName 확정은 유형을 선택한 뒤 수업 당일 오전에 진행해요. appName은 코드 설정과 정확히 같아야 하므로 임의로 미리 정하지 않아요.

이 강의는 WebView SDK 3.x 과정이므로 Android 에뮬레이터, iOS 시뮬레이터, Sandbox 앱은 공통 준비물이 아니에요. 각 키트의 `pnpm-workspace.yaml`은 여러 키트를 묶지 않고 pnpm 11의 공식 의존성 빌드 스크립트만 허용하므로 수정하지 마세요.
