package com.example.HAS.repository;

import com.example.HAS.entity.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    List<AuditEvent> findByHospitalIdOrderByTimestampDesc(Long hospitalId);
    List<AuditEvent> findByActorOrderByTimestampDesc(String actor);
    List<AuditEvent> findByTargetTypeOrderByTimestampDesc(String targetType);
    List<AuditEvent> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);
    List<AuditEvent> findAllByOrderByTimestampDesc();
}

