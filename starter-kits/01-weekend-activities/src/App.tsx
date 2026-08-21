import { AppShell } from "./app/AppShell";
import { ActiveFeature } from "./features/active";
export default function App() {
  return (
    <AppShell>
      <ActiveFeature />
    </AppShell>
  );
}
