package com.example.HAS.controller;

import com.example.HAS.dto.ApiResponse;
import com.example.HAS.dto.CapacityUpdateRequest;
import com.example.HAS.entity.DepartmentCapacity;
import com.example.HAS.service.CapacityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/capacity")
@CrossOrigin(origins = "*")
public class CapacityController {

    private final CapacityService capacityService;

    public CapacityController(CapacityService capacityService) {
        this.capacityService = capacityService;
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<ApiResponse<List<DepartmentCapacity>>> getHospitalCapacities(@PathVariable Long hospitalId) {
        List<DepartmentCapacity> capacities = capacityService.getHospitalCapacities(hospitalId);
        return ResponseEntity.ok(ApiResponse.ok(capacities));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<DepartmentCapacity>> getDepartmentCapacity(@PathVariable Long departmentId) {
        DepartmentCapacity capacity = capacityService.getCapacityByDepartment(departmentId);
        return ResponseEntity.ok(ApiResponse.ok(capacity));
    }

    // T3.2: Role-specific update forms
    @PutMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<DepartmentCapacity>> updateDepartmentCapacity(
            @PathVariable Long departmentId,
            @Valid @RequestBody CapacityUpdateRequest request) {
        DepartmentCapacity updated = capacityService.updateCapacity(departmentId, request);
        return ResponseEntity.ok(ApiResponse.ok("Capacity updated successfully", updated));
    }
}

