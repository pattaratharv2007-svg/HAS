package com.example.HAS.repository;

import com.example.HAS.entity.ForecastRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForecastRecordRepository extends JpaRepository<ForecastRecord, Long> {
    List<ForecastRecord> findByHospitalIdOrderByGeneratedAtDesc(Long hospitalId);
    List<ForecastRecord> findByHospitalIdAndMetricName(Long hospitalId, String metricName);
}

