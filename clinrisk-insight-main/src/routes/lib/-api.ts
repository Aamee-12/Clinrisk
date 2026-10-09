const API_BASE = "http://localhost:8080/api";

export async function fetchPatients() {
  const res = await fetch(`${API_BASE}/patients`);
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}
