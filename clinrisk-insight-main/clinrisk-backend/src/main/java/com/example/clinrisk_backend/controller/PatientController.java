package com.example.clinrisk_backend.controller;

import com.example.clinrisk_backend.model.Patient;
import com.example.clinrisk_backend.repository.PatientRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @PostMapping
    public Patient addPatient(@RequestBody Patient patient) {
        if (patient.getId() == null) {
            patient.setId("PT-" + System.currentTimeMillis());
        }
        return patientRepository.save(patient);
    }

    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable String id, @RequestBody Patient patient) {
        patient.setId(id);
        return patientRepository.save(patient);
    }

    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable String id) {
        patientRepository.deleteById(id);
    }
}
