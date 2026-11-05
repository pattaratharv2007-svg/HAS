package com.example.HAS.service;

import com.example.HAS.dto.CapacityUpdateRequest;
import com.example.HAS.entity.*;
import com.example.HAS.repository.DepartmentCapacityRepository;
import com.example.HAS.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CapacityService {

    private final DepartmentCapacityRepository capacityRepository;
    private final DepartmentRepository departmentRepository;
    private final AlertService alertService;
    private final AuditService auditService;

    @Value("${carelink.policy.freshness-threshold-minutes:15}")
    private int freshnessThresholdMinutes;

    @Value("${carelink.policy.stale-threshold-minutes:30}")
    private int staleThresholdMinutes;

    public CapacityService(DepartmentCapacityRepository capacityRepository,
                           DepartmentRepository departmentRepository,
                           AlertService alertService,
                           AuditService auditService) {
        this.capacityRepository = capacityRepository;
        this.departmentRepository = departmentRepository;
        this.alertService = alertService;
        this.auditService = auditService;
    }

    public List<DepartmentCapacity> getHospitalCapacities(Long hospitalId) {
        List<DepartmentCapacity> capacities = capacityRepository.findByHospitalId(hospitalId);
        capacities.forEach(this::computeDynamicFreshness);
        return capacities;
    }

    public DepartmentCapacity getCapacityByDepartment(Long departmentId) {
        DepartmentCapacity capacity = capacityRepository.findByDepartmentId(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Capacity not found for department: " + departmentId));
        computeDynamicFreshness(capacity);
        return capacity;
    }

    public DepartmentCapacity updateCapacity(Long departmentId, CapacityUpdateRequest request) {
        // T3.1: Counts cannot be negative and available counts cannot exceed valid totals
        if (request.getTotalBeds() < 0 || request.getOccupiedBeds() < 0 || request.getAvailableBeds() < 0 || request.getOutOfServiceBeds() < 0) {
            throw new IllegalArgumentException("Bed counts cannot be negative");
        }

        if (request.getOccupiedBeds() + request.getAvailableBeds() + request.getOutOfServiceBeds() > request.getTotalBeds()) {
            throw new IllegalArgumentException("Sum of occupied, available, and out-of-service beds ("
                    + (request.getOccupiedBeds() + request.getAvailableBeds() + request.getOutOfServiceBeds())
                    + ") exceeds total beds (" + request.getTotalBeds() + ")");
        }

        DepartmentCapacity capacity = capacityRepository.findByDepartmentId(departmentId)
                .orElseGet(() -> {
                    Department dept = departmentRepository.findById(departmentId)
                            .orElseThrow(() -> new IllegalArgumentException("Department not found: " + departmentId));
                    DepartmentCapacity newCap = new DepartmentCapacity();
                    newCap.setDepartmentId(dept.getId());
                    newCap.setHospitalId(dept.getHospitalId());
                    newCap.setDepartmentName(dept.getName());
                    return newCap;
                });

        String beforeVal = "total=" + capacity.getTotalBeds() + ", occ=" + capacity.getOccupiedBeds() + ", avail=" + capacity.getAvailableBeds();

        capacity.setTotalBeds(request.getTotalBeds());
        capacity.setOccupiedBeds(request.getOccupiedBeds());
        capacity.setAvailableBeds(request.getAvailableBeds());
        capacity.setOutOfServiceBeds(request.getOutOfServiceBeds());

        if (request.getIcuTotal() >= 0) {
            capacity.setIcuTotal(request.getIcuTotal());
            capacity.setIcuOccupied(request.getIcuOccupied());
            capacity.setIcuAvailable(request.getIcuAvailable());
        }

        if (request.getVentilatorsTotal() >= 0) {
            capacity.setVentilatorsTotal(request.getVentilatorsTotal());
            capacity.setVentilatorsAvailable(request.getVentilatorsAvailable());
        }

        if (request.getStaffOnDuty() >= 0) {
            capacity.setStaffOnDuty(request.getStaffOnDuty());
        }

        if (request.getActiveWorkloadLevel() != null) {
            capacity.setActiveWorkloadLevel(request.getActiveWorkloadLevel());
        }

        capacity.setLastUpdated(LocalDateTime.now());
        capacity.setUpdatedBy(request.getUpdatedBy() != null ? request.getUpdatedBy() : "STAFF");
        capacity.setUpdaterRole(request.getUpdaterRole() != null ? request.getUpdaterRole() : "BED_MANAGER");
        capacity.setVerificationState(request.getVerificationState() != null ? request.getVerificationState() : VerificationState.VERIFIED);
        capacity.setVerificationNotes(request.getVerificationNotes());

        DepartmentCapacity saved = capacityRepository.save(capacity);

        // Audit update
        String afterVal = "total=" + saved.getTotalBeds() + ", occ=" + saved.getOccupiedBeds() + ", avail=" + saved.getAvailableBeds();
        auditService.log(
                saved.getUpdatedBy(),
                saved.getUpdaterRole(),
                "CAPACITY_UPDATE",
                "DepartmentCapacity",
                saved.getId().toString(),
                beforeVal,
                afterVal,
                "Updated capacity for " + saved.getDepartmentName(),
                saved.getHospitalId()
        );

        // Check if available beds are 0 or occupancy > 95% -> Trigger overload alert
        if (saved.getTotalBeds() > 0 && (double) saved.getOccupiedBeds() / saved.getTotalBeds() >= 0.95) {
            alertService.createAlert(
                    saved.getHospitalId(),
                    saved.getDepartmentId(),
                    "High Bed Occupancy Warning",
                    "Department " + saved.getDepartmentName() + " has reached "
                            + Math.round(((double) saved.getOccupiedBeds() / saved.getTotalBeds()) * 100) + "% bed occupancy.",
                    AlertSeverity.HIGH,
                    AlertType.CAPACITY_OVERLOAD,
                    "DepartmentCapacity",
                    saved.getId().toString()
            );
        }

        return saved;
    }

    public void computeDynamicFreshness(DepartmentCapacity capacity) {
        if (capacity.getLastUpdated() == null) {
            capacity.setVerificationState(VerificationState.STALE);
            return;
        }

        long minutesOld = Duration.between(capacity.getLastUpdated(), LocalDateTime.now()).toMinutes();
        if (minutesOld > staleThresholdMinutes) {
            capacity.setVerificationState(VerificationState.STALE);
        } else if (minutesOld > freshnessThresholdMinutes) {
            capacity.setVerificationState(VerificationState.AGING);
        }
    }
}

