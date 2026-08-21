import type { CSSProperties, PropsWithChildren } from "react";
import service from "../../service.config.json";
import { TestAdPanel } from "../platform/monetization/TestAdPanel";
import { theme } from "../theme";
import { Icon, type IconName } from "../ui/Icon";

const featureMeta: Record<string, { icon: IconName; label: string }> = {
  weekendActivities: { icon: "compass", label: "이번 주말을 가볍게" },
  habitChallenge: { icon: "check", label: "오늘의 작은 루틴" },
  travelStyleTest: { icon: "sparkle", label: "나를 알아보는 1분" },
  giftFinder: { icon: "gift", label: "마음을 고르는 시간" },
};

export function AppShell({ children }: PropsWithChildren) {
  const meta =
    featureMeta[service.featureName] ?? featureMeta.weekendActivities;
  return (
    <div className="app-canvas">
      <main
        className="app-shell"
        data-feature={service.featureName}
        style={{ "--course-primary": theme.primaryColor } as CSSProperties}
      >
        <header className="app-header">
          <div className="app-brand">
            <span className="app-mark" aria-hidden="true">
              <Icon name={meta.icon} size={22} />
            </span>
            <div>
              <p className="eyebrow">Apps in Toss mini</p>
              <p className="app-label">{meta.label}</p>
            </div>
          </div>
          <h1>{service.displayName}</h1>
          <p className="app-tagline">{service.tagline}</p>
        </header>
        <div className="app-content">{children}</div>
        <TestAdPanel />
      </main>
    </div>
  );
}
