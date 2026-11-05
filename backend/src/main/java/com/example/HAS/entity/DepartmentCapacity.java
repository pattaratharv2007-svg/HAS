package com.example.HAS.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "department_capacities")
public class DepartmentCapacity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long hospitalId;

    @NotNull
    @Column(nullable = false, unique = true)
    private Long departmentId;

    private String departmentName;

    @Min(0)
    @Column(nullable = false)
    private int totalBeds = 0;

    @Min(0)
    @Column(nullable = false)
    private int occupiedBeds = 0;

    @Min(0)
    @Column(nullable = false)
    private int availableBeds = 0;

    @Min(0)
    @Column(nullable = false)
    private int outOfServiceBeds = 0;

    @Min(0)
    private int icuTotal = 0;

    @Min(0)
    private int icuOccupied = 0;

    @Min(0)
    private int icuAvailable = 0;

    @Min(0)
    private int ventilatorsTotal = 0;

    @Min(0)
    private int ventilatorsAvailable = 0;

    @Min(0)
    private int staffOnDuty = 0;

    private String activeWorkloadLevel = "NORMAL"; // LOW, NORMAL, HIGH, CRITICAL

    @Column(nullable = false)
    private LocalDateTime lastUpdated = LocalDateTime.now();

    private String updatedBy;

    private String updaterRole;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationState verificationState = VerificationState.VERIFIED;

    @Column(length = 500)
    private String verificationNotes;

    public DepartmentCapacity() {
    }

    public DepartmentCapacity(Long hospitalId, Long departmentId, String departmentName, int totalBeds, int occupiedBeds, int availableBeds, int outOfServiceBeds) {
        this.hospitalId = hospitalId;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.totalBeds = totalBeds;
        this.occupiedBeds = occupiedBeds;
        this.availableBeds = availableBeds;
        this.outOfServiceBeds = outOfServiceBeds;
        this.lastUpdated = LocalDateTime.now();
        this.verificationState = VerificationState.VERIFIED;
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

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public int getTotalBeds() {
        return totalBeds;
    }

    public void setTotalBeds(int totalBeds) {
        this.totalBeds = totalBeds;
    }

    public int getOccupiedBeds() {
        return occupiedBeds;
    }

    public void setOccupiedBeds(int occupiedBeds) {
        this.occupiedBeds = occupiedBeds;
    }

    public int getAvailableBeds() {
        return availableBeds;
    }

    public void setAvailableBeds(int availableBeds) {
        this.availableBeds = availableBeds;
    }

    public int getOutOfServiceBeds() {
        return outOfServiceBeds;
    }

    public void setOutOfServiceBeds(int outOfServiceBeds) {
        this.outOfServiceBeds = outOfServiceBeds;
    }

    public int getIcuTotal() {
        return icuTotal;
    }

    public void setIcuTotal(int icuTotal) {
        this.icuTotal = icuTotal;
    }

    public int getIcuOccupied() {
        return icuOccupied;
    }

    public void setIcuOccupied(int icuOccupied) {
        this.icuOccupied = icuOccupied;
    }

    public int getIcuAvailable() {
        return icuAvailable;
    }

    public void setIcuAvailable(int icuAvailable) {
        this.icuAvailable = icuAvailable;
    }

    public int getVentilatorsTotal() {
        return ventilatorsTotal;
    }

    public void setVentilatorsTotal(int ventilatorsTotal) {
        this.ventilatorsTotal = ventilatorsTotal;
    }

    public int getVentilatorsAvailable() {
        return ventilatorsAvailable;
    }

    public void setVentilatorsAvailable(int ventilatorsAvailable) {
        this.ventilatorsAvailable = ventilatorsAvailable;
    }

    public int getStaffOnDuty() {
        return staffOnDuty;
    }

    public void setStaffOnDuty(int staffOnDuty) {
        this.staffOnDuty = staffOnDuty;
    }

    public String getActiveWorkloadLevel() {
        return activeWorkloadLevel;
    }

    public void setActiveWorkloadLevel(String activeWorkloadLevel) {
        this.activeWorkloadLevel = activeWorkloadLevel;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getUpdaterRole() {
        return updaterRole;
    }

    public void setUpdaterRole(String updaterRole) {
        this.updaterRole = updaterRole;
    }

    public VerificationState getVerificationState() {
        return verificationState;
    }

    public void setVerificationState(VerificationState verificationState) {
        this.verificationState = verificationState;
    }

    public String getVerificationNotes() {
        return verificationNotes;
    }

    public void setVerificationNotes(String verificationNotes) {
        this.verificationNotes = verificationNotes;
    }
}

