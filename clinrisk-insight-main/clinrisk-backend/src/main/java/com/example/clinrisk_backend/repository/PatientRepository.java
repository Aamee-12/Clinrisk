package com.example.clinrisk_backend.repository;

import com.example.clinrisk_backend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, String> {
}
