package com.example.HAS.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ProcedureDelayRequest {

    @Min(value = 1, message = "Delay minutes must be at least 1")
    private int delayDurationMinutes;

    @NotBlank(message = "Delay reason is required")
    private String delayReason;

    private String updatedBy;

    public ProcedureDelayRequest() {
    }

    public ProcedureDelayRequest(int delayDurationMinutes, String delayReason, String updatedBy) {
        this.delayDurationMinutes = delayDurationMinutes;
        this.delayReason = delayReason;
        this.updatedBy = updatedBy;
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

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}

