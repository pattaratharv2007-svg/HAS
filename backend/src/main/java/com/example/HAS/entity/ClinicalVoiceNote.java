package com.example.HAS.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "clinical_voice_notes")
public class ClinicalVoiceNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long hospitalId;

    private Long departmentId;

    private Long authorClinicianId;

    private String authorClinicianName;

    @Enumerated(EnumType.STRING)
    private Role authorRole; // DOCTOR or NURSE

    private String patientReference;

    private int audioDurationSeconds;

    @Column(length = 4000)
    private String transcriptDraft; // AI generated draft text

    @Column(nullable = false)
    private boolean isAiDraft = true;

    private double aiConfidenceScore = 0.92;

    private String processingMetadata; // e.g. "Whisper-Med-v3; language=en; audio_transient=true"

    @Column(length = 4000)
    private String finalAuthenticatedNote; // Clinician reviewed and edited note

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClinicalNoteStatus status = ClinicalNoteStatus.DRAFT;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime signedOffAt;

    private String signedOffBy;

    public ClinicalVoiceNote() {
    }

    public ClinicalVoiceNote(Long hospitalId, Long departmentId, Long authorClinicianId, String authorClinicianName, Role authorRole, String patientReference, int audioDurationSeconds, String transcriptDraft, double aiConfidenceScore, String processingMetadata) {
        this.hospitalId = hospitalId;
        this.departmentId = departmentId;
        this.authorClinicianId = authorClinicianId;
        this.authorClinicianName = authorClinicianName;
        this.authorRole = authorRole;
        this.patientReference = patientReference;
        this.audioDurationSeconds = audioDurationSeconds;
        this.transcriptDraft = transcriptDraft;
        this.isAiDraft = true;
        this.aiConfidenceScore = aiConfidenceScore;
        this.processingMetadata = processingMetadata;
        this.status = ClinicalNoteStatus.DRAFT;
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

    public String getTranscriptDraft() {
        return transcriptDraft;
    }

    public void setTranscriptDraft(String transcriptDraft) {
        this.transcriptDraft = transcriptDraft;
    }

    public boolean isAiDraft() {
        return isAiDraft;
    }

    public void setAiDraft(boolean aiDraft) {
        isAiDraft = aiDraft;
    }

    public double getAiConfidenceScore() {
        return aiConfidenceScore;
    }

    public void setAiConfidenceScore(double aiConfidenceScore) {
        this.aiConfidenceScore = aiConfidenceScore;
    }

    public String getProcessingMetadata() {
        return processingMetadata;
    }

    public void setProcessingMetadata(String processingMetadata) {
        this.processingMetadata = processingMetadata;
    }

    public String getFinalAuthenticatedNote() {
        return finalAuthenticatedNote;
    }

    public void setFinalAuthenticatedNote(String finalAuthenticatedNote) {
        this.finalAuthenticatedNote = finalAuthenticatedNote;
    }

    public ClinicalNoteStatus getStatus() {
        return status;
    }

    public void setStatus(ClinicalNoteStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getSignedOffAt() {
        return signedOffAt;
    }

    public void setSignedOffAt(LocalDateTime signedOffAt) {
        this.signedOffAt = signedOffAt;
    }

    public String getSignedOffBy() {
        return signedOffBy;
    }

    public void setSignedOffBy(String signedOffBy) {
        this.signedOffBy = signedOffBy;
    }
}

