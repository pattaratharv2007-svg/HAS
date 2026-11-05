package com.example.HAS.config;

import com.example.HAS.entity.*;
import com.example.HAS.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final DepartmentRepository departmentRepository;
    private final DepartmentCapacityRepository capacityRepository;
    private final AmbulanceUnitRepository ambulanceRepository;
    private final AlertRepository alertRepository;
    private final AlertRuleRepository alertRuleRepository;
    private final PolicyThresholdRepository policyRepository;
    private final ProcedureRecordRepository procedureRepository;

    public DataInitializer(UserRepository userRepository,
                           HospitalRepository hospitalRepository,
                           DepartmentRepository departmentRepository,
                           DepartmentCapacityRepository capacityRepository,
                           AmbulanceUnitRepository ambulanceRepository,
                           AlertRepository alertRepository,
                           AlertRuleRepository alertRuleRepository,
                           PolicyThresholdRepository policyRepository,
                           ProcedureRecordRepository procedureRepository) {
        this.userRepository = userRepository;
        this.hospitalRepository = hospitalRepository;
        this.departmentRepository = departmentRepository;
        this.capacityRepository = capacityRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.alertRepository = alertRepository;
        this.alertRuleRepository = alertRuleRepository;
        this.policyRepository = policyRepository;
        this.procedureRepository = procedureRepository;
    }

    @Override
    public void run(String... args) {
        if (hospitalRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Seed Hospitals
        Hospital h1 = hospitalRepository.save(new Hospital(
                "City General Hospital",
                "CGH-01",
                "124 Medical Enclave, Central City",
                12.9716, 77.5946,
                "+1-800-555-0101",
                "operations@citygeneral.org",
                "Level 1 Trauma, Comprehensive Stroke, Pediatric ICU, Burn Unit"
        ));

        Hospital h2 = hospitalRepository.save(new Hospital(
                "Metro Memorial Hospital",
                "MMH-02",
                "45 Metro Boulevard, North District",
                12.9810, 77.6000,
                "+1-800-555-0102",
                "admissions@metromemorial.org",
                "Cardiology Center, General Surgery, Acute Dialysis"
        ));

        Hospital h3 = hospitalRepository.save(new Hospital(
                "Riverdale Medical Center",
                "RMC-03",
                "89 Riverside Way, South Sector",
                12.9550, 77.5800,
                "+1-800-555-0103",
                "er@riverdalemed.org",
                "Emergency Medicine, Orthopedic Trauma, Neonatal ICU"
        ));

        // 2. Seed Departments for City General
        Department ed = departmentRepository.save(new Department(h1.getId(), "Emergency Department", "ED", "EMERGENCY", "+1-800-555-0111", "Dr. Robert Vance"));
        Department icu = departmentRepository.save(new Department(h1.getId(), "Intensive Care Unit", "ICU", "ICU", "+1-800-555-0112", "Dr. Priya Sharma"));
        Department gw = departmentRepository.save(new Department(h1.getId(), "General Ward 3B", "GW-3B", "GENERAL_WARD", "+1-800-555-0113", "Nurse Supriya"));
        Department surg = departmentRepository.save(new Department(h1.getId(), "Surgical Suite", "SURG", "SURGERY", "+1-800-555-0114", "Dr. David Miller"));

        // 3. Seed Capacities (PDF T3.1)
        DepartmentCapacity edCap = new DepartmentCapacity(h1.getId(), ed.getId(), ed.getName(), 40, 32, 6, 2);
        edCap.setStaffOnDuty(18);
        edCap.setActiveWorkloadLevel("HIGH");
        capacityRepository.save(edCap);

        DepartmentCapacity icuCap = new DepartmentCapacity(h1.getId(), icu.getId(), icu.getName(), 24, 21, 3, 0);
        icuCap.setIcuTotal(24);
        icuCap.setIcuOccupied(21);
        icuCap.setIcuAvailable(3);
        icuCap.setVentilatorsTotal(20);
        icuCap.setVentilatorsAvailable(4);
        icuCap.setStaffOnDuty(12);
        icuCap.setActiveWorkloadLevel("CRITICAL");
        capacityRepository.save(icuCap);

        DepartmentCapacity gwCap = new DepartmentCapacity(h1.getId(), gw.getId(), gw.getName(), 60, 48, 10, 2);
        gwCap.setStaffOnDuty(8);
        gwCap.setActiveWorkloadLevel("NORMAL");
        capacityRepository.save(gwCap);

        // 4. Seed Users for each role
        userRepository.save(new User("admin", "admin123", "System Administrator", "admin@carelink.org", Role.ADMINISTRATOR, h1.getId(), null));
        userRepository.save(new User("doctor.priya", "doctor123", "Dr. Priya Sharma", "priya.sharma@citygeneral.org", Role.DOCTOR, h1.getId(), null));
        userRepository.save(new User("nurse.rahul", "nurse123", "Nurse Rahul Patel", "rahul.patel@citygeneral.org", Role.NURSE, h1.getId(), null));
        userRepository.save(new User("bedmanager.anil", "bed123", "Anil Kumar (Bed Ops)", "anil.k@citygeneral.org", Role.BED_MANAGER, h1.getId(), null));
        userRepository.save(new User("crew.unit104", "crew123", "Officer Mark Jenkins", "mark.j@ems.gov", Role.AMBULANCE_CREW, null, 1L));
        userRepository.save(new User("coordinator.sarah", "coord123", "Sarah Connor (Dispatch)", "sarah.c@ems.gov", Role.AMBULANCE_COORDINATOR, null, null));

        // 5. Seed Ambulance Units
        AmbulanceUnit amb1 = new AmbulanceUnit("AMB-104", "KA-01-EQ-9921", "Mark Jenkins", "+1-555-888-0104", "ALS, Cardiac Monitor, Portable Ventilator");
        amb1.setCurrentLatitude(12.9650);
        amb1.setCurrentLongitude(77.5850);
        amb1.setSpeedKmH(45.0);
        amb1.setDestinationHospitalId(h1.getId());
        amb1.setDestinationHospitalName(h1.getName());
        amb1.setEstimatedArrivalMinutes(12);
        amb1.setStatus(AmbulanceStatus.EN_ROUTE_TO_HOSPITAL);
        amb1.setLastLocationUpdate(LocalDateTime.now());
        ambulanceRepository.save(amb1);

        AmbulanceUnit amb2 = new AmbulanceUnit("AMB-108", "KA-01-EQ-4412", "Elena Rossi", "+1-555-888-0108", "BLS, Trauma Pack");
        amb2.setStatus(AmbulanceStatus.AVAILABLE);
        amb2.setLastLocationUpdate(LocalDateTime.now());
        ambulanceRepository.save(amb2);

        // 6. Seed Alerts
        alertRepository.save(new Alert(
                h1.getId(),
                icu.getId(),
                "ICU Capacity Reaching Threshold",
                "ICU availability is down to 3 beds (87.5% occupancy). Surge protocol on standby.",
                AlertSeverity.HIGH,
                AlertType.CAPACITY_OVERLOAD,
                "DepartmentCapacity",
                icuCap.getId().toString()
        ));

        // 7. Seed Policy Thresholds
        policyRepository.save(new PolicyThreshold("DEFAULT_FRESHNESS", "15", 15, 30, 10, "v1.0", "admin"));

        // 8. Seed Sample Procedure Record
        ProcedureRecord proc = new ProcedureRecord(
                h1.getId(),
                surg.getId(),
                "Emergency Exploratory Laparotomy",
                "PT-TRAUMA-991",
                "Surgical Team 1",
                LocalDateTime.now().minusMinutes(40),
                LocalDateTime.now().plusMinutes(50)
        );
        proc.setStatus(ProcedureStatus.DELAYED);
        proc.setDelayDurationMinutes(25);
        proc.setDelayReason("Pending pre-op blood crossmatch verification");
        proc.setDelayAlertTriggered(true);
        procedureRepository.save(proc);
    }
}

