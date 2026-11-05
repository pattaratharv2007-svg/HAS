package com.example.HAS.repository;

import com.example.HAS.entity.DepartmentCapacity;
import com.example.HAS.entity.VerificationState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentCapacityRepository extends JpaRepository<DepartmentCapacity, Long> {
    Optional<DepartmentCapacity> findByDepartmentId(Long departmentId);
    List<DepartmentCapacity> findByHospitalId(Long hospitalId);
    List<DepartmentCapacity> findByVerificationState(VerificationState state);
    List<DepartmentCapacity> findByLastUpdatedBefore(LocalDateTime cutoff);
}

