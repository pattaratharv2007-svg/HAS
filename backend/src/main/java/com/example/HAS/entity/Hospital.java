package com.example.HAS.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "hospitals")
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String code;

    private String address;

    private Double latitude;

    private Double longitude;

    private String contactPhone;

    private String contactEmail;

    @Column(nullable = false)
    private String participationStatus = "ACTIVE"; // ACTIVE, SUSPENDED, INACTIVE

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HospitalStatus operationalStatus = HospitalStatus.OPERATIONAL;

    private String statusReason;

    private String statusUpdatedBy;

    private LocalDateTime lastStatusUpdate = LocalDateTime.now();

    @Column(length = 1000)
    private String capabilitiesSummary; // e.g., "Level 1 Trauma, Burn Unit, Stroke Center, Pediatric ICU"

    private LocalDateTime createdAt = LocalDateTime.now();

    public Hospital() {
    }

    public Hospital(String name, String code, String address, Double latitude, Double longitude, String contactPhone, String contactEmail, String capabilitiesSummary) {
        this.name = name;
        this.code = code;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.contactPhone = contactPhone;
        this.contactEmail = contactEmail;
        this.capabilitiesSummary = capabilitiesSummary;
        this.participationStatus = "ACTIVE";
        this.operationalStatus = HospitalStatus.OPERATIONAL;
        this.lastStatusUpdate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getParticipationStatus() {
        return participationStatus;
    }

    public void setParticipationStatus(String participationStatus) {
        this.participationStatus = participationStatus;
    }

    public HospitalStatus getOperationalStatus() {
        return operationalStatus;
    }

    public void setOperationalStatus(HospitalStatus operationalStatus) {
        this.operationalStatus = operationalStatus;
    }

    public String getStatusReason() {
        return statusReason;
    }

    public void setStatusReason(String statusReason) {
        this.statusReason = statusReason;
    }

    public String getStatusUpdatedBy() {
        return statusUpdatedBy;
    }

    public void setStatusUpdatedBy(String statusUpdatedBy) {
        this.statusUpdatedBy = statusUpdatedBy;
    }

    public LocalDateTime getLastStatusUpdate() {
        return lastStatusUpdate;
    }

    public void setLastStatusUpdate(LocalDateTime lastStatusUpdate) {
        this.lastStatusUpdate = lastStatusUpdate;
    }

    public String getCapabilitiesSummary() {
        return capabilitiesSummary;
    }

    public void setCapabilitiesSummary(String capabilitiesSummary) {
        this.capabilitiesSummary = capabilitiesSummary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

