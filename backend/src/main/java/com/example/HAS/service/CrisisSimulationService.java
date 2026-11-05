package com.example.HAS.service;

import com.example.HAS.dto.SimulationRunRequest;
import com.example.HAS.entity.CrisisSimulation;
import com.example.HAS.repository.CrisisSimulationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CrisisSimulationService {

    private final CrisisSimulationRepository simulationRepository;
    private final AuditService auditService;

    public CrisisSimulationService(CrisisSimulationRepository simulationRepository, AuditService auditService) {
        this.simulationRepository = simulationRepository;
        this.auditService = auditService;
    }

    public List<CrisisSimulation> getAllSimulations() {
        return simulationRepository.findAllByOrderByCreatedAtDesc();
    }

    public CrisisSimulation getSimulationById(Long id) {
        return simulationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Simulation scenario not found with id: " + id));
    }

    public CrisisSimulation runIsolatedSimulation(SimulationRunRequest request) {
        // T7.2: Calculate scenario outcomes without modifying live operational records
        double baseOccupancy = 72.0;
        double surgeFactor = request.getSurgeMultiplier() > 0 ? request.getSurgeMultiplier() : 1.0;
        double staffPenalty = (request.getStaffReductionPercent() / 100.0) * 15.0;
        double bedPenalty = (request.getBedReductionPercent() / 100.0) * 20.0;

        double projectedBedOccupancy = Math.min(100.0, (baseOccupancy * surgeFactor) + bedPenalty);
        int projectedIcuDeficit = Math.max(0, (int) Math.round((surgeFactor - 1.0) * 12 + (staffPenalty / 2)));
        int projectedWaitTimeIncrease = (int) Math.round((surgeFactor - 1.0) * 90 + staffPenalty * 3);

        String riskLevel = projectedBedOccupancy > 90 ? "CRITICAL" : (projectedBedOccupancy > 80 ? "HIGH" : "MEDIUM");

        CrisisSimulation simulation = new CrisisSimulation(
                request.getScenarioName(),
                request.getScenarioType(),
                request.getSurgeMultiplier(),
                request.getDurationHours(),
                request.getStaffReductionPercent(),
                request.getBedReductionPercent(),
                request.getAffectedHospitalIds(),
                request.getCreatedBy() != null ? request.getCreatedBy() : "PLANNER"
        );

        simulation.setProjectedBedOccupancyPercent(Math.round(projectedBedOccupancy * 10.0) / 10.0);
        simulation.setProjectedIcuDeficit(projectedIcuDeficit);
        simulation.setProjectedWaitTimeIncreaseMinutes(projectedWaitTimeIncrease);
        simulation.setResourcePressureRisk(riskLevel);
        simulation.setNotes(request.getNotes());
        simulation.setSimulationDisclaimer("SIMULATION — NOT LIVE HOSPITAL DATA");
        simulation.setCreatedAt(LocalDateTime.now());

        CrisisSimulation saved = simulationRepository.save(simulation);

        auditService.log(
                simulation.getCreatedBy(),
                "ADMINISTRATOR",
                "CRISIS_SIMULATION_RUN",
                "CrisisSimulation",
                saved.getId().toString(),
                null,
                "projectedOccupancy=" + saved.getProjectedBedOccupancyPercent() + "%",
                "Ran crisis scenario simulation '" + saved.getScenarioName() + "' (Isolated test)",
                null
        );

        return saved;
    }
}

