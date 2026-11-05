package com.example.HAS.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "crisis_simulations")
public class CrisisSimulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String scenarioName;

    private String scenarioType; // PATIENT_SURGE, STAFF_SHORTAGE, BED_ICU_SHORTAGE, MULTI_HOSPITAL_CRISIS

    private double surgeMultiplier = 1.0; // e.g., 1.35 = +35% surge

    private int durationHours = 24;

    private double staffReductionPercent = 0.0; // e.g., 20%

    private double bedReductionPercent = 0.0; // e.g., 15%

    private String affectedHospitalIds; // comma-separated ids e.g. "1,2"

    private double projectedBedOccupancyPercent;

    private int projectedIcuDeficit;

    private int projectedWaitTimeIncreaseMinutes;

    private String resourcePressureRisk = "HIGH"; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(nullable = false)
    private String simulationDisclaimer = "SIMULATION — NOT LIVE HOSPITAL DATA";

    private String createdBy;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(length = 1000)
    private String notes;

    public CrisisSimulation() {
    }

    public CrisisSimulation(String scenarioName, String scenarioType, double surgeMultiplier, int durationHours, double staffReductionPercent, double bedReductionPercent, String affectedHospitalIds, String createdBy) {
        this.scenarioName = scenarioName;
        this.scenarioType = scenarioType;
        this.surgeMultiplier = surgeMultiplier;
        this.durationHours = durationHours;
        this.staffReductionPercent = staffReductionPercent;
        this.bedReductionPercent = bedReductionPercent;
        this.affectedHospitalIds = affectedHospitalIds;
        this.createdBy = createdBy;
        this.simulationDisclaimer = "SIMULATION — NOT LIVE HOSPITAL DATA";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getScenarioName() {
        return scenarioName;
    }

    public void setScenarioName(String scenarioName) {
        this.scenarioName = scenarioName;
    }

    public String getScenarioType() {
        return scenarioType;
    }

    public void setScenarioType(String scenarioType) {
        this.scenarioType = scenarioType;
    }

    public double getSurgeMultiplier() {
        return surgeMultiplier;
    }

    public void setSurgeMultiplier(double surgeMultiplier) {
        this.surgeMultiplier = surgeMultiplier;
    }

    public int getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(int durationHours) {
        this.durationHours = durationHours;
    }

    public double getStaffReductionPercent() {
        return staffReductionPercent;
    }

    public void setStaffReductionPercent(double staffReductionPercent) {
        this.staffReductionPercent = staffReductionPercent;
    }

    public double getBedReductionPercent() {
        return bedReductionPercent;
    }

    public void setBedReductionPercent(double bedReductionPercent) {
        this.bedReductionPercent = bedReductionPercent;
    }

    public String getAffectedHospitalIds() {
        return affectedHospitalIds;
    }

    public void setAffectedHospitalIds(String affectedHospitalIds) {
        this.affectedHospitalIds = affectedHospitalIds;
    }

    public double getProjectedBedOccupancyPercent() {
        return projectedBedOccupancyPercent;
    }

    public void setProjectedBedOccupancyPercent(double projectedBedOccupancyPercent) {
        this.projectedBedOccupancyPercent = projectedBedOccupancyPercent;
    }

    public int getProjectedIcuDeficit() {
        return projectedIcuDeficit;
    }

    public void setProjectedIcuDeficit(int projectedIcuDeficit) {
        this.projectedIcuDeficit = projectedIcuDeficit;
    }

    public int getProjectedWaitTimeIncreaseMinutes() {
        return projectedWaitTimeIncreaseMinutes;
    }

    public void setProjectedWaitTimeIncreaseMinutes(int projectedWaitTimeIncreaseMinutes) {
        this.projectedWaitTimeIncreaseMinutes = projectedWaitTimeIncreaseMinutes;
    }

    public String getResourcePressureRisk() {
        return resourcePressureRisk;
    }

    public void setResourcePressureRisk(String resourcePressureRisk) {
        this.resourcePressureRisk = resourcePressureRisk;
    }

    public String getSimulationDisclaimer() {
        return simulationDisclaimer;
    }

    public void setSimulationDisclaimer(String simulationDisclaimer) {
        this.simulationDisclaimer = simulationDisclaimer;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

