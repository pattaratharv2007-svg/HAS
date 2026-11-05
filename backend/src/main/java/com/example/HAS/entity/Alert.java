package com.example.HAS.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long hospitalId;

    private Long departmentId;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(length = 1000, nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertSeverity severity = AlertSeverity.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertType alertType = AlertType.SYSTEM;

    private String sourceRecordType;

    private String sourceRecordId;

    @Column(nullable = false)
    private boolean isAcknowledged = false;

    private String acknowledgedBy;

    private LocalDateTime acknowledgedAt;

    @Column(nullable = false)
    private boolean escalated = false;

    private String escalatedToRole;

    private LocalDateTime escalatedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Alert() {
    }

    public Alert(Long hospitalId, Long departmentId, String title, String message, AlertSeverity severity, AlertType alertType, String sourceRecordType, String sourceRecordId) {
        this.hospitalId = hospitalId;
        this.departmentId = departmentId;
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.alertType = alertType;
        this.sourceRecordType = sourceRecordType;
        this.sourceRecordId = sourceRecordId;
        this.isAcknowledged = false;
        this.escalated = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public AlertSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(AlertSeverity severity) {
        this.severity = severity;
    }

    public AlertType getAlertType() {
        return alertType;
    }

    public void setAlertType(AlertType alertType) {
        this.alertType = alertType;
    }

    public String getSourceRecordType() {
        return sourceRecordType;
    }

    public void setSourceRecordType(String sourceRecordType) {
        this.sourceRecordType = sourceRecordType;
    }

    public String getSourceRecordId() {
        return sourceRecordId;
    }

    public void setSourceRecordId(String sourceRecordId) {
        this.sourceRecordId = sourceRecordId;
    }

    public boolean isAcknowledged() {
        return isAcknowledged;
    }

    public void setAcknowledged(boolean acknowledged) {
        isAcknowledged = acknowledged;
    }

    public String getAcknowledgedBy() {
        return acknowledgedBy;
    }

    public void setAcknowledgedBy(String acknowledgedBy) {
        this.acknowledgedBy = acknowledgedBy;
    }

    public LocalDateTime getAcknowledgedAt() {
        return acknowledgedAt;
    }

    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) {
        this.acknowledgedAt = acknowledgedAt;
    }

    public boolean isEscalated() {
        return escalated;
    }

    public void setEscalated(boolean escalated) {
        this.escalated = escalated;
    }

    public String getEscalatedToRole() {
        return escalatedToRole;
    }

    public void setEscalatedToRole(String escalatedToRole) {
        this.escalatedToRole = escalatedToRole;
    }

    public LocalDateTime getEscalatedAt() {
        return escalatedAt;
    }

    public void setEscalatedAt(LocalDateTime escalatedAt) {
        this.escalatedAt = escalatedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

