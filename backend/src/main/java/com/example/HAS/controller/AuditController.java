package com.example.HAS.controller;

import com.example.HAS.dto.ApiResponse;
import com.example.HAS.entity.AuditEvent;
import com.example.HAS.service.AuditService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audits")
@CrossOrigin(origins = "*")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditEvent>>> getAudits(
            @RequestParam(required = false) Long hospitalId,
            @RequestParam(required = false) String actor,
            @RequestParam(required = false) String targetType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        List<AuditEvent> results;
        if (hospitalId != null) {
            results = auditService.getAuditsByHospital(hospitalId);
        } else if (actor != null) {
            results = auditService.getAuditsByActor(actor);
        } else if (targetType != null) {
            results = auditService.getAuditsByTargetType(targetType);
        } else if (start != null && end != null) {
            results = auditService.getAuditsByTimeRange(start, end);
        } else {
            results = auditService.getAllAudits();
        }

        return ResponseEntity.ok(ApiResponse.ok(results));
    }
}

