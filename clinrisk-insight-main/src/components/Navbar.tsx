import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/patients", label: "Patients" },
  { to: "/analysis", label: "Analysis" },
  { to: "/reports", label: "Reports" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn("fixed top-0 inset-x-0 z-50 transition-smooth", scrolled ? "py-3" : "py-6")}
    >
      <div className={cn("mx-auto max-w-7xl px-4 md:px-8 transition-smooth")}>
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-6 py-4 transition-smooth",
            scrolled ? "glass-strong" : "bg-transparent",
          )}
        >
          <Link to="/" className="flex items-center gap-2 font-display text-xl tracking-tight text-foreground font-bold uppercase">
            CLINRISK
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => {
              const active = path === l.to || (l.to !== "/" && path.startsWith(l.to));
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "text-sm font-semibold transition-smooth",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              to="/settings"
              className={cn(
                "text-sm font-semibold transition-smooth",
                path === "/settings"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Settings
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/patients" className="hidden sm:inline-flex pill-button pill-button-dark text-sm items-center gap-2">
              BOOK APPOINTMENT
            </Link>
            <button
              className="md:hidden grid place-items-center size-10 rounded-full glass"
              onClick={() => setOpen(!open)}
              aria-label="menu"
            >
              {open ? <X className="size-5 text-foreground" /> : <Menu className="size-5 text-foreground" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass-strong rounded-3xl p-4 animate-fade-up">
            {[...links, { to: "/settings", label: "Settings" }].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-semibold hover:bg-black/5 text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
