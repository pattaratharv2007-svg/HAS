package com.example.HAS.controller;

import com.example.HAS.dto.AlertAcknowledgeRequest;
import com.example.HAS.dto.ApiResponse;
import com.example.HAS.entity.Alert;
import com.example.HAS.service.AlertService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Alert>>> getAllAlerts() {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getAllAlerts()));
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<ApiResponse<List<Alert>>> getHospitalAlerts(
            @PathVariable Long hospitalId,
            @RequestParam(required = false) Boolean acknowledged) {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getAlertsForHospital(hospitalId, acknowledged)));
    }

    // T5.3: Implement acknowledgement
    @PutMapping("/{id}/acknowledge")
    public ResponseEntity<ApiResponse<Alert>> acknowledgeAlert(
            @PathVariable Long id,
            @Valid @RequestBody AlertAcknowledgeRequest request) {
        Alert updated = alertService.acknowledgeAlert(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Alert acknowledged successfully", updated));
    }

    // T5.4: Escalation check
    @PostMapping("/check-escalations")
    public ResponseEntity<ApiResponse<List<Alert>>> checkEscalations(
            @RequestParam(required = false, defaultValue = "10") int escalationMinutes) {
        List<Alert> escalated = alertService.checkAndEscalateAlerts(escalationMinutes);
        return ResponseEntity.ok(ApiResponse.ok("Checked escalations", escalated));
    }
}

