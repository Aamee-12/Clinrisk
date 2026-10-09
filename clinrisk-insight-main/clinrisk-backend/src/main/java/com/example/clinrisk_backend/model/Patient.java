package com.example.clinrisk_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    private String id;
    private String name;
    private Integer age;
    private String gender;
    private String conditionName;
    private String bp;
    private Integer hr;
    private Double bmi;
    private Double hba1c;
    private Integer cholesterol;
    private Integer hdl;
    private Boolean smoker;
    private Boolean diabetes;
    private Boolean htnTx;
    private Integer riskScore;
    private String severity;
    private String lastVisit;
}
