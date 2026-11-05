package com.example.HAS.dto;

import com.example.HAS.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VoiceDictationRequest {

    private Long hospitalId;

    private Long departmentId;

    @NotNull(message = "Author clinician ID is required")
    private Long authorClinicianId;

    @NotBlank(message = "Author clinician name is required")
    private String authorClinicianName;

    @NotNull(message = "Author role is required")
    private Role authorRole; // DOCTOR or NURSE

    @NotBlank(message = "Patient reference is required")
    private String patientReference;

    private int audioDurationSeconds = 30;

    // Optional raw text or dictation simulation input
    private String dictatedAudioText;

    public VoiceDictationRequest() {
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

    public Long getAuthorClinicianId() {
        return authorClinicianId;
    }

    public void setAuthorClinicianId(Long authorClinicianId) {
        this.authorClinicianId = authorClinicianId;
    }

    public String getAuthorClinicianName() {
        return authorClinicianName;
    }

    public void setAuthorClinicianName(String authorClinicianName) {
        this.authorClinicianName = authorClinicianName;
    }

    public Role getAuthorRole() {
        return authorRole;
    }

    public void setAuthorRole(Role authorRole) {
        this.authorRole = authorRole;
    }

    public String getPatientReference() {
        return patientReference;
    }

    public void setPatientReference(String patientReference) {
        this.patientReference = patientReference;
    }

    public int getAudioDurationSeconds() {
        return audioDurationSeconds;
    }

    public void setAudioDurationSeconds(int audioDurationSeconds) {
        this.audioDurationSeconds = audioDurationSeconds;
    }

    public String getDictatedAudioText() {
        return dictatedAudioText;
    }

    public void setDictatedAudioText(String dictatedAudioText) {
        this.dictatedAudioText = dictatedAudioText;
    }
}

