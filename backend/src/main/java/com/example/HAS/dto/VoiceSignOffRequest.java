package com.example.HAS.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VoiceSignOffRequest {

    @NotBlank(message = "Final authenticated note is required")
    private String finalAuthenticatedNote;

    @NotNull(message = "Explicit clinician confirmation is required")
    private Boolean explicitClinicianConfirmation;

    @NotBlank(message = "Signed off by name is required")
    private String signedOffBy;

    public VoiceSignOffRequest() {
    }

    public VoiceSignOffRequest(String finalAuthenticatedNote, Boolean explicitClinicianConfirmation, String signedOffBy) {
        this.finalAuthenticatedNote = finalAuthenticatedNote;
        this.explicitClinicianConfirmation = explicitClinicianConfirmation;
        this.signedOffBy = signedOffBy;
    }

    public String getFinalAuthenticatedNote() {
        return finalAuthenticatedNote;
    }

    public void setFinalAuthenticatedNote(String finalAuthenticatedNote) {
        this.finalAuthenticatedNote = finalAuthenticatedNote;
    }

    public Boolean getExplicitClinicianConfirmation() {
        return explicitClinicianConfirmation;
    }

    public void setExplicitClinicianConfirmation(Boolean explicitClinicianConfirmation) {
        this.explicitClinicianConfirmation = explicitClinicianConfirmation;
    }

    public String getSignedOffBy() {
        return signedOffBy;
    }

    public void setSignedOffBy(String signedOffBy) {
        this.signedOffBy = signedOffBy;
    }
}

