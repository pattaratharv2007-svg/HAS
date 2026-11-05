package com.example.HAS.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReferralCreateRequest {

    private Long ambulanceUnitId;

    private String ambulanceUnitNumber;

    @NotNull(message = "Destination hospital is required")
    private Long destinationHospitalId;

    private Long originHospitalId;

    @NotBlank(message = "Patient de-identified reference is required")
    private String patientDeIdentifiedReference; // e.g. "PT-TRAUMA-402"

    @NotBlank(message = "Clinical & operational summary is required")
    private String clinicalOperationalSummary;

    private String urgencyLevel = "HIGH"; // LOW, MEDIUM, HIGH, CRITICAL

    private String requiredServices; // e.g., "ICU, Trauma, Cardiology"

    private Integer estimatedArrivalMinutes;

    public ReferralCreateRequest() {
    }

    public Long getAmbulanceUnitId() {
        return ambulanceUnitId;
    }

    public void setAmbulanceUnitId(Long ambulanceUnitId) {
        this.ambulanceUnitId = ambulanceUnitId;
    }

    public String getAmbulanceUnitNumber() {
        return ambulanceUnitNumber;
    }

    public void setAmbulanceUnitNumber(String ambulanceUnitNumber) {
        this.ambulanceUnitNumber = ambulanceUnitNumber;
    }

    public Long getDestinationHospitalId() {
        return destinationHospitalId;
    }

    public void setDestinationHospitalId(Long destinationHospitalId) {
        this.destinationHospitalId = destinationHospitalId;
    }

    public Long getOriginHospitalId() {
        return originHospitalId;
    }

    public void setOriginHospitalId(Long originHospitalId) {
        this.originHospitalId = originHospitalId;
    }

    public String getPatientDeIdentifiedReference() {
        return patientDeIdentifiedReference;
    }

    public void setPatientDeIdentifiedReference(String patientDeIdentifiedReference) {
        this.patientDeIdentifiedReference = patientDeIdentifiedReference;
    }

    public String getClinicalOperationalSummary() {
        return clinicalOperationalSummary;
    }

    public void setClinicalOperationalSummary(String clinicalOperationalSummary) {
        this.clinicalOperationalSummary = clinicalOperationalSummary;
    }

    public String getUrgencyLevel() {
        return urgencyLevel;
    }

    public void setUrgencyLevel(String urgencyLevel) {
        this.urgencyLevel = urgencyLevel;
    }

    public String getRequiredServices() {
        return requiredServices;
    }

    public void setRequiredServices(String requiredServices) {
        this.requiredServices = requiredServices;
    }

    public Integer getEstimatedArrivalMinutes() {
        return estimatedArrivalMinutes;
    }

    public void setEstimatedArrivalMinutes(Integer estimatedArrivalMinutes) {
        this.estimatedArrivalMinutes = estimatedArrivalMinutes;
    }
}

