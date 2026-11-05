package com.example.HAS.controller;

import com.example.HAS.dto.ApiResponse;
import com.example.HAS.entity.PolicyThreshold;
import com.example.HAS.service.ReportAndAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class SystemHealthAndReportController {

    private final ReportAndAdminService adminService;

    public SystemHealthAndReportController(ReportAndAdminService adminService) {
        this.adminService = adminService;
    }

    // T9.1: Operational reports
    @GetMapping("/reports/operational")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOperationalReport() {
        return ResponseEntity.ok(ApiResponse.ok("Operational network report generated", adminService.getOperationalReport()));
    }

    // T9.4: System health dashboard
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemHealth() {
        return ResponseEntity.ok(ApiResponse.ok("System component status", adminService.getSystemHealth()));
    }

    // T9.3: Threshold policies
    @GetMapping("/policies")
    public ResponseEntity<ApiResponse<List<PolicyThreshold>>> getPolicies() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllPolicies()));
    }

    @PutMapping("/policies/{key}")
    public ResponseEntity<ApiResponse<PolicyThreshold>> updatePolicy(
            @PathVariable String key,
            @RequestBody PolicyThreshold updatedPolicy,
            @RequestParam(required = false, defaultValue = "admin") String adminUser) {
        PolicyThreshold policy = adminService.updatePolicyThreshold(key, updatedPolicy, adminUser);
        return ResponseEntity.ok(ApiResponse.ok("Policy updated successfully", policy));
    }
}

