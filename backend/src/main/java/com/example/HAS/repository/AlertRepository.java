package com.example.HAS.repository;

import com.example.HAS.entity.Alert;
import com.example.HAS.entity.AlertSeverity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByHospitalIdOrderByCreatedAtDesc(Long hospitalId);
    List<Alert> findByHospitalIdAndIsAcknowledgedOrderByCreatedAtDesc(Long hospitalId, boolean isAcknowledged);
    List<Alert> findBySeverityAndIsAcknowledged(AlertSeverity severity, boolean isAcknowledged);
    List<Alert> findByIsAcknowledgedFalseAndCreatedAtBefore(LocalDateTime cutoff);
    List<Alert> findAllByOrderByCreatedAtDesc();
}

