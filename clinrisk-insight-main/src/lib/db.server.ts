import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import initSqlJs, { type Database as SQLDatabase } from "sql.js";
import { patients as samplePatients, type NewPatientInput, type Patient } from "./sample-data";

const projectRoot = process.cwd();
const dataDir = path.resolve(projectRoot, "data");
const dbPath = path.join(dataDir, "clinrisk.db");
const wasmPath = path.resolve(projectRoot, "node_modules/sql.js/dist/sql-wasm.wasm");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let dbPromise: Promise<SQLDatabase> | null = null;

async function openDatabase(): Promise<SQLDatabase> {
  const SQL = await initSqlJs({
    locateFile: () => wasmPath,
  });

  const database = fs.existsSync(dbPath)
    ? new SQL.Database(new Uint8Array(fs.readFileSync(dbPath)))
    : new SQL.Database();

  database.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      condition TEXT NOT NULL,
      assignedDoctor TEXT NOT NULL,
      nextAppointment TEXT NOT NULL,
      bp TEXT NOT NULL,
      hr INTEGER NOT NULL,
      bmi REAL NOT NULL,
      hba1c REAL NOT NULL,
      cholesterol INTEGER NOT NULL,
      hdl INTEGER NOT NULL,
      smoker INTEGER NOT NULL,
      diabetes INTEGER NOT NULL,
      htnTx INTEGER NOT NULL,
      riskScore INTEGER NOT NULL,
      severity TEXT NOT NULL,
      lastVisit TEXT NOT NULL
    );
  `);

  ensureSchema(database);
  migrateLegacyData(database);

  const countResult = database.exec("SELECT COUNT(*) AS count FROM patients;");
  const existingCount = countResult[0]?.values?.[0]?.[0] ?? 0;

  if (!existingCount) {
    const insert = database.prepare(`
      INSERT INTO patients (
        id, name, age, gender, condition, assignedDoctor, nextAppointment,
        bp, hr, bmi, hba1c, cholesterol, hdl, smoker, diabetes,
        htnTx, riskScore, severity, lastVisit
      ) VALUES (
        @id, @name, @age, @gender, @condition, @assignedDoctor, @nextAppointment,
        @bp, @hr, @bmi, @hba1c, @cholesterol, @hdl, @smoker, @diabetes,
        @htnTx, @riskScore, @severity, @lastVisit
      );
    `);

    database.run("BEGIN TRANSACTION;");
    for (const patient of samplePatients) {
      insert.run({
        ...patient,
        smoker: patient.smoker ? 1 : 0,
        diabetes: patient.diabetes ? 1 : 0,
        htnTx: patient.htnTx ? 1 : 0,
        assignedDoctor: patient.assignedDoctor ?? "Unassigned",
        nextAppointment: patient.nextAppointment ?? "Pending",
      });
    }
    database.run("COMMIT;");

    saveDatabase(database);
  }

  return database;
}

function getSeverity(riskScore: number): Patient["severity"] {
  return riskScore > 25 ? "high" : riskScore > 12 ? "medium" : "low";
}

function ensureSchema(database: SQLDatabase) {
  const result = database.exec("PRAGMA table_info(patients);");
  const existingColumns = new Set(
    result[0]?.values?.map((row) => String(row[1])) ?? [],
  );

  if (!existingColumns.has("assignedDoctor")) {
    database.run("ALTER TABLE patients ADD COLUMN assignedDoctor TEXT NOT NULL DEFAULT 'Unassigned';");
  }
  if (!existingColumns.has("nextAppointment")) {
    database.run("ALTER TABLE patients ADD COLUMN nextAppointment TEXT NOT NULL DEFAULT 'Pending';");
  }
}

function migrateLegacyData(database: SQLDatabase) {
  database.run("UPDATE patients SET assignedDoctor='Unassigned' WHERE assignedDoctor IS NULL;");
  database.run("UPDATE patients SET nextAppointment='Pending' WHERE nextAppointment IS NULL;");
  database.run("UPDATE patients SET name='Unnamed patient' WHERE name IS NULL;");
  database.run("UPDATE patients SET condition='Unknown' WHERE condition IS NULL;");
  database.run("UPDATE patients SET bp='N/A' WHERE bp IS NULL;");
}

function saveDatabase(database: SQLDatabase) {
  fs.writeFileSync(dbPath, Buffer.from(database.export()));
}

function validateNewPatient(data: NewPatientInput) {
  if (!data.name?.trim()) {
    throw new Error("Patient name is required.");
  }
  if (!data.condition?.trim()) {
    throw new Error("Patient condition is required.");
  }
  if (!data.assignedDoctor?.trim()) {
    throw new Error("Assigned doctor is required.");
  }
  if (!data.nextAppointment?.trim()) {
    throw new Error("Next appointment date is required.");
  }
  if (!data.bp?.trim()) {
    throw new Error("Blood pressure is required.");
  }
  if (data.age <= 0) {
    throw new Error("Age must be greater than 0.");
  }
}

function computeRiskScore(data: NewPatientInput): number {
  const sizeScore = Math.round(data.bmi * 1.1 + data.age * 0.2);
  const labScore = Math.round(data.hba1c * 2 + (data.cholesterol - 150) * 0.1 + data.hdl * 0.05);
  const behaviorScore = (data.smoker ? 10 : 0) + (data.diabetes ? 12 : 0) + (data.htnTx ? 5 : 0);
  return Math.min(99, Math.max(1, sizeScore + labScore + behaviorScore));
}

async function getDatabase(): Promise<SQLDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabase();
  }
  return dbPromise;
}

export async function addPatient(data: NewPatientInput): Promise<Patient> {
  validateNewPatient(data);
  const database = await getDatabase();
  const riskScore = computeRiskScore(data);
  const patient: Patient = {
    id: randomUUID(),
    ...data,
    riskScore,
    severity: getSeverity(riskScore),
    lastVisit: "Today",
  };

  const insert = database.prepare(`
    INSERT INTO patients (
      id, name, age, gender, condition, assignedDoctor, nextAppointment,
      bp, hr, bmi, hba1c, cholesterol, hdl, smoker,
      diabetes, htnTx, riskScore, severity, lastVisit
    ) VALUES (
      @id, @name, @age, @gender, @condition, @assignedDoctor, @nextAppointment,
      @bp, @hr, @bmi, @hba1c, @cholesterol, @hdl, @smoker,
      @diabetes, @htnTx, @riskScore, @severity, @lastVisit
    );
  `);

  try {
    database.run("BEGIN TRANSACTION;");
    insert.run({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      condition: patient.condition,
      assignedDoctor: patient.assignedDoctor,
      nextAppointment: patient.nextAppointment,
      bp: patient.bp,
      hr: patient.hr,
      bmi: patient.bmi,
      hba1c: patient.hba1c,
      cholesterol: patient.cholesterol,
      hdl: patient.hdl,
      smoker: patient.smoker ? 1 : 0,
      diabetes: patient.diabetes ? 1 : 0,
      htnTx: patient.htnTx ? 1 : 0,
      riskScore: patient.riskScore,
      severity: patient.severity,
      lastVisit: patient.lastVisit,
    });
    database.run("COMMIT;");
  } catch (error) {
    database.run("ROLLBACK;");
    throw error;
  }

  saveDatabase(database);
  return patient;
}

export async function updatePatient(patient: Patient): Promise<Patient> {
  validateNewPatient(patient);
  const database = await getDatabase();

  const updater = database.prepare(`
    UPDATE patients SET
      name = @name,
      age = @age,
      gender = @gender,
      condition = @condition,
      assignedDoctor = @assignedDoctor,
      nextAppointment = @nextAppointment,
      bp = @bp,
      hr = @hr,
      bmi = @bmi,
      hba1c = @hba1c,
      cholesterol = @cholesterol,
      hdl = @hdl,
      smoker = @smoker,
      diabetes = @diabetes,
      htnTx = @htnTx,
      riskScore = @riskScore,
      severity = @severity,
      lastVisit = @lastVisit
    WHERE id = @id;
  `);

  try {
    database.run("BEGIN TRANSACTION;");
    updater.run({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      condition: patient.condition,
      assignedDoctor: patient.assignedDoctor,
      nextAppointment: patient.nextAppointment,
      bp: patient.bp,
      hr: patient.hr,
      bmi: patient.bmi,
      hba1c: patient.hba1c,
      cholesterol: patient.cholesterol,
      hdl: patient.hdl,
      smoker: patient.smoker ? 1 : 0,
      diabetes: patient.diabetes ? 1 : 0,
      htnTx: patient.htnTx ? 1 : 0,
      riskScore: patient.riskScore,
      severity: patient.severity,
      lastVisit: patient.lastVisit,
    });
    database.run("COMMIT;");
  } catch (error) {
    database.run("ROLLBACK;");
    throw error;
  }

  saveDatabase(database);
  return patient;
}

function rowToPatient(row: Record<string, unknown>): Patient {
  return {
    id: String(row.id),
    name: String(row.name),
    age: Number(row.age),
    gender: row.gender === "F" ? "F" : "M",
    condition: String(row.condition),
    bp: String(row.bp),
    hr: Number(row.hr),
    bmi: Number(row.bmi),
    hba1c: Number(row.hba1c),
    cholesterol: Number(row.cholesterol),
    hdl: Number(row.hdl),
    smoker: Boolean(Number(row.smoker)),
    diabetes: Boolean(Number(row.diabetes)),
    htnTx: Boolean(Number(row.htnTx)),
    assignedDoctor: String(row.assignedDoctor),
    nextAppointment: String(row.nextAppointment),
    riskScore: Number(row.riskScore),
    severity: String(row.severity) as Patient["severity"],
    lastVisit: String(row.lastVisit),
  };
}

function exportPatients([results]: { columns: string[]; values: unknown[][] }[]) {
  if (!results) return [] as Patient[];
  const { columns, values } = results;
  return values.map((valueRow) => {
    const row = Object.fromEntries(columns.map((col, index) => [col, valueRow[index]]));
    return rowToPatient(row);
  });
}

export async function getPatients(): Promise<Patient[]> {
  if (!dbPromise) {
    dbPromise = openDatabase();
  }
  const database = await dbPromise;
  const results = database.exec("SELECT * FROM patients ORDER BY name ASC");
  return exportPatients(results);
}
