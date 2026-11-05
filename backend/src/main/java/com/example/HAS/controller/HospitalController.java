package com.example.HAS.controller;

import com.example.HAS.dto.ApiResponse;
import com.example.HAS.dto.HospitalStatusUpdateRequest;
import com.example.HAS.entity.Hospital;
import com.example.HAS.service.HospitalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hospital>>> getHospitals(@RequestParam(required = false) String search) {
        List<Hospital> hospitals = hospitalService.searchHospitals(search);
        return ResponseEntity.ok(ApiResponse.ok(hospitals));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Hospital>>> getActiveHospitals() {
        return ResponseEntity.ok(ApiResponse.ok(hospitalService.getActiveParticipatingHospitals()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Hospital>> getHospitalById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(hospitalService.getHospitalById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Hospital>> registerHospital(
            @Valid @RequestBody Hospital hospital,
            @RequestParam(required = false, defaultValue = "admin") String actor) {
        Hospital saved = hospitalService.registerHospital(hospital, actor);
        return ResponseEntity.ok(ApiResponse.ok("Hospital registered successfully", saved));
    }

    @PutMapping("/{id}/participation")
    public ResponseEntity<ApiResponse<Hospital>> updateParticipation(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false, defaultValue = "admin") String actor) {
        Hospital updated = hospitalService.updateParticipationStatus(id, status, actor);
        return ResponseEntity.ok(ApiResponse.ok("Participation status updated", updated));
    }

    // T3.3: Hospital-wide status control
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Hospital>> updateHospitalStatus(
            @PathVariable Long id,
            @Valid @RequestBody HospitalStatusUpdateRequest request) {
        Hospital updated = hospitalService.updateHospitalStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Hospital operational status updated", updated));
    }
}

