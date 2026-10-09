import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import PatientManagement from "@/components/PatientManagement";

export const Route = createFileRoute("/patients")({
  head: () => ({
    meta: [
      { title: "Patients · ClinRisk AI" },
      { name: "description", content: "Browse, search, and manage your patient cohort." },
    ],
  }),
  component: () => (
    <AppShell>
      <PatientManagement />
    </AppShell>
  ),
});
