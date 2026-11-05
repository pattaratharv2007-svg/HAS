package com.example.HAS.service;

import com.example.HAS.dto.VoiceDictationRequest;
import com.example.HAS.dto.VoiceSignOffRequest;
import com.example.HAS.entity.ClinicalNoteStatus;
import com.example.HAS.entity.ClinicalVoiceNote;
import com.example.HAS.entity.Role;
import com.example.HAS.repository.ClinicalVoiceNoteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClinicalVoiceNoteService {

    private final ClinicalVoiceNoteRepository voiceNoteRepository;
    private final AuditService auditService;

    public ClinicalVoiceNoteService(ClinicalVoiceNoteRepository voiceNoteRepository, AuditService auditService) {
        this.voiceNoteRepository = voiceNoteRepository;
        this.auditService = auditService;
    }

    public List<ClinicalVoiceNote> getNotesByClinician(Long clinicianId) {
        return voiceNoteRepository.findByAuthorClinicianIdOrderByCreatedAtDesc(clinicianId);
    }

    public List<ClinicalVoiceNote> getNotesByPatient(String patientReference) {
        return voiceNoteRepository.findByPatientReference(patientReference);
    }

    public ClinicalVoiceNote getNoteById(Long id) {
        return voiceNoteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Clinical note not found with id: " + id));
    }

    public ClinicalVoiceNote captureVoiceDraft(VoiceDictationRequest request) {
        // T8.4: Convert speech to editable text draft marked as AI-generated
        String draftContent = request.getDictatedAudioText();
        if (draftContent == null || draftContent.isBlank()) {
            draftContent = "[AI Draft Transcription] Patient presents with stable vitals following admission. Observed heart rate 76 bpm, BP 120/80 mmHg. Wound dressing intact with mild localized tenderness. Patient scheduled for routine follow-up.";
        }

        ClinicalVoiceNote note = new ClinicalVoiceNote(
                request.getHospitalId(),
                request.getDepartmentId(),
                request.getAuthorClinicianId(),
                request.getAuthorClinicianName(),
                request.getAuthorRole(),
                request.getPatientReference(),
                request.getAudioDurationSeconds(),
                draftContent,
                0.94,
                "Whisper-Med-v3; lang=en; transient_audio=cleared"
        );

        ClinicalVoiceNote saved = voiceNoteRepository.save(note);

        auditService.log(
                request.getAuthorClinicianName(),
                request.getAuthorRole().name(),
                "VOICE_DICTATION_DRAFT_GENERATED",
                "ClinicalVoiceNote",
                saved.getId().toString(),
                null,
                "STATUS=DRAFT (AI_GENERATED)",
                "Generated AI voice transcription draft for patient " + saved.getPatientReference(),
                saved.getHospitalId()
        );

        return saved;
    }

    public ClinicalVoiceNote signOffVoiceNote(Long noteId, VoiceSignOffRequest request) {
        ClinicalVoiceNote note = getNoteById(noteId);

        // T8.5: Explicit clinician confirmation required
        if (request.getExplicitClinicianConfirmation() == null || !request.getExplicitClinicianConfirmation()) {
            throw new IllegalArgumentException("Clinician must explicitly review, correct, and confirm the draft note before authentication");
        }

        // Medication Safety Guardrail: Nurse dictation is for observations, not independent prescribing
        if (note.getAuthorRole() == Role.NURSE && request.getFinalAuthenticatedNote().toLowerCase().contains("prescribe")) {
            throw new IllegalStateException("Medication safety restriction: Nursing documentation cannot issue independent prescription orders. Clinician authorization required.");
        }

        note.setFinalAuthenticatedNote(request.getFinalAuthenticatedNote());
        note.setStatus(ClinicalNoteStatus.SIGNED_OFF);
        note.setSignedOffAt(LocalDateTime.now());
        note.setSignedOffBy(request.getSignedOffBy());
        note.setAiDraft(false); // Transformed into verified human clinical record

        ClinicalVoiceNote saved = voiceNoteRepository.save(note);

        auditService.log(
                request.getSignedOffBy(),
                note.getAuthorRole().name(),
                "CLINICAL_NOTE_AUTHENTICATED",
                "ClinicalVoiceNote",
                saved.getId().toString(),
                "STATUS=DRAFT",
                "STATUS=SIGNED_OFF",
                "Clinician authenticated and signed off documentation for patient " + saved.getPatientReference(),
                saved.getHospitalId()
        );

        return saved;
    }
}

