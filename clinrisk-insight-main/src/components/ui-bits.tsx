import { cn } from "@/lib/utils";

export function Stat({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={cn("glass rounded-2xl p-5", className)}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function SeverityBadge({ severity }: { severity: "low" | "medium" | "high" }) {
  const map = {
    low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    medium: "bg-accent/15 text-accent border-accent/30",
    high: "bg-destructive/15 text-red-300 border-destructive/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        map[severity],
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full animate-pulse-dot",
          severity === "low"
            ? "bg-emerald-400"
            : severity === "medium"
              ? "bg-accent"
              : "bg-red-400",
        )}
      />
      {severity.toUpperCase()}
    </span>
  );
}

export function RadialScore({
  value,
  max = 40,
  label,
}: {
  value: number;
  max?: number;
  label?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const color = pct > 60 ? "stroke-red-400" : pct > 30 ? "stroke-accent" : "stroke-emerald-400";
  return (
    <div className="relative grid place-items-center">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r={r} className="stroke-white/10 fill-none" strokeWidth="10" />
        <circle
          cx="80"
          cy="80"
          r={r}
          className={cn("fill-none transition-all duration-1000", color)}
          strokeWidth="10"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-4xl">
            {value.toFixed(1)}
            {label ? "" : "%"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{label ?? "10-yr risk"}</div>
        </div>
      </div>
    </div>
  );
}
