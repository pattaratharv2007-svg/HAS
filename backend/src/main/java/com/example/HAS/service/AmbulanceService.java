package com.example.HAS.service;

import com.example.HAS.dto.AmbulanceLocationUpdate;
import com.example.HAS.entity.AlertSeverity;
import com.example.HAS.entity.AlertType;
import com.example.HAS.entity.AmbulanceStatus;
import com.example.HAS.entity.AmbulanceUnit;
import com.example.HAS.repository.AmbulanceUnitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AmbulanceService {

    private final AmbulanceUnitRepository ambulanceUnitRepository;
    private final AlertService alertService;
    private final AuditService auditService;

    public AmbulanceService(AmbulanceUnitRepository ambulanceUnitRepository,
                            AlertService alertService,
                            AuditService auditService) {
        this.ambulanceUnitRepository = ambulanceUnitRepository;
        this.alertService = alertService;
        this.auditService = auditService;
    }

    public List<AmbulanceUnit> getAllUnits() {
        return ambulanceUnitRepository.findAll();
    }

    public AmbulanceUnit getUnitById(Long id) {
        return ambulanceUnitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ambulance unit not found with id: " + id));
    }

    public AmbulanceUnit registerUnit(AmbulanceUnit unit, String actor) {
        AmbulanceUnit saved = ambulanceUnitRepository.save(unit);
        auditService.log(
                actor != null ? actor : "ADMIN",
                "AMBULANCE_COORDINATOR",
                "AMBULANCE_REGISTER",
                "AmbulanceUnit",
                saved.getId().toString(),
                null,
                saved.getUnitNumber(),
                "Registered ambulance unit",
                null
        );
        return saved;
    }

    public AmbulanceUnit updateLocationAndEta(Long unitId, AmbulanceLocationUpdate update, String actor) {
        AmbulanceUnit unit = getUnitById(unitId);

        unit.setLocationAvailable(update.isLocationAvailable());

        // T4.2: Unavailable location is clearly indicated rather than fabricated
        if (update.isLocationAvailable()) {
            unit.setCurrentLatitude(update.getLatitude());
            unit.setCurrentLongitude(update.getLongitude());
            unit.setSpeedKmH(update.getSpeedKmH());
        }

        if (update.getDestinationHospitalId() != null) {
            unit.setDestinationHospitalId(update.getDestinationHospitalId());
        }

        if (update.getEstimatedArrivalMinutes() != null) {
            unit.setEstimatedArrivalMinutes(update.getEstimatedArrivalMinutes());
        }

        if (update.getStatus() != null) {
            unit.setStatus(update.getStatus());
        }

        unit.setLastLocationUpdate(LocalDateTime.now());
        AmbulanceUnit saved = ambulanceUnitRepository.save(unit);

        // T4.3: Create incoming arrival alert if en route to destination hospital
        if (unit.getStatus() == AmbulanceStatus.EN_ROUTE_TO_HOSPITAL && unit.getDestinationHospitalId() != null) {
            alertService.createAlert(
                    unit.getDestinationHospitalId(),
                    null,
                    "Incoming Ambulance Alert: " + unit.getUnitNumber(),
                    "Unit " + unit.getUnitNumber() + " is en route with ETA approx "
                            + (unit.getEstimatedArrivalMinutes() != null ? unit.getEstimatedArrivalMinutes() + " mins" : "calculating..."),
                    AlertSeverity.HIGH,
                    AlertType.AMBULANCE_INCOMING,
                    "AmbulanceUnit",
                    unit.getId().toString()
            );
        }

        return saved;
    }
}

