package com.example.HAS.dto;

import com.example.HAS.entity.HospitalStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class HospitalStatusUpdateRequest {

    @NotNull(message = "Operational status is required")
    private HospitalStatus operationalStatus;

    @NotBlank(message = "Status reason is required")
    private String reason;

    private String updatedBy;

    public HospitalStatusUpdateRequest() {
    }

    public HospitalStatusUpdateRequest(HospitalStatus operationalStatus, String reason, String updatedBy) {
        this.operationalStatus = operationalStatus;
        this.reason = reason;
        this.updatedBy = updatedBy;
    }

    public HospitalStatus getOperationalStatus() {
        return operationalStatus;
    }

    public void setOperationalStatus(HospitalStatus operationalStatus) {
        this.operationalStatus = operationalStatus;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}

