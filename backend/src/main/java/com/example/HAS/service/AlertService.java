package com.example.HAS.service;

import com.example.HAS.dto.AlertAcknowledgeRequest;
import com.example.HAS.entity.Alert;
import com.example.HAS.entity.AlertSeverity;
import com.example.HAS.entity.AlertType;
import com.example.HAS.repository.AlertRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final AuditService auditService;

    public AlertService(AlertRepository alertRepository, AuditService auditService) {
        this.alertRepository = alertRepository;
        this.auditService = auditService;
    }

    public Alert createAlert(Long hospitalId, Long departmentId, String title, String message, AlertSeverity severity, AlertType alertType, String sourceRecordType, String sourceRecordId) {
        Alert alert = new Alert(hospitalId, departmentId, title, message, severity, alertType, sourceRecordType, sourceRecordId);
        return alertRepository.save(alert);
    }

    public List<Alert> getAlertsForHospital(Long hospitalId, Boolean isAcknowledged) {
        if (isAcknowledged != null) {
            return alertRepository.findByHospitalIdAndIsAcknowledgedOrderByCreatedAtDesc(hospitalId, isAcknowledged);
        }
        return alertRepository.findByHospitalIdOrderByCreatedAtDesc(hospitalId);
    }

    public List<Alert> getAllAlerts() {
        return alertRepository.findAllByOrderByCreatedAtDesc();
    }

    public Alert acknowledgeAlert(Long alertId, AlertAcknowledgeRequest request) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with id: " + alertId));

        if (alert.isAcknowledged()) {
            return alert; // idempotent acknowledgement per T5.3
        }

        alert.setAcknowledged(true);
        alert.setAcknowledgedBy(request.getAcknowledgedBy());
        alert.setAcknowledgedAt(LocalDateTime.now());
        Alert updated = alertRepository.save(alert);

        auditService.log(
                request.getAcknowledgedBy(),
                "RESPONDER",
                "ALERT_ACKNOWLEDGE",
                "Alert",
                alert.getId().toString(),
                "isAcknowledged=false",
                "isAcknowledged=true",
                "Acknowledged alert: " + alert.getTitle(),
                alert.getHospitalId()
        );

        return updated;
    }

    public List<Alert> checkAndEscalateAlerts(int escalationWindowMinutes) {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(escalationWindowMinutes);
        List<Alert> unacknowledged = alertRepository.findByIsAcknowledgedFalseAndCreatedAtBefore(cutoff);

        for (Alert alert : unacknowledged) {
            if (!alert.isEscalated() && (alert.getSeverity() == AlertSeverity.HIGH || alert.getSeverity() == AlertSeverity.CRITICAL)) {
                alert.setEscalated(true);
                alert.setEscalatedToRole("OPERATIONS_MANAGER");
                alert.setEscalatedAt(LocalDateTime.now());
                alertRepository.save(alert);

                auditService.log(
                        "SYSTEM_ESCALATION",
                        "SYSTEM",
                        "ALERT_ESCALATED",
                        "Alert",
                        alert.getId().toString(),
                        "escalated=false",
                        "escalated=true",
                        "Escalated unacknowledged critical alert to OPERATIONS_MANAGER",
                        alert.getHospitalId()
                );
            }
        }
        return unacknowledged;
    }
}

