package com.example.HAS.dto;

import jakarta.validation.constraints.NotBlank;

public class AlertAcknowledgeRequest {

    @NotBlank(message = "Acknowledged by username is required")
    private String acknowledgedBy;

    private String notes;

    public AlertAcknowledgeRequest() {
    }

    public AlertAcknowledgeRequest(String acknowledgedBy, String notes) {
        this.acknowledgedBy = acknowledgedBy;
        this.notes = notes;
    }

    public String getAcknowledgedBy() {
        return acknowledgedBy;
    }

    public void setAcknowledgedBy(String acknowledgedBy) {
        this.acknowledgedBy = acknowledgedBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

