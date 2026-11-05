package com.example.HAS.service;

import com.example.HAS.dto.HospitalStatusUpdateRequest;
import com.example.HAS.entity.Hospital;
import com.example.HAS.entity.HospitalStatus;
import com.example.HAS.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final AuditService auditService;

    public HospitalService(HospitalRepository hospitalRepository, AuditService auditService) {
        this.hospitalRepository = hospitalRepository;
        this.auditService = auditService;
    }

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public Hospital getHospitalById(Long id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Hospital not found with id: " + id));
    }

    public List<Hospital> getActiveParticipatingHospitals() {
        return hospitalRepository.findByParticipationStatus("ACTIVE");
    }

    public List<Hospital> searchHospitals(String query) {
        if (query == null || query.isBlank()) {
            return hospitalRepository.findAll();
        }
        return hospitalRepository.findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(query, query);
    }

    public Hospital registerHospital(Hospital hospital, String actor) {
        Hospital saved = hospitalRepository.save(hospital);
        auditService.log(
                actor != null ? actor : "SYSTEM",
                "ADMINISTRATOR",
                "HOSPITAL_REGISTER",
                "Hospital",
                saved.getId().toString(),
                null,
                saved.getName(),
                "Registered new hospital facility",
                saved.getId()
        );
        return saved;
    }

    public Hospital updateParticipationStatus(Long hospitalId, String status, String actor) {
        Hospital hospital = getHospitalById(hospitalId);
        String previous = hospital.getParticipationStatus();
        hospital.setParticipationStatus(status);
        Hospital updated = hospitalRepository.save(hospital);

        auditService.log(
                actor != null ? actor : "ADMIN",
                "ADMINISTRATOR",
                "HOSPITAL_PARTICIPATION_UPDATE",
                "Hospital",
                hospital.getId().toString(),
                "participation=" + previous,
                "participation=" + status,
                "Updated participation status",
                hospital.getId()
        );

        return updated;
    }

    public Hospital updateHospitalStatus(Long hospitalId, HospitalStatusUpdateRequest request) {
        Hospital hospital = getHospitalById(hospitalId);
        HospitalStatus previousStatus = hospital.getOperationalStatus();

        hospital.setOperationalStatus(request.getOperationalStatus());
        hospital.setStatusReason(request.getReason());
        hospital.setStatusUpdatedBy(request.getUpdatedBy());
        hospital.setLastStatusUpdate(LocalDateTime.now());

        Hospital updated = hospitalRepository.save(hospital);

        auditService.log(
                request.getUpdatedBy() != null ? request.getUpdatedBy() : "OPERATIONS_MANAGER",
                "ADMINISTRATOR",
                "HOSPITAL_STATUS_CHANGE",
                "Hospital",
                hospital.getId().toString(),
                "status=" + previousStatus,
                "status=" + request.getOperationalStatus() + " | reason=" + request.getReason(),
                "Central hospital-wide operational status changed",
                hospital.getId()
        );

        return updated;
    }
}

