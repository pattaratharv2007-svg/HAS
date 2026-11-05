package com.example.HAS.controller;

import com.example.HAS.dto.ApiResponse;
import com.example.HAS.entity.Department;
import com.example.HAS.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartmentsByHospital(
            @PathVariable Long hospitalId,
            @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {
        List<Department> departments = departmentService.getDepartmentsByHospital(hospitalId, activeOnly);
        return ResponseEntity.ok(ApiResponse.ok(departments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Department>> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(departmentService.getDepartmentById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Department>> createDepartment(
            @Valid @RequestBody Department department,
            @RequestParam(required = false, defaultValue = "admin") String actor) {
        Department saved = departmentService.createDepartment(department, actor);
        return ResponseEntity.ok(ApiResponse.ok("Department created successfully", saved));
    }

    @PutMapping("/{id}/active")
    public ResponseEntity<ApiResponse<Department>> setDepartmentActiveState(
            @PathVariable Long id,
            @RequestParam boolean active,
            @RequestParam(required = false, defaultValue = "admin") String actor) {
        Department updated = departmentService.setDepartmentActiveState(id, active, actor);
        return ResponseEntity.ok(ApiResponse.ok("Department active status updated", updated));
    }
}

