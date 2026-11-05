package com.example.HAS.controller;

import com.example.HAS.dto.AmbulanceLocationUpdate;
import com.example.HAS.dto.ApiResponse;
import com.example.HAS.entity.AmbulanceUnit;
import com.example.HAS.service.AmbulanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ambulances")
@CrossOrigin(origins = "*")
public class AmbulanceController {

    private final AmbulanceService ambulanceService;

    public AmbulanceController(AmbulanceService ambulanceService) {
        this.ambulanceService = ambulanceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AmbulanceUnit>>> getAllUnits() {
        return ResponseEntity.ok(ApiResponse.ok(ambulanceService.getAllUnits()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AmbulanceUnit>> getUnitById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(ambulanceService.getUnitById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AmbulanceUnit>> registerUnit(
            @Valid @RequestBody AmbulanceUnit unit,
            @RequestParam(required = false, defaultValue = "coordinator") String actor) {
        AmbulanceUnit saved = ambulanceService.registerUnit(unit, actor);
        return ResponseEntity.ok(ApiResponse.ok("Ambulance unit registered", saved));
    }

    // T4.2: Location and ETA updates
    @PutMapping("/{id}/location-eta")
    public ResponseEntity<ApiResponse<AmbulanceUnit>> updateLocationAndEta(
            @PathVariable Long id,
            @RequestBody AmbulanceLocationUpdate update,
            @RequestParam(required = false, defaultValue = "crew") String actor) {
        AmbulanceUnit updated = ambulanceService.updateLocationAndEta(id, update, actor);
        return ResponseEntity.ok(ApiResponse.ok("Location and ETA updated", updated));
    }
}

