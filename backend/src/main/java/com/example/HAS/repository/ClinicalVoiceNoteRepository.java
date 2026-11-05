package com.example.HAS.repository;

import com.example.HAS.entity.ClinicalNoteStatus;
import com.example.HAS.entity.ClinicalVoiceNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicalVoiceNoteRepository extends JpaRepository<ClinicalVoiceNote, Long> {
    List<ClinicalVoiceNote> findByAuthorClinicianIdOrderByCreatedAtDesc(Long authorClinicianId);
    List<ClinicalVoiceNote> findByHospitalIdOrderByCreatedAtDesc(Long hospitalId);
    List<ClinicalVoiceNote> findByPatientReference(String patientReference);
    List<ClinicalVoiceNote> findByStatus(ClinicalNoteStatus status);
}

