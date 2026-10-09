import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import * as api from '@/services/api';

export default function PatientManagement() {
  const [patients, setPatients] = useState([] as any[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', age: '' });

  const fetchPatients = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getPatients();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    const ok = await api.testConnection();
    alert(ok ? '✅ Backend is connected!' : '❌ Cannot reach backend');
  };

  const handleAddPatient = async (e: any) => {
    e.preventDefault();
    if (!formData.name || !formData.age) {
      setError('Name and age are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.addPatient({ name: formData.name, age: Number(formData.age) });
      setFormData({ name: '', age: '' });
      await fetchPatients();
    } catch (err) {
      console.error('Error adding patient:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    setLoading(true);
    try {
      await api.deletePatient(id);
      await fetchPatients();
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-accent">Patients</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">Patient registry</h1>
          
        </div>
        <Button variant="gold" onClick={testConnection} size="lg">
          Test Backend Connection
        </Button>
      </div>

      {error && (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive shadow-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card className="glass-strong rounded-3xl border border-white/10 shadow-2xl shadow-black/10">
          <CardHeader className="space-y-3 p-6">
            <CardTitle className="text-2xl">Add New Patient</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Enter the name and age for a new patient record.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-6 pt-0">
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter patient name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Age</label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter age"
                  min={0}
                />
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading ? 'Adding patient...' : 'Add patient'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass rounded-3xl border border-white/10 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Patient list</p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">{patients.length} records</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground">
                  {loading ? 'Refreshing' : 'Live data'}
                </span>
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-background/80 shadow-sm">
                <table className="min-w-full text-left text-sm text-muted-foreground">
                  <thead className="bg-accent/10 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Age</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 bg-background/90">
                    {patients.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No patients found.
                        </td>
                      </tr>
                    ) : (
                      patients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-white/5">
                          <td className="px-4 py-4 font-medium text-foreground">{patient.id}</td>
                          <td className="px-4 py-4 text-foreground">{patient.name}</td>
                          <td className="px-4 py-4">{patient.age}</td>
                          <td className="px-4 py-4">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePatient(patient.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
