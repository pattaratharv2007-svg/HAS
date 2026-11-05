package com.example.HAS.repository;

import com.example.HAS.entity.AlertRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRuleRepository extends JpaRepository<AlertRule, Long> {
    List<AlertRule> findByEnabledTrue();
    List<AlertRule> findByHospitalIdOrHospitalIdIsNull(Long hospitalId);
}

