import { BACKEND_BASE } from "../config";

export type Patient = {
  id?: string;
  name: string;
  age: number;
  gender?: string;
  conditionName?: string;
  bp?: string;
  hr?: number;
  bmi?: number;
  hba1c?: number;
  cholesterol?: number;
  hdl?: number;
  smoker?: boolean;
  diabetes?: boolean;
  htnTx?: boolean;
  riskScore?: number;
  severity?: string;
  lastVisit?: string;
};

const jsonHeaders = { "Content-Type": "application/json" };

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.statusText}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// Now pointing to Spring Boot REST endpoints at http://localhost:8080/api/patients
const API_URL = "http://localhost:8080/api/patients";

export async function getPatients(): Promise<Patient[]> {
  return requestJson<Patient[]>(API_URL, { method: "GET" });
}

export async function addPatient(p: Patient): Promise<Patient> {
  return requestJson<Patient>(API_URL, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(p),
  });
}

export async function updatePatient(p: Patient): Promise<Patient> {
  return requestJson<Patient>(`${API_URL}/${p.id}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(p),
  });
}

export async function deletePatient(id: string): Promise<void> {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

export async function testConnection(): Promise<boolean> {
  try {
    const res = await fetch(API_URL, { method: "GET" });
    return res.ok;
  } catch (e) {
    return false;
  }
}
