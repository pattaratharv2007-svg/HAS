package com.example.HAS.repository;

import com.example.HAS.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByHospitalId(Long hospitalId);
    List<Department> findByHospitalIdAndActive(Long hospitalId, boolean active);
    Optional<Department> findByHospitalIdAndCode(Long hospitalId, String code);
}

