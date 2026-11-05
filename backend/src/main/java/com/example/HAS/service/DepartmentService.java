package com.example.HAS.service;

import com.example.HAS.entity.Department;
import com.example.HAS.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final AuditService auditService;

    public DepartmentService(DepartmentRepository departmentRepository, AuditService auditService) {
        this.departmentRepository = departmentRepository;
        this.auditService = auditService;
    }

    public List<Department> getDepartmentsByHospital(Long hospitalId, boolean activeOnly) {
        if (activeOnly) {
            return departmentRepository.findByHospitalIdAndActive(hospitalId, true);
        }
        return departmentRepository.findByHospitalId(hospitalId);
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with id: " + id));
    }

    public Department createDepartment(Department department, String actor) {
        Department saved = departmentRepository.save(department);
        auditService.log(
                actor != null ? actor : "ADMIN",
                "ADMINISTRATOR",
                "DEPARTMENT_CREATE",
                "Department",
                saved.getId().toString(),
                null,
                saved.getName() + " (" + saved.getCode() + ")",
                "Created hospital department",
                saved.getHospitalId()
        );
        return saved;
    }

    public Department setDepartmentActiveState(Long departmentId, boolean active, String actor) {
        Department dept = getDepartmentById(departmentId);
        boolean prev = dept.isActive();
        dept.setActive(active);
        Department saved = departmentRepository.save(dept);

        auditService.log(
                actor != null ? actor : "ADMIN",
                "ADMINISTRATOR",
                "DEPARTMENT_STATUS_UPDATE",
                "Department",
                dept.getId().toString(),
                "active=" + prev,
                "active=" + active,
                "Updated department active status",
                dept.getHospitalId()
        );

        return saved;
    }
}

