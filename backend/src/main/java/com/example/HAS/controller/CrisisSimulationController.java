package com.example.HAS.controller;

import com.example.HAS.dto.ApiResponse;
import com.example.HAS.dto.SimulationRunRequest;
import com.example.HAS.entity.CrisisSimulation;
import com.example.HAS.service.CrisisSimulationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulations")
@CrossOrigin(origins = "*")
public class CrisisSimulationController {

    private final CrisisSimulationService simulationService;

    public CrisisSimulationController(CrisisSimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CrisisSimulation>>> getAllSimulations() {
        return ResponseEntity.ok(ApiResponse.ok(simulationService.getAllSimulations()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CrisisSimulation>> getSimulationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(simulationService.getSimulationById(id)));
    }

    // T7.2: Run isolated simulation without modifying live operational records
    @PostMapping("/run")
    public ResponseEntity<ApiResponse<CrisisSimulation>> runSimulation(@Valid @RequestBody SimulationRunRequest request) {
        CrisisSimulation result = simulationService.runIsolatedSimulation(request);
        return ResponseEntity.ok(ApiResponse.ok("Crisis scenario simulation completed (Isolated)", result));
    }
}

