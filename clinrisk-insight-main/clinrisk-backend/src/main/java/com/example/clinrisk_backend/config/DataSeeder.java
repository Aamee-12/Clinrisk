package com.example.clinrisk_backend.config;

import com.example.clinrisk_backend.model.Patient;
import com.example.clinrisk_backend.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(PatientRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                String[] conditions = {"Hypertension", "Type 2 Diabetes", "CAD", "AFib", "Hyperlipidemia", "Pre-diabetes", "CHF", "COPD"};
                String[] firstNames = {"John", "Mary", "David", "Sarah", "Michael", "Emma", "James", "Olivia", "Robert", "Sophia", "William", "Ava", "Richard", "Isabella", "Thomas", "Mia", "Charles", "Charlotte", "Daniel", "Amelia", "Matthew", "Harper", "Anthony", "Evelyn", "Mark"};
                String[] lastNames = {"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris"};

                List<Patient> patients = new ArrayList<>();
                for (int i = 0; i < 25; i++) {
                    double r = seeded(i + 1);
                    double r2 = seeded(i + 100);
                    int age = 35 + (int)(r * 50);
                    int risk = (int)(r2 * 45) + 5;
                    String severity = risk > 25 ? "high" : (risk > 12 ? "medium" : "low");
                    
                    Patient p = new Patient();
                    p.setId("PT-" + (1000 + i));
                    p.setName(firstNames[i % firstNames.length] + " " + lastNames[(i * 3) % lastNames.length]);
                    p.setAge(age);
                    p.setGender(r > 0.5 ? "M" : "F");
                    p.setConditionName(conditions[i % conditions.length]);
                    p.setBp((110 + (int)(r * 50)) + "/" + (70 + (int)(r2 * 25)));
                    p.setHr(60 + (int)(r * 40));
                    p.setBmi(Math.round((22 + r * 12) * 10.0) / 10.0);
                    p.setHba1c(Math.round((5.2 + r2 * 3.5) * 10.0) / 10.0);
                    p.setCholesterol(150 + (int)(r * 120));
                    p.setHdl(35 + (int)(r2 * 35));
                    p.setSmoker(r > 0.7);
                    p.setDiabetes(r2 > 0.6);
                    p.setHtnTx(r > 0.5);
                    p.setRiskScore(risk);
                    p.setSeverity(severity);
                    p.setLastVisit((1 + (int)(r * 28)) + " days ago");
                    
                    patients.add(p);
                }
                repository.saveAll(patients);
            }
        };
    }

    private double seeded(int i) {
        double x = Math.sin(i * 9999) * 10000;
        return x - Math.floor(x);
    }
}
