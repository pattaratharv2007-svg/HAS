package com.example.HAS.repository;

import com.example.HAS.entity.CrisisSimulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CrisisSimulationRepository extends JpaRepository<CrisisSimulation, Long> {
    List<CrisisSimulation> findAllByOrderByCreatedAtDesc();
    List<CrisisSimulation> findByCreatedByOrderByCreatedAtDesc(String createdBy);
}

