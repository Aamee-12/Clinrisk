import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24">{children}</main>
      <Toaster />
    </div>
  );
}
