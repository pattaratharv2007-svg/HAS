package com.example.HAS.controller;

import com.example.HAS.dto.ApiResponse;
import com.example.HAS.dto.ProcedureDelayRequest;
import com.example.HAS.entity.ProcedureRecord;
import com.example.HAS.entity.ProcedureStatus;
import com.example.HAS.service.ProcedureService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procedures")
@CrossOrigin(origins = "*")
public class ProcedureController {

    private final ProcedureService procedureService;

    public ProcedureController(ProcedureService procedureService) {
        this.procedureService = procedureService;
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<ApiResponse<List<ProcedureRecord>>> getProceduresForHospital(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(ApiResponse.ok(procedureService.getProceduresForHospital(hospitalId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProcedureRecord>> getProcedureById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(procedureService.getProcedureById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProcedureRecord>> scheduleProcedure(
            @Valid @RequestBody ProcedureRecord procedure,
            @RequestParam(required = false, defaultValue = "doctor") String actor) {
        ProcedureRecord saved = procedureService.scheduleProcedure(procedure, actor);
        return ResponseEntity.ok(ApiResponse.ok("Procedure scheduled successfully", saved));
    }

    // T8.2: Configure delay & trigger threshold alerts
    @PutMapping("/{id}/delay")
    public ResponseEntity<ApiResponse<ProcedureRecord>> logProcedureDelay(
            @PathVariable Long id,
            @Valid @RequestBody ProcedureDelayRequest request) {
        ProcedureRecord updated = procedureService.logProcedureDelay(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Procedure delay recorded and alerts evaluated", updated));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ProcedureRecord>> updateStatus(
            @PathVariable Long id,
            @RequestParam ProcedureStatus status,
            @RequestParam(required = false, defaultValue = "doctor") String actor) {
        ProcedureRecord updated = procedureService.updateProcedureStatus(id, status, actor);
        return ResponseEntity.ok(ApiResponse.ok("Procedure status updated to " + status, updated));
    }
}

