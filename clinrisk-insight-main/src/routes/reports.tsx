import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { FileDown, FileText } from "lucide-react";
import { patients } from "@/lib/sample-data";
import { SeverityBadge } from "@/components/ui-bits";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports · ClinRisk AI" },
      { name: "description", content: "Clinic-wide reports and patient export." },
    ],
  }),
  component: () => (
    <AppShell>
      <Reports />
    </AppShell>
  ),
});

function Reports() {
  const stats = {
    total: patients.length,
    high: patients.filter((p) => p.severity === "high").length,
    avgRisk: Math.round(patients.reduce((s, p) => s + p.riskScore, 0) / patients.length),
  };
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <p className="text-accent text-sm uppercase tracking-widest">Reports</p>
      <h1 className="font-display text-4xl md:text-5xl mt-2 mb-8">Clinic intelligence.</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-3xl p-6">
          <p className="text-muted-foreground text-xs uppercase tracking-wider">Total patients</p>
          <p className="font-display text-4xl mt-2">{stats.total}</p>
        </div>
        <div className="glass rounded-3xl p-6">
          <p className="text-muted-foreground text-xs uppercase tracking-wider">High-risk</p>
          <p className="font-display text-4xl mt-2 text-red-400">{stats.high}</p>
        </div>
        <div className="glass rounded-3xl p-6">
          <p className="text-muted-foreground text-xs uppercase tracking-wider">Avg risk score</p>
          <p className="font-display text-4xl mt-2 text-accent">{stats.avgRisk}%</p>
        </div>
      </div>

      <div className="glass-strong rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">Patient reports</h2>
          <Button variant="gold">
            <FileDown className="size-4" /> Export all
          </Button>
        </div>
        <div className="divide-y divide-white/5">
          {patients.slice(0, 10).map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.id} · {p.condition}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SeverityBadge severity={p.severity} />
                <Button size="sm" variant="glass">
                  PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
