// Simplified clinical risk model formulas. Educational use only.

export type FraminghamInput = {
  age: number;
  gender: "M" | "F";
  totalChol: number;
  hdl: number;
  sbp: number;
  smoker: boolean;
  diabetes: boolean;
  htnTx: boolean;
};

export function framingham(i: FraminghamInput) {
  // Simplified D'Agostino 2008 general CVD points-based system.
  const isM = i.gender === "M";
  let p = 0;
  // Age
  const ageBands = isM
    ? [
        [30, 34, 0],
        [35, 39, 2],
        [40, 44, 5],
        [45, 49, 6],
        [50, 54, 8],
        [55, 59, 10],
        [60, 64, 11],
        [65, 69, 12],
        [70, 74, 14],
        [75, 79, 15],
      ]
    : [
        [30, 34, 0],
        [35, 39, 2],
        [40, 44, 4],
        [45, 49, 5],
        [50, 54, 7],
        [55, 59, 8],
        [60, 64, 9],
        [65, 69, 10],
        [70, 74, 11],
        [75, 79, 12],
      ];
  for (const [lo, hi, pts] of ageBands) if (i.age >= lo && i.age <= hi) p += pts as number;
  // HDL
  if (i.hdl < 35) p += 2;
  else if (i.hdl < 45) p += 1;
  else if (i.hdl >= 60) p -= 1;
  // Total chol
  if (i.totalChol >= 280) p += isM ? 3 : 4;
  else if (i.totalChol >= 240) p += isM ? 2 : 3;
  else if (i.totalChol >= 200) p += 1;
  // SBP
  if (i.sbp >= 160) p += i.htnTx ? (isM ? 5 : 6) : isM ? 3 : 4;
  else if (i.sbp >= 140) p += i.htnTx ? (isM ? 4 : 5) : isM ? 2 : 3;
  else if (i.sbp >= 130) p += i.htnTx ? 2 : 1;
  else if (i.sbp >= 120) p += 1;
  // Smoker / diabetes
  if (i.smoker) p += isM ? 4 : 3;
  if (i.diabetes) p += isM ? 3 : 4;

  // Map points to 10-yr risk %
  const map: Record<number, number> = {
    0: 1,
    2: 2,
    4: 3,
    6: 4,
    8: 6,
    10: 8,
    12: 12,
    14: 18,
    16: 25,
    18: 30,
    20: 35,
  };
  const keys = Object.keys(map)
    .map(Number)
    .sort((a, b) => a - b);
  let risk = 1;
  for (const k of keys) if (p >= k) risk = map[k];
  if (p >= 22) risk = 40;
  if (p < 0) risk = 1;

  const factors = [
    { name: "Age", impact: Math.min(40, i.age - 30), weight: "high" },
    {
      name: "Cholesterol",
      impact: Math.max(0, (i.totalChol - 180) / 4),
      weight: i.totalChol > 240 ? "high" : "medium",
    },
    { name: "HDL", impact: Math.max(0, (50 - i.hdl) * 0.8), weight: i.hdl < 40 ? "high" : "low" },
    {
      name: "Blood Pressure",
      impact: Math.max(0, (i.sbp - 120) * 0.5),
      weight: i.sbp >= 140 ? "high" : "medium",
    },
    { name: "Smoking", impact: i.smoker ? 25 : 0, weight: i.smoker ? "high" : "low" },
    { name: "Diabetes", impact: i.diabetes ? 22 : 0, weight: i.diabetes ? "high" : "low" },
  ];
  return { score: Math.min(40, risk), points: p, factors };
}

export type ChadsInput = {
  chf: boolean;
  htn: boolean;
  age: number;
  diabetes: boolean;
  stroke: boolean;
  vascular: boolean;
  female: boolean;
};
export function chadsVasc(i: ChadsInput) {
  let s = 0;
  if (i.chf) s += 1;
  if (i.htn) s += 1;
  if (i.age >= 75) s += 2;
  else if (i.age >= 65) s += 1;
  if (i.diabetes) s += 1;
  if (i.stroke) s += 2;
  if (i.vascular) s += 1;
  if (i.female) s += 1;
  const annualRisk = [0, 1.3, 2.2, 3.2, 4.0, 6.7, 9.8, 9.6, 6.7, 15.2][Math.min(s, 9)];
  const factors = [
    { name: "CHF", impact: i.chf ? 10 : 0, weight: i.chf ? "high" : "low" },
    { name: "Hypertension", impact: i.htn ? 10 : 0, weight: i.htn ? "high" : "low" },
    {
      name: "Age",
      impact: i.age >= 75 ? 20 : i.age >= 65 ? 10 : 0,
      weight: i.age >= 75 ? "high" : "medium",
    },
    { name: "Diabetes", impact: i.diabetes ? 10 : 0, weight: i.diabetes ? "high" : "low" },
    { name: "Prior Stroke/TIA", impact: i.stroke ? 20 : 0, weight: i.stroke ? "high" : "low" },
    {
      name: "Vascular Disease",
      impact: i.vascular ? 10 : 0,
      weight: i.vascular ? "medium" : "low",
    },
    { name: "Sex (Female)", impact: i.female ? 10 : 0, weight: "low" },
  ];
  return { score: annualRisk, points: s, factors };
}

export type AscvdInput = {
  age: number;
  gender: "M" | "F";
  race: "white" | "african-american";
  totalChol: number;
  hdl: number;
  sbp: number;
  smoker: boolean;
  diabetes: boolean;
  htnTx: boolean;
};

export function ascvd(i: AscvdInput) {
  const lnAge = Math.log(i.age);
  const lnTotalChol = Math.log(i.totalChol);
  const lnHDL = Math.log(i.hdl);
  const lnSBP = Math.log(i.sbp);

  let s = 0;
  let s10 = 0.9;
  let meanIndX = 0;

  const isFemale = i.gender === "F";
  const isWhite = i.race === "white";

  if (isFemale) {
    if (isWhite) {
      // White Female
      s =
        -29.799 * lnAge +
        4.884 * lnAge * lnAge +
        13.54 * lnTotalChol -
        3.114 * lnAge * lnTotalChol -
        13.578 * lnHDL +
        3.149 * lnAge * lnHDL +
        (i.htnTx ? 2.019 * lnSBP : 1.957 * lnSBP) +
        (i.smoker ? 7.574 - 1.665 * lnAge : 0) +
        (i.diabetes ? 0.661 : 0);
      s10 = 0.9665;
      meanIndX = -29.18;
    } else {
      // African American Female
      s =
        17.114 * lnAge +
        0 * lnAge * lnAge +
        0.939 * lnTotalChol +
        0 * lnAge * lnTotalChol -
        18.92 * lnHDL +
        4.475 * lnAge * lnHDL +
        (i.htnTx
          ? 29.291 * lnSBP - 6.432 * lnAge * lnSBP
          : 27.285 * lnSBP - 6.096 * lnAge * lnSBP) +
        (i.smoker ? 0.691 : 0) +
        (i.diabetes ? 0.874 : 0);
      s10 = 0.9533;
      meanIndX = 86.61;
    }
  } else {
    if (isWhite) {
      // White Male
      s =
        12.344 * lnAge +
        11.853 * lnTotalChol -
        2.664 * lnAge * lnTotalChol -
        7.99 * lnHDL +
        1.769 * lnAge * lnHDL +
        (i.htnTx ? 1.998 * lnSBP : 1.764 * lnSBP) +
        (i.smoker ? 7.837 - 1.795 * lnAge : 0) +
        (i.diabetes ? 0.658 : 0);
      s10 = 0.9144;
      meanIndX = 61.18;
    } else {
      // African American Male
      s =
        2.469 * lnAge +
        0.302 * lnTotalChol +
        0 * lnAge * lnTotalChol -
        0.307 * lnHDL +
        0 * lnAge * lnHDL +
        (i.htnTx ? 1.916 * lnSBP : 1.809 * lnSBP) +
        (i.smoker ? 0.549 : 0) +
        (i.diabetes ? 0.645 : 0);
      s10 = 0.8954;
      meanIndX = 19.54;
    }
  }

  const risk = 1 - Math.pow(s10, Math.exp(s - meanIndX));
  const score = Math.round(risk * 1000) / 10;

  const factors = [
    {
      name: "Age Factor",
      impact: Math.min(50, Math.max(10, (i.age - 40) * 1.5)),
      weight: i.age >= 65 ? "high" : "medium",
    },
    {
      name: "Lipid Ratio (Total/HDL)",
      impact: Math.min(40, Math.max(5, (i.totalChol / i.hdl) * 5)),
      weight: i.totalChol > 240 || i.hdl < 40 ? "high" : "medium",
    },
    {
      name: "Blood Pressure Load",
      impact: Math.min(30, Math.max(5, (i.sbp - 110) * 0.7)),
      weight: i.sbp >= 140 ? "high" : "medium",
    },
    {
      name: "Smoking Status",
      impact: i.smoker ? 25 : 0,
      weight: i.smoker ? "high" : "low",
    },
    {
      name: "Diabetes Status",
      impact: i.diabetes ? 22 : 0,
      weight: i.diabetes ? "high" : "low",
    },
  ];

  return { score: Math.min(100, Math.max(0.1, score)), factors };
}

export type HasBledInput = {
  htn: boolean;
  renal: boolean;
  liver: boolean;
  stroke: boolean;
  bleeding: boolean;
  inr: boolean;
  age: number;
  drugs: boolean;
  alcohol: boolean;
};

export function hasbled(i: HasBledInput) {
  let p = 0;
  if (i.htn) p += 1;
  if (i.renal) p += 1;
  if (i.liver) p += 1;
  if (i.stroke) p += 1;
  if (i.bleeding) p += 1;
  if (i.inr) p += 1;
  if (i.age >= 65) p += 1;
  if (i.drugs) p += 1;
  if (i.alcohol) p += 1;

  const bleedRisk = [1.13, 1.02, 1.88, 3.74, 8.7, 12.5, 12.5, 12.5, 12.5, 12.5][Math.min(p, 9)];

  const factors = [
    {
      name: "Hypertension (BP > 160)",
      impact: i.htn ? 15 : 0,
      weight: i.htn ? "high" : "low",
    },
    {
      name: "Renal/Liver Impairment",
      impact: (i.renal ? 10 : 0) + (i.liver ? 10 : 0),
      weight: i.renal || i.liver ? "high" : "low",
    },
    {
      name: "Prior Stroke / Hemorrhage",
      impact: i.stroke ? 20 : 0,
      weight: i.stroke ? "high" : "low",
    },
    {
      name: "Bleeding History / INR",
      impact: (i.bleeding ? 15 : 0) + (i.inr ? 10 : 0),
      weight: i.bleeding || i.inr ? "high" : "low",
    },
    {
      name: "Elderly Status (Age >= 65)",
      impact: i.age >= 65 ? 10 : 0,
      weight: i.age >= 65 ? "medium" : "low",
    },
    {
      name: "Predisposing Meds / Alcohol",
      impact: (i.drugs ? 10 : 0) + (i.alcohol ? 10 : 0),
      weight: i.drugs || i.alcohol ? "medium" : "low",
    },
  ];

  return { score: bleedRisk, points: p, factors };
}
