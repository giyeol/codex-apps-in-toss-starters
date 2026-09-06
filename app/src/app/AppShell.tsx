import type { CSSProperties, PropsWithChildren } from "react";
import service from "../../service.config.json";
import { TestAdPanel } from "../platform/monetization/TestAdPanel";
import { theme } from "../theme";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-canvas">
      <main
        className="app-shell"
        data-feature={service.featureName}
        style={{ "--course-primary": theme.primaryColor } as CSSProperties}
      >
        <div className="app-content">{children}</div>
        <footer className="course-footer">
          <TestAdPanel />
          <p className="tossface-credit">
            이 서비스에는 토스팀에서 제공한 토스페이스가 적용되어 있습니다.{" "}
            <a
              href="https://toss.im/tossface/copyright"
              rel="noreferrer"
              target="_blank"
            >
              저작권 안내
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
