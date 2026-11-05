package com.example.HAS.service;

import com.example.HAS.entity.AuditEvent;
import com.example.HAS.repository.AuditEventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditService {

    private final AuditEventRepository auditEventRepository;

    public AuditService(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    public AuditEvent log(String actor, String actorRole, String action, String targetType, String targetId, String beforeValue, String afterValue, String details, Long hospitalId) {
        AuditEvent event = new AuditEvent(actor, actorRole, action, targetType, targetId, beforeValue, afterValue, details, hospitalId);
        return auditEventRepository.save(event);
    }

    public List<AuditEvent> getAllAudits() {
        return auditEventRepository.findAllByOrderByTimestampDesc();
    }

    public List<AuditEvent> getAuditsByHospital(Long hospitalId) {
        return auditEventRepository.findByHospitalIdOrderByTimestampDesc(hospitalId);
    }

    public List<AuditEvent> getAuditsByActor(String actor) {
        return auditEventRepository.findByActorOrderByTimestampDesc(actor);
    }

    public List<AuditEvent> getAuditsByTargetType(String targetType) {
        return auditEventRepository.findByTargetTypeOrderByTimestampDesc(targetType);
    }

    public List<AuditEvent> getAuditsByTimeRange(LocalDateTime start, LocalDateTime end) {
        return auditEventRepository.findByTimestampBetweenOrderByTimestampDesc(start, end);
    }
}

