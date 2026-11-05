package com.example.HAS.repository;

import com.example.HAS.entity.ProcedureRecord;
import com.example.HAS.entity.ProcedureStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcedureRecordRepository extends JpaRepository<ProcedureRecord, Long> {
    List<ProcedureRecord> findByHospitalIdOrderByScheduledStartTimeAsc(Long hospitalId);
    List<ProcedureRecord> findByHospitalIdAndStatus(Long hospitalId, ProcedureStatus status);
    List<ProcedureRecord> findByDepartmentId(Long departmentId);
}

