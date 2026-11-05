package com.example.HAS.controller;

import com.example.HAS.dto.ApiResponse;
import com.example.HAS.dto.VoiceDictationRequest;
import com.example.HAS.dto.VoiceSignOffRequest;
import com.example.HAS.entity.ClinicalVoiceNote;
import com.example.HAS.service.ClinicalVoiceNoteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voice-notes")
@CrossOrigin(origins = "*")
public class ClinicalVoiceNoteController {

    private final ClinicalVoiceNoteService voiceNoteService;

    public ClinicalVoiceNoteController(ClinicalVoiceNoteService voiceNoteService) {
        this.voiceNoteService = voiceNoteService;
    }

    @GetMapping("/clinician/{clinicianId}")
    public ResponseEntity<ApiResponse<List<ClinicalVoiceNote>>> getNotesByClinician(@PathVariable Long clinicianId) {
        return ResponseEntity.ok(ApiResponse.ok(voiceNoteService.getNotesByClinician(clinicianId)));
    }

    @GetMapping("/patient/{patientReference}")
    public ResponseEntity<ApiResponse<List<ClinicalVoiceNote>>> getNotesByPatient(@PathVariable String patientReference) {
        return ResponseEntity.ok(ApiResponse.ok(voiceNoteService.getNotesByPatient(patientReference)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClinicalVoiceNote>> getNoteById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(voiceNoteService.getNoteById(id)));
    }

    // T8.3 & T8.4: Capture voice input & generate AI transcript draft
    @PostMapping("/dictate")
    public ResponseEntity<ApiResponse<ClinicalVoiceNote>> captureVoiceDraft(@Valid @RequestBody VoiceDictationRequest request) {
        ClinicalVoiceNote draftNote = voiceNoteService.captureVoiceDraft(request);
        return ResponseEntity.ok(ApiResponse.ok("Speech converted to AI draft transcript (Review required)", draftNote));
    }

    // T8.5: Review, correct and explicitly sign off
    @PutMapping("/{id}/sign-off")
    public ResponseEntity<ApiResponse<ClinicalVoiceNote>> signOffVoiceNote(
            @PathVariable Long id,
            @Valid @RequestBody VoiceSignOffRequest request) {
        ClinicalVoiceNote signedNote = voiceNoteService.signOffVoiceNote(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Clinical note verified, authenticated, and locked", signedNote));
    }
}

