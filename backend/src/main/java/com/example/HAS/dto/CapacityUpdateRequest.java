package com.example.HAS.dto;

import com.example.HAS.entity.VerificationState;
import jakarta.validation.constraints.Min;

public class CapacityUpdateRequest {

    @Min(value = 0, message = "Total beds must be >= 0")
    private int totalBeds;

    @Min(value = 0, message = "Occupied beds must be >= 0")
    private int occupiedBeds;

    @Min(value = 0, message = "Available beds must be >= 0")
    private int availableBeds;

    @Min(value = 0, message = "Out of service beds must be >= 0")
    private int outOfServiceBeds;

    @Min(0)
    private int icuTotal;

    @Min(0)
    private int icuOccupied;

    @Min(0)
    private int icuAvailable;

    @Min(0)
    private int ventilatorsTotal;

    @Min(0)
    private int ventilatorsAvailable;

    @Min(0)
    private int staffOnDuty;

    private String activeWorkloadLevel; // LOW, NORMAL, HIGH, CRITICAL

    private String updatedBy;

    private String updaterRole;

    private VerificationState verificationState;

    private String verificationNotes;

    public CapacityUpdateRequest() {
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

