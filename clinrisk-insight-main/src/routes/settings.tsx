import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · ClinRisk AI" }] }),
  component: () => (
    <AppShell>
      <Settings />
    </AppShell>
  ),
});

function Settings() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-10">
      <h1 className="font-display text-4xl mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Profile, clinic, and integrations.</p>
      <div className="space-y-4">
        {["Profile", "Clinic", "Notifications", "Integrations", "Security"].map((s) => (
          <div
            key={s}
            className="glass rounded-2xl p-5 flex items-center justify-between hover-lift"
          >
            <p className="font-medium">{s}</p>
            <span className="text-xs text-muted-foreground">Coming soon</span>
          </div>
        ))}
      </div>
    </div>
  );
}
