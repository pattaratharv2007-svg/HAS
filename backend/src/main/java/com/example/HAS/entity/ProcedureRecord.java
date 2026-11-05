package com.example.HAS.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "procedure_records")
public class ProcedureRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long hospitalId;

    private Long departmentId;

    @NotBlank
    @Column(nullable = false)
    private String procedureName; // e.g. "Emergency Laparotomy", "Angioplasty"

    private String patientReference; // e.g. "PT-9921"

    private String responsibleTeam; // e.g. "Surgical Team Beta", "Dr. Priya Sharma"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProcedureStatus status = ProcedureStatus.PLANNED;

    private LocalDateTime scheduledStartTime;

    private LocalDateTime scheduledEndTime;

    private LocalDateTime actualStartTime;

    private LocalDateTime actualEndTime;

    private int delayDurationMinutes = 0;

    private String delayReason;

    private int delayThresholdMinutes = 20;

    private boolean delayAlertTriggered = false;

    private LocalDateTime lastUpdated = LocalDateTime.now();

    public ProcedureRecord() {
    }

    public ProcedureRecord(Long hospitalId, Long departmentId, String procedureName, String patientReference, String responsibleTeam, LocalDateTime scheduledStartTime, LocalDateTime scheduledEndTime) {
        this.hospitalId = hospitalId;
        this.departmentId = departmentId;
        this.procedureName = procedureName;
        this.patientReference = patientReference;
        this.responsibleTeam = responsibleTeam;
        this.scheduledStartTime = scheduledStartTime;
        this.scheduledEndTime = scheduledEndTime;
        this.status = ProcedureStatus.PLANNED;
        this.lastUpdated = LocalDateTime.now();
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

    public String getProcedureName() {
        return procedureName;
    }

    public void setProcedureName(String procedureName) {
        this.procedureName = procedureName;
    }

    public String getPatientReference() {
        return patientReference;
    }

    public void setPatientReference(String patientReference) {
        this.patientReference = patientReference;
    }

    public String getResponsibleTeam() {
        return responsibleTeam;
    }

    public void setResponsibleTeam(String responsibleTeam) {
        this.responsibleTeam = responsibleTeam;
    }

    public ProcedureStatus getStatus() {
        return status;
    }

    public void setStatus(ProcedureStatus status) {
        this.status = status;
    }

    public LocalDateTime getScheduledStartTime() {
        return scheduledStartTime;
    }

    public void setScheduledStartTime(LocalDateTime scheduledStartTime) {
        this.scheduledStartTime = scheduledStartTime;
    }

    public LocalDateTime getScheduledEndTime() {
        return scheduledEndTime;
    }

    public void setScheduledEndTime(LocalDateTime scheduledEndTime) {
        this.scheduledEndTime = scheduledEndTime;
    }

    public LocalDateTime getActualStartTime() {
        return actualStartTime;
    }

    public void setActualStartTime(LocalDateTime actualStartTime) {
        this.actualStartTime = actualStartTime;
    }

    public LocalDateTime getActualEndTime() {
        return actualEndTime;
    }

    public void setActualEndTime(LocalDateTime actualEndTime) {
        this.actualEndTime = actualEndTime;
    }

    public int getDelayDurationMinutes() {
        return delayDurationMinutes;
    }

    public void setDelayDurationMinutes(int delayDurationMinutes) {
        this.delayDurationMinutes = delayDurationMinutes;
    }

    public String getDelayReason() {
        return delayReason;
    }

    public void setDelayReason(String delayReason) {
        this.delayReason = delayReason;
    }

    public int getDelayThresholdMinutes() {
        return delayThresholdMinutes;
    }

    public void setDelayThresholdMinutes(int delayThresholdMinutes) {
        this.delayThresholdMinutes = delayThresholdMinutes;
    }

    public boolean isDelayAlertTriggered() {
        return delayAlertTriggered;
    }

    public void setDelayAlertTriggered(boolean delayAlertTriggered) {
        this.delayAlertTriggered = delayAlertTriggered;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}

