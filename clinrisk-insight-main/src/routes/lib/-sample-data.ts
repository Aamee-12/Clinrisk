export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F";
  condition: string;
  bp: string;
  hr: number;
  bmi: number;
  hba1c: number;
  cholesterol: number;
  hdl: number;
  smoker: boolean;
  diabetes: boolean;
  htnTx: boolean;
  riskScore: number;
  severity: "low" | "medium" | "high";
  lastVisit: string;
};

const conditions = [
  "Hypertension",
  "Type 2 Diabetes",
  "CAD",
  "AFib",
  "Hyperlipidemia",
  "Pre-diabetes",
  "CHF",
  "COPD",
];
const firstNames = [
  "John",
  "Mary",
  "David",
  "Sarah",
  "Michael",
  "Emma",
  "James",
  "Olivia",
  "Robert",
  "Sophia",
  "William",
  "Ava",
  "Richard",
  "Isabella",
  "Thomas",
  "Mia",
  "Charles",
  "Charlotte",
  "Daniel",
  "Amelia",
  "Matthew",
  "Harper",
  "Anthony",
  "Evelyn",
  "Mark",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
];

function seeded(i: number) {
  const x = Math.sin(i * 9999) * 10000;
  return x - Math.floor(x);
}

export const patients: Patient[] = Array.from({ length: 25 }, (_, i) => {
  const r = seeded(i + 1);
  const r2 = seeded(i + 100);
  const age = 35 + Math.floor(r * 50);
  const risk = Math.floor(r2 * 45) + 5;
  const severity: Patient["severity"] = risk > 25 ? "high" : risk > 12 ? "medium" : "low";
  return {
    id: `PT-${String(1000 + i)}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`,
    age,
    gender: r > 0.5 ? "M" : "F",
    condition: conditions[i % conditions.length],
    bp: `${110 + Math.floor(r * 50)}/${70 + Math.floor(r2 * 25)}`,
    hr: 60 + Math.floor(r * 40),
    bmi: Number((22 + r * 12).toFixed(1)),
    hba1c: Number((5.2 + r2 * 3.5).toFixed(1)),
    cholesterol: 150 + Math.floor(r * 120),
    hdl: 35 + Math.floor(r2 * 35),
    smoker: r > 0.7,
    diabetes: r2 > 0.6,
    htnTx: r > 0.5,
    riskScore: risk,
    severity,
    lastVisit: `${1 + Math.floor(r * 28)} days ago`,
  };
});

export const vitalsTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  bp: 120 + Math.round(Math.sin(i / 2) * 8),
  risk: 18 + Math.round(Math.cos(i / 3) * 6),
}));

export const analysesData = [
  { day: "Mon", count: 32 },
  { day: "Tue", count: 41 },
  { day: "Wed", count: 28 },
  { day: "Thu", count: 56 },
  { day: "Fri", count: 47 },
  { day: "Sat", count: 22 },
  { day: "Sun", count: 18 },
];

export const riskModels = [
  {
    id: "framingham",
    name: "Framingham CVD",
    desc: "10-year cardiovascular risk",
    icon: "Heart",
    color: "from-red-500/20 to-orange-500/10",
  },
  {
    id: "chadsvasc",
    name: "CHA₂DS₂-VASc",
    desc: "Stroke risk in AFib",
    icon: "Activity",
    color: "from-purple-500/20 to-pink-500/10",
  },
  {
    id: "qrisk3",
    name: "QRISK3",
    desc: "10-year CVD (UK)",
    icon: "TrendingUp",
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    id: "ascvd",
    name: "ASCVD",
    desc: "Atherosclerotic CVD",
    icon: "Zap",
    color: "from-amber-500/20 to-yellow-500/10",
  },
  {
    id: "diabetes10",
    name: "Diabetes 10-yr",
    desc: "Type 2 diabetes risk",
    icon: "Droplet",
    color: "from-sky-500/20 to-blue-500/10",
  },
  {
    id: "hasbled",
    name: "HAS-BLED",
    desc: "Bleeding risk anticoag",
    icon: "AlertTriangle",
    color: "from-rose-500/20 to-red-500/10",
  },
  {
    id: "wells",
    name: "Wells DVT",
    desc: "DVT probability",
    icon: "Stethoscope",
    color: "from-emerald-500/20 to-green-500/10",
  },
  {
    id: "charlson",
    name: "Charlson Index",
    desc: "Comorbidity mortality",
    icon: "ClipboardList",
    color: "from-violet-500/20 to-purple-500/10",
  },
  {
    id: "grace",
    name: "GRACE",
    desc: "ACS mortality risk",
    icon: "HeartPulse",
    color: "from-pink-500/20 to-rose-500/10",
  },
  {
    id: "sofa",
    name: "SOFA",
    desc: "Organ failure ICU",
    icon: "Gauge",
    color: "from-indigo-500/20 to-violet-500/10",
  },
  {
    id: "meld",
    name: "MELD",
    desc: "Liver disease severity",
    icon: "FlaskConical",
    color: "from-teal-500/20 to-emerald-500/10",
  },
  {
    id: "curb65",
    name: "CURB-65",
    desc: "Pneumonia severity",
    icon: "Wind",
    color: "from-cyan-500/20 to-sky-500/10",
  },
];
