package com.example.HAS.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "referral_requests")
public class ReferralRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String referralCode; // e.g., "REF-2026-0042"

    private Long ambulanceUnitId;

    private String ambulanceUnitNumber;

    @NotNull
    @Column(nullable = false)
    private Long destinationHospitalId;

    private String destinationHospitalName;

    private Long originHospitalId;

    private String originHospitalName;

    private String patientDeIdentifiedReference; // e.g., "PT-M-48-TRAUMA"

    @Column(length = 2000)
    private String clinicalOperationalSummary;

    private String urgencyLevel = "HIGH"; // LOW, MEDIUM, HIGH, CRITICAL

    private String requiredServices; // e.g., "ICU, Emergency Surgery, CT Scan"

    private Integer estimatedArrivalMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReferralStatus status = ReferralStatus.DRAFT;

    private String decisionReason; // Reason for acceptance/decline/redirection

    private Long redirectedHospitalId;

    private String redirectedHospitalName;

    private LocalDateTime sentAt;

    private LocalDateTime deliveredAt;

    private LocalDateTime acknowledgedAt;

    private String acknowledgedBy;

    private LocalDateTime decisionAt;

    private String decisionBy;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ReferralRequest() {
    }

    public ReferralRequest(String referralCode, Long ambulanceUnitId, String ambulanceUnitNumber, Long destinationHospitalId, String destinationHospitalName, String patientDeIdentifiedReference, String clinicalOperationalSummary, String urgencyLevel, String requiredServices) {
        this.referralCode = referralCode;
        this.ambulanceUnitId = ambulanceUnitId;
        this.ambulanceUnitNumber = ambulanceUnitNumber;
        this.destinationHospitalId = destinationHospitalId;
        this.destinationHospitalName = destinationHospitalName;
        this.patientDeIdentifiedReference = patientDeIdentifiedReference;
        this.clinicalOperationalSummary = clinicalOperationalSummary;
        this.urgencyLevel = urgencyLevel;
        this.requiredServices = requiredServices;
        this.status = ReferralStatus.DRAFT;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReferralCode() {
        return referralCode;
    }

    public void setReferralCode(String referralCode) {
        this.referralCode = referralCode;
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

    public String getDestinationHospitalName() {
        return destinationHospitalName;
    }

    public void setDestinationHospitalName(String destinationHospitalName) {
        this.destinationHospitalName = destinationHospitalName;
    }

    public Long getOriginHospitalId() {
        return originHospitalId;
    }

    public void setOriginHospitalId(Long originHospitalId) {
        this.originHospitalId = originHospitalId;
    }

    public String getOriginHospitalName() {
        return originHospitalName;
    }

    public void setOriginHospitalName(String originHospitalName) {
        this.originHospitalName = originHospitalName;
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

    public ReferralStatus getStatus() {
        return status;
    }

    public void setStatus(ReferralStatus status) {
        this.status = status;
    }

    public String getDecisionReason() {
        return decisionReason;
    }

    public void setDecisionReason(String decisionReason) {
        this.decisionReason = decisionReason;
    }

    public Long getRedirectedHospitalId() {
        return redirectedHospitalId;
    }

    public void setRedirectedHospitalId(Long redirectedHospitalId) {
        this.redirectedHospitalId = redirectedHospitalId;
    }

    public String getRedirectedHospitalName() {
        return redirectedHospitalName;
    }

    public void setRedirectedHospitalName(String redirectedHospitalName) {
        this.redirectedHospitalName = redirectedHospitalName;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    public LocalDateTime getAcknowledgedAt() {
        return acknowledgedAt;
    }

    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) {
        this.acknowledgedAt = acknowledgedAt;
    }

    public String getAcknowledgedBy() {
        return acknowledgedBy;
    }

    public void setAcknowledgedBy(String acknowledgedBy) {
        this.acknowledgedBy = acknowledgedBy;
    }

    public LocalDateTime getDecisionAt() {
        return decisionAt;
    }

    public void setDecisionAt(LocalDateTime decisionAt) {
        this.decisionAt = decisionAt;
    }

    public String getDecisionBy() {
        return decisionBy;
    }

    public void setDecisionBy(String decisionBy) {
        this.decisionBy = decisionBy;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

