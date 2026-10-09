#!/usr/bin/env node

/**
 * Quick Reference: Fetch Examples for Frontend
 * Copy and paste these into your React components to interact with the backend
 */

// ============================================
// 1. TEST CONNECTION
// ============================================
async function testBackendConnection() {
  try {
    const response = await fetch('http://localhost:3001/api/test');
    const data = await response.json();
    console.log('✅ Backend Status:', data);
    return data;
  } catch (error) {
    console.error('❌ Connection Error:', error);
  }
}

// Usage: testBackendConnection();

// ============================================
// 2. GET ALL PATIENTS
// ============================================
async function getAllPatients() {
  try {
    const response = await fetch('http://localhost:3001/api/patients');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Patients:', data.data);
    return data.data;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Usage: getAllPatients();

// ============================================
// 3. GET SINGLE PATIENT BY ID
// ============================================
async function getPatientById(id) {
  try {
    const response = await fetch(`http://localhost:3001/api/patients/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Patient:', data.data);
    return data.data;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Usage: getPatientById(1);

// ============================================
// 4. ADD NEW PATIENT
// ============================================
async function addPatient(name, age, condition) {
  try {
    const response = await fetch('http://localhost:3001/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        age: age,
        condition: condition,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Patient Added:', data.data);
    return data.data;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Usage: addPatient('Jane Doe', 35, 'Diabetes');

// ============================================
// 5. UPDATE PATIENT
// ============================================
async function updatePatient(id, name, age, condition) {
  try {
    const response = await fetch(`http://localhost:3001/api/patients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        age: age,
        condition: condition,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Patient Updated:', data.data);
    return data.data;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Usage: updatePatient(1, 'John Updated', 46, 'High Blood Pressure');

// ============================================
// 6. DELETE PATIENT
// ============================================
async function deletePatient(id) {
  try {
    const response = await fetch(`http://localhost:3001/api/patients/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Patient Deleted:', data.message);
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Usage: deletePatient(1);

// ============================================
// REACT COMPONENT EXAMPLE - USING HOOKS
// ============================================

/*
import { useState, useEffect } from 'react';

function MyPatientComponent() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load patients on mount
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/patients');
      const data = await response.json();
      if (data.success) {
        setPatients(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Patient',
          age: 40,
          condition: 'Condition',
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Patient added!');
        loadPatients(); // Refresh list
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Patients: {patients.length}</h1>
      <button onClick={handleAddPatient}>Add Patient</button>
      
      <ul>
        {patients.map(patient => (
          <li key={patient.id}>
            {patient.name} - Age: {patient.age} - {patient.condition}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyPatientComponent;
*/
