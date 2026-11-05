package com.example.HAS.service;

import com.example.HAS.dto.ProcedureDelayRequest;
import com.example.HAS.entity.AlertSeverity;
import com.example.HAS.entity.AlertType;
import com.example.HAS.entity.ProcedureRecord;
import com.example.HAS.entity.ProcedureStatus;
import com.example.HAS.repository.ProcedureRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProcedureService {

    private final ProcedureRecordRepository procedureRepository;
    private final AlertService alertService;
    private final AuditService auditService;

    public ProcedureService(ProcedureRecordRepository procedureRepository,
                            AlertService alertService,
                            AuditService auditService) {
        this.procedureRepository = procedureRepository;
        this.alertService = alertService;
        this.auditService = auditService;
    }

    public List<ProcedureRecord> getProceduresForHospital(Long hospitalId) {
        return procedureRepository.findByHospitalIdOrderByScheduledStartTimeAsc(hospitalId);
    }

    public ProcedureRecord getProcedureById(Long id) {
        return procedureRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Procedure not found with id: " + id));
    }

    public ProcedureRecord scheduleProcedure(ProcedureRecord procedure, String actor) {
        ProcedureRecord saved = procedureRepository.save(procedure);
        auditService.log(
                actor != null ? actor : "CLINICAL_COORDINATOR",
                "DOCTOR",
                "PROCEDURE_SCHEDULE",
                "ProcedureRecord",
                saved.getId().toString(),
                null,
                saved.getProcedureName(),
                "Scheduled clinical procedure for patient " + saved.getPatientReference(),
                saved.getHospitalId()
        );
        return saved;
    }

    public ProcedureRecord logProcedureDelay(Long procedureId, ProcedureDelayRequest request) {
        ProcedureRecord procedure = getProcedureById(procedureId);

        procedure.setStatus(ProcedureStatus.DELAYED);
        procedure.setDelayDurationMinutes(request.getDelayDurationMinutes());
        procedure.setDelayReason(request.getDelayReason());
        procedure.setLastUpdated(LocalDateTime.now());

        // T8.2: Generate alerts when expected procedure timing exceeds threshold
        if (procedure.getDelayDurationMinutes() >= procedure.getDelayThresholdMinutes() && !procedure.isDelayAlertTriggered()) {
            procedure.setDelayAlertTriggered(true);
            alertService.createAlert(
                    procedure.getHospitalId(),
                    procedure.getDepartmentId(),
                    "Procedure Delay Alert: " + procedure.getProcedureName(),
                    "Procedure " + procedure.getProcedureName() + " (Patient " + procedure.getPatientReference()
                            + ") is delayed by " + procedure.getDelayDurationMinutes() + " mins. Reason: " + procedure.getDelayReason(),
                    AlertSeverity.MEDIUM,
                    AlertType.PROCEDURE_DELAY,
                    "ProcedureRecord",
                    procedure.getId().toString()
            );
        }

        ProcedureRecord saved = procedureRepository.save(procedure);

        auditService.log(
                request.getUpdatedBy() != null ? request.getUpdatedBy() : "DOCTOR",
                "DOCTOR",
                "PROCEDURE_DELAY_REPORTED",
                "ProcedureRecord",
                saved.getId().toString(),
                "status=" + procedure.getStatus(),
                "delayedBy=" + request.getDelayDurationMinutes() + "m | reason=" + request.getReason(),
                "delayedBy=" + request.getDelayDurationMinutes() + "m | reason=" + request.getDelayReason(),
                "Procedure delay recorded",
                saved.getHospitalId()
        );

        return saved;
    }

    public ProcedureRecord updateProcedureStatus(Long procedureId, ProcedureStatus newStatus, String actor) {
        ProcedureRecord procedure = getProcedureById(procedureId);
        ProcedureStatus oldStatus = procedure.getStatus();
        procedure.setStatus(newStatus);
        procedure.setLastUpdated(LocalDateTime.now());

        if (newStatus == ProcedureStatus.IN_PROGRESS && procedure.getActualStartTime() == null) {
            procedure.setActualStartTime(LocalDateTime.now());
        } else if (newStatus == ProcedureStatus.COMPLETED && procedure.getActualEndTime() == null) {
            procedure.setActualEndTime(LocalDateTime.now());
        }

        return procedureRepository.save(procedure);
    }
}

