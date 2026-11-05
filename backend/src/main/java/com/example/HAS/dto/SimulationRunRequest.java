package com.example.HAS.dto;

import jakarta.validation.constraints.NotBlank;

public class SimulationRunRequest {

    @NotBlank(message = "Scenario name is required")
    private String scenarioName;

    private String scenarioType = "PATIENT_SURGE"; // PATIENT_SURGE, STAFF_SHORTAGE, BED_ICU_SHORTAGE, MULTI_HOSPITAL_CRISIS

    private double surgeMultiplier = 1.35; // e.g. 1.35 (+35%)

    private int durationHours = 24;

    private double staffReductionPercent = 0.0;

    private double bedReductionPercent = 0.0;

    private String affectedHospitalIds; // e.g. "1,2"

    private String createdBy;

    private String notes;

    public SimulationRunRequest() {
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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

