import "@tanstack/react-start/server-only";
import initSqlJs, { type Database as SQLDatabase } from "sql.js";
import { patients as samplePatients, type Patient } from "./sample-data";

let dbPromise: Promise<SQLDatabase> | null = null;

async function openDatabase(): Promise<SQLDatabase> {
  const [{ default: fs }, { default: path }, { fileURLToPath }] = await Promise.all([
    import("fs"),
    import("path"),
    import("url"),
  ]);

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dataDir = path.resolve(__dirname, "../../data");
  const dbPath = path.join(dataDir, "clinrisk.db");
  const wasmPath = path.resolve(__dirname, "../../node_modules/sql.js/dist/sql-wasm.wasm");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

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

  const countResult = database.exec("SELECT COUNT(*) AS count FROM patients;");
  const existingCount = countResult[0]?.values?.[0]?.[0] ?? 0;

  if (!existingCount) {
    const insert = database.prepare(`
      INSERT INTO patients (
        id, name, age, gender, condition, bp, hr, bmi, hba1c,
        cholesterol, hdl, smoker, diabetes, htnTx, riskScore, severity, lastVisit
      ) VALUES (
        @id, @name, @age, @gender, @condition, @bp, @hr,
        @bmi, @hba1c, @cholesterol, @hdl, @smoker, @diabetes,
        @htnTx, @riskScore, @severity, @lastVisit
      );
    `);

    database.transaction(() => {
      for (const patient of samplePatients) {
        insert.run({
          ...patient,
          smoker: patient.smoker ? 1 : 0,
          diabetes: patient.diabetes ? 1 : 0,
          htnTx: patient.htnTx ? 1 : 0,
        });
      }
    })();

    fs.writeFileSync(dbPath, Buffer.from(database.export()));
  }

  return database;
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
    riskScore: Number(row.riskScore),
    severity: (String(row.severity) as Patient["severity"]),
    lastVisit: String(row.lastVisit),
  };
}

function exportPatients(rows: { columns: string[]; values: unknown[][] }[]) {
  if (!rows.length) return [] as Patient[];
  const { columns, values } = rows[0];
  return values.map((valueRow) => {
    const row = Object.fromEntries(columns.map((col, index) => [col, valueRow[index]]));
    return rowToPatient(row);
  });
}

function saveDatabase(database: SQLDatabase) {
  fs.writeFileSync(dbPath, Buffer.from(database.export()));
}

export async function getPatients(): Promise<Patient[]> {
  if (!dbPromise) {
    dbPromise = openDatabase();
  }
  const database = await dbPromise;
  const results = database.exec("SELECT * FROM patients ORDER BY name ASC");
  return exportPatients(results);
}
