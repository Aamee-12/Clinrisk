import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useMemo, useState } from "react";
import { framingham, chadsVasc, ascvd, hasbled } from "@/lib/risk-models";
import { riskModels } from "@/lib/sample-data";
import { RadialScore, SeverityBadge } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Lightbulb, FileDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Risk Analysis · ClinRisk AI" },
      { name: "description", content: "Calculate validated clinical risk scores instantly." },
    ],
  }),
  component: () => (
    <AppShell>
      <AnalysisPage />
    </AppShell>
  ),
});

function AnalysisPage() {
  const [model, setModel] = useState<"framingham" | "chadsvasc" | "ascvd" | "hasbled">(
    "framingham",
  );

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="mb-8">
        <p className="text-accent text-sm uppercase tracking-widest">Risk Analysis</p>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Score in seconds.</h1>
        <p className="text-muted-foreground mt-2">
          Enter parameters, get an explainable risk score with intervention guidance.
        </p>
      </div>

      <div className="overflow-x-auto scrollbar-hide mb-6">
        <div className="flex gap-2 min-w-max pb-2">
          {riskModels.map((m) => (
            <button
              key={m.id}
              onClick={() =>
                m.id === "framingham" ||
                m.id === "chadsvasc" ||
                m.id === "ascvd" ||
                m.id === "hasbled"
                  ? setModel(m.id as "framingham" | "chadsvasc" | "ascvd" | "hasbled")
                  : toast.info(`${m.name} coming soon`)
              }
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-smooth ${
                model === m.id
                  ? "bg-primary text-primary-foreground glow-purple"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {model === "framingham" ? (
        <FraminghamCalc />
      ) : model === "chadsvasc" ? (
        <ChadsCalc />
      ) : model === "ascvd" ? (
        <AscvdCalc />
      ) : (
        <HasBledCalc />
      )}
    </div>
  );
}

function FraminghamCalc() {
  const [age, setAge] = useState(55);
  const [gender, setGender] = useState<"M" | "F">("M");
  const [chol, setChol] = useState(220);
  const [hdl, setHdl] = useState(45);
  const [sbp, setSbp] = useState(135);
  const [smoker, setSmoker] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [htnTx, setHtnTx] = useState(false);

  const result = useMemo(
    () => framingham({ age, gender, totalChol: chol, hdl, sbp, smoker, diabetes, htnTx }),
    [age, gender, chol, hdl, sbp, smoker, diabetes, htnTx],
  );
  const severity = result.score > 20 ? "high" : result.score > 10 ? "medium" : "low";

  const interventions = [
    smoker && { text: "Smoking cessation", impact: "−30% risk", color: "text-emerald-400" },
    chol > 200 && { text: "Statin therapy + diet", impact: "−25% risk", color: "text-emerald-400" },
    sbp > 140 && { text: "BP control < 130/80", impact: "−20% risk", color: "text-emerald-400" },
    hdl < 40 && { text: "Aerobic exercise 150 min/wk", impact: "+HDL", color: "text-accent" },
    diabetes && {
      text: "Tighten glycemic control (HbA1c < 7)",
      impact: "−15% risk",
      color: "text-emerald-400",
    },
  ].filter(Boolean) as { text: string; impact: string; color: string }[];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-strong rounded-3xl p-6 space-y-5">
        <h2 className="font-display text-2xl">Framingham CVD — Patient Inputs</h2>

        <div>
          <Label>
            Age: <span className="text-accent">{age}</span>
          </Label>
          <Slider
            value={[age]}
            min={30}
            max={79}
            onValueChange={(v) => setAge(v[0])}
            className="mt-3"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Gender</Label>
            <div className="mt-2 flex gap-2">
              {(["M", "F"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2 rounded-xl text-sm transition-smooth ${gender === g ? "bg-primary text-primary-foreground" : "glass"}`}
                >
                  {g === "M" ? "Male" : "Female"}
                </button>
              ))}
            </div>
          </div>
          <NumField label="SBP (mmHg)" value={sbp} onChange={setSbp} />
          <NumField label="Total Chol (mg/dL)" value={chol} onChange={setChol} />
          <NumField label="HDL (mg/dL)" value={hdl} onChange={setHdl} />
        </div>

        <div className="space-y-3 pt-2">
          <ToggleRow label="Current smoker" value={smoker} onChange={setSmoker} />
          <ToggleRow label="Diabetes mellitus" value={diabetes} onChange={setDiabetes} />
          <ToggleRow label="On hypertension treatment" value={htnTx} onChange={setHtnTx} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-strong rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">10-Year CVD Risk</h2>
            <SeverityBadge severity={severity} />
          </div>
          <div className="grid place-items-center py-4">
            <RadialScore value={result.score} max={40} />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {result.points} risk points ·{" "}
            {severity === "high"
              ? "Aggressive prevention warranted"
              : severity === "medium"
                ? "Targeted prevention"
                : "Standard monitoring"}
          </p>
        </div>

        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-lg mb-3">Factor breakdown</h3>
          <div className="space-y-2">
            {result.factors.map((f) => (
              <div key={f.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{f.name}</span>
                  <span
                    className={`text-xs ${f.weight === "high" ? "text-red-400" : f.weight === "medium" ? "text-accent" : "text-muted-foreground"}`}
                  >
                    {f.weight}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${f.weight === "high" ? "bg-red-400" : f.weight === "medium" ? "bg-accent" : "bg-emerald-400"}`}
                    style={{ width: `${Math.min(100, f.impact)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {interventions.length > 0 && (
          <div className="glass rounded-3xl p-6 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="size-5 text-accent" />
              <h3 className="font-display text-lg">Recommended interventions</h3>
            </div>
            <ul className="space-y-2">
              {interventions.map((i) => (
                <li key={i.text} className="flex items-center justify-between text-sm">
                  <span>{i.text}</span>
                  <span className={`text-xs font-medium ${i.color}`}>{i.impact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          variant="gold"
          size="lg"
          className="w-full"
          onClick={() =>
            toast.success("Report generated", { description: "PDF export ready (demo)." })
          }
        >
          <FileDown className="size-4" /> Export PDF Report
        </Button>
      </div>
    </div>
  );
}

function ChadsCalc() {
  const [age, setAge] = useState(70);
  const [v, setV] = useState({
    chf: false,
    htn: true,
    diabetes: false,
    stroke: false,
    vascular: false,
    female: false,
  });
  const r = useMemo(() => chadsVasc({ ...v, age }), [v, age]);
  const severity = r.points >= 4 ? "high" : r.points >= 2 ? "medium" : "low";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-strong rounded-3xl p-6 space-y-5">
        <h2 className="font-display text-2xl">CHA₂DS₂-VASc — AFib Stroke Risk</h2>
        <div>
          <Label>
            Age: <span className="text-accent">{age}</span>
          </Label>
          <Slider
            value={[age]}
            min={18}
            max={95}
            onValueChange={(vv) => setAge(vv[0])}
            className="mt-3"
          />
        </div>
        {(
          [
            ["chf", "Congestive Heart Failure"],
            ["htn", "Hypertension"],
            ["diabetes", "Diabetes"],
            ["stroke", "Prior Stroke / TIA"],
            ["vascular", "Vascular Disease"],
            ["female", "Female"],
          ] as const
        ).map(([k, label]) => (
          <ToggleRow
            key={k}
            label={label}
            value={v[k as keyof typeof v]}
            onChange={(x) => setV({ ...v, [k]: x })}
          />
        ))}
      </div>

      <div className="space-y-6">
        <div className="glass-strong rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">Annual Stroke Risk</h2>
            <SeverityBadge severity={severity} />
          </div>
          <div className="grid place-items-center py-4">
            <RadialScore value={r.score} max={16} label={`Score ${r.points}`} />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {r.points >= 2
              ? "Anticoagulation strongly recommended"
              : r.points === 1
                ? "Consider anticoagulation"
                : "No anticoagulation needed"}
          </p>
        </div>

        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-lg mb-3">Component contribution</h3>
          <div className="space-y-2">
            {r.factors.map((f) => (
              <div key={f.name} className="flex items-center justify-between text-sm">
                <span>{f.name}</span>
                <span className={`${f.impact > 0 ? "text-red-400" : "text-muted-foreground"}`}>
                  {f.impact > 0
                    ? `+${Math.round(f.impact / 10)} pt${f.impact >= 20 ? "s" : ""}`
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AscvdCalc() {
  const [age, setAge] = useState(55);
  const [gender, setGender] = useState<"M" | "F">("M");
  const [race, setRace] = useState<"white" | "african-american">("white");
  const [chol, setChol] = useState(210);
  const [hdl, setHdl] = useState(50);
  const [sbp, setSbp] = useState(130);
  const [smoker, setSmoker] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [htnTx, setHtnTx] = useState(false);

  const result = useMemo(
    () =>
      ascvd({
        age,
        gender,
        race,
        totalChol: chol,
        hdl,
        sbp,
        smoker,
        diabetes,
        htnTx,
      }),
    [age, gender, race, chol, hdl, sbp, smoker, diabetes, htnTx],
  );

  const severity = result.score >= 20 ? "high" : result.score >= 7.5 ? "medium" : "low";

  const interventions = [
    smoker && {
      text: "Complete smoking cessation",
      impact: "CVD risk down 35%",
      color: "text-emerald-400",
    },
    result.score >= 7.5 && {
      text: "Statin Therapy initiation",
      impact: "Reduces ASCVD risk by 25-30%",
      color: "text-emerald-400",
    },
    sbp > 130 && {
      text: "BP Control (Target < 130/80)",
      impact: "Reduces Stroke risk by 35%",
      color: "text-emerald-400",
    },
    diabetes && {
      text: "SGLT2i or GLP-1RA therapy",
      impact: "Cardioprotection clinical benefit",
      color: "text-accent",
    },
    (chol > 200 || hdl < 40) && {
      text: "Heart-Healthy Mediterranean Diet",
      impact: "Improves lipid profiles",
      color: "text-accent",
    },
  ].filter(Boolean) as { text: string; impact: string; color: string }[];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-strong rounded-3xl p-6 space-y-5">
        <h2 className="font-display text-2xl">ASCVD 10-Yr Risk — Patient Inputs</h2>

        <div>
          <Label>
            Age: <span className="text-accent">{age}</span>
          </Label>
          <Slider
            value={[age]}
            min={40}
            max={79}
            onValueChange={(v) => setAge(v[0])}
            className="mt-3"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Gender</Label>
            <div className="mt-2 flex gap-2">
              {(["M", "F"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2 rounded-xl text-sm transition-smooth ${
                    gender === g ? "bg-primary text-primary-foreground" : "glass"
                  }`}
                >
                  {g === "M" ? "Male" : "Female"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Race</Label>
            <div className="mt-2 flex gap-2">
              {(["white", "african-american"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRace(r)}
                  className={`flex-1 py-2 px-1 rounded-xl text-xs transition-smooth capitalize ${
                    race === r ? "bg-primary text-primary-foreground" : "glass"
                  }`}
                >
                  {r === "white" ? "White/Other" : "African Amer."}
                </button>
              ))}
            </div>
          </div>
          <NumField label="SBP (mmHg)" value={sbp} onChange={setSbp} />
          <NumField label="Total Chol (mg/dL)" value={chol} onChange={setChol} />
          <NumField label="HDL (mg/dL)" value={hdl} onChange={setHdl} />
        </div>

        <div className="space-y-3 pt-2">
          <ToggleRow label="Current smoker" value={smoker} onChange={setSmoker} />
          <ToggleRow label="Diabetes mellitus" value={diabetes} onChange={setDiabetes} />
          <ToggleRow label="On hypertension treatment" value={htnTx} onChange={setHtnTx} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-strong rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">10-Year ASCVD Risk</h2>
            <SeverityBadge severity={severity} />
          </div>
          <div className="grid place-items-center py-4">
            <RadialScore value={result.score} max={100} label="10-yr ASCVD" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {severity === "high"
              ? "High Risk: Statin & aggressive lifestyle interventions indicated"
              : severity === "medium"
                ? "Borderline/Intermediate Risk: Consider statin therapy clinical discussion"
                : "Low Risk: Standard preventative counseling and primary surveillance"}
          </p>
        </div>

        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-lg mb-3">Factor contribution</h3>
          <div className="space-y-2">
            {result.factors.map((f) => (
              <div key={f.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{f.name}</span>
                  <span
                    className={`text-xs ${
                      f.weight === "high"
                        ? "text-red-400"
                        : f.weight === "medium"
                          ? "text-accent"
                          : "text-muted-foreground"
                    }`}
                  >
                    {f.weight}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      f.weight === "high"
                        ? "bg-red-400"
                        : f.weight === "medium"
                          ? "bg-accent"
                          : "bg-emerald-400"
                    }`}
                    style={{ width: `${f.impact}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {interventions.length > 0 && (
          <div className="glass rounded-3xl p-6 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="size-5 text-accent" />
              <h3 className="font-display text-lg">Recommended interventions</h3>
            </div>
            <ul className="space-y-2">
              {interventions.map((i) => (
                <li key={i.text} className="flex items-center justify-between text-sm">
                  <span>{i.text}</span>
                  <span className={`text-xs font-medium ${i.color}`}>{i.impact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          variant="gold"
          size="lg"
          className="w-full"
          onClick={() =>
            toast.success("Report generated", {
              description: "10-Yr ASCVD Risk PDF ready for download.",
            })
          }
        >
          <FileDown className="size-4" /> Export ASCVD Report
        </Button>
      </div>
    </div>
  );
}

function HasBledCalc() {
  const [age, setAge] = useState(70);
  const [v, setV] = useState({
    htn: true,
    renal: false,
    liver: false,
    stroke: false,
    bleeding: false,
    inr: false,
    drugs: false,
    alcohol: false,
  });

  const result = useMemo(() => hasbled({ ...v, age }), [v, age]);
  const severity = result.points >= 3 ? "high" : "medium";

  const interventions = [
    v.htn && {
      text: "Aggressive BP Control (Target < 130/80)",
      impact: "Corrects 1 HAS-BLED point",
      color: "text-emerald-400",
    },
    v.drugs && {
      text: "Deprescribe NSAIDs/Antiplatelets where possible",
      impact: "Corrects 1 HAS-BLED point",
      color: "text-emerald-400",
    },
    v.alcohol && {
      text: "Alcohol moderation (< 8 drinks/week)",
      impact: "Corrects 1 HAS-BLED point",
      color: "text-emerald-400",
    },
    v.inr && {
      text: "INR Monitoring (TTR > 70%) or switch to DOAC",
      impact: "Mitigates labile INR factor",
      color: "text-accent",
    },
  ].filter(Boolean) as { text: string; impact: string; color: string }[];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-strong rounded-3xl p-6 space-y-5">
        <h2 className="font-display text-2xl">HAS-BLED — Anticoagulation Bleed Risk</h2>

        <div>
          <Label>
            Age: <span className="text-accent">{age}</span>
          </Label>
          <Slider
            value={[age]}
            min={18}
            max={95}
            onValueChange={(vv) => setAge(vv[0])}
            className="mt-3"
          />
        </div>

        {(
          [
            ["htn", "Hypertension (Systolic BP >= 160)"],
            ["renal", "Abnormal Kidney Function (dialysis/Cr>200)"],
            ["liver", "Abnormal Liver Function (cirrhosis/bilirubin>2x)"],
            ["stroke", "Prior Stroke / Transient Ischemic Attack"],
            ["bleeding", "Prior Bleed Event or Anemia predisposition"],
            ["inr", "Labile INR (TTR < 60% if on Warfarin)"],
            ["drugs", "Predisposing Medications (NSAIDs, Aspirin)"],
            ["alcohol", "Alcohol Excess (>= 8 drinks/week)"],
          ] as const
        ).map(([k, label]) => (
          <ToggleRow
            key={k}
            label={label}
            value={v[k as keyof typeof v]}
            onChange={(x) => setV({ ...v, [k]: x })}
          />
        ))}
      </div>

      <div className="space-y-6">
        <div className="glass-strong rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">Annual Major Bleed Risk</h2>
            <SeverityBadge severity={severity} />
          </div>
          <div className="grid place-items-center py-4">
            <RadialScore value={result.score} max={15} label={`Score ${result.points} / 9`} />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {severity === "high"
              ? "High Bleeding Risk (Score >= 3): Close monitoring & correctable factors mitigation warranted"
              : "Moderate Bleeding Risk (Score 1-2): Periodic reviews and correctable risk factor suppression"}
          </p>
        </div>

        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-lg mb-3">Factor contribution</h3>
          <div className="space-y-2">
            {result.factors.map((f) => (
              <div key={f.name} className="flex items-center justify-between text-sm">
                <span>{f.name}</span>
                <span className={`${f.impact > 0 ? "text-red-400" : "text-muted-foreground"}`}>
                  {f.impact > 0 ? `+${f.impact > 15 ? 2 : 1} pt` : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {interventions.length > 0 && (
          <div className="glass rounded-3xl p-6 bg-gradient-to-br from-red-500/10 to-transparent">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="size-5 text-accent" />
              <h3 className="font-display text-lg">Bleed Mitigation Interventions</h3>
            </div>
            <ul className="space-y-2">
              {interventions.map((i) => (
                <li key={i.text} className="flex items-center justify-between text-sm">
                  <span>{i.text}</span>
                  <span className={`text-xs font-medium ${i.color}`}>{i.impact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          variant="gold"
          size="lg"
          className="w-full"
          onClick={() =>
            toast.success("Bleeding risk report generated", {
              description: "PDF score record ready for EMR upload.",
            })
          }
        >
          <FileDown className="size-4" /> Export Bleeding Risk Report
        </Button>
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 bg-transparent border-white/10"
      />
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
      <span className="text-sm">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
