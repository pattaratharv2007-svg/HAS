package com.example.HAS.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "ambulance_units")
public class AmbulanceUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String unitNumber; // e.g., "AMB-104"

    private String licensePlate;

    private String crewLeadName;

    private String crewContactPhone;

    private String capabilities; // e.g., "Advanced Life Support (ALS), Pediatric Kit, Ventilator"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AmbulanceStatus status = AmbulanceStatus.AVAILABLE;

    private Double currentLatitude;

    private Double currentLongitude;

    private Double speedKmH;

    private Long destinationHospitalId;

    private String destinationHospitalName;

    private Integer estimatedArrivalMinutes; // ETA estimate

    private LocalDateTime lastLocationUpdate;

    private boolean locationAvailable = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    public AmbulanceUnit() {
    }

    public AmbulanceUnit(String unitNumber, String licensePlate, String crewLeadName, String crewContactPhone, String capabilities) {
        this.unitNumber = unitNumber;
        this.licensePlate = licensePlate;
        this.crewLeadName = crewLeadName;
        this.crewContactPhone = crewContactPhone;
        this.capabilities = capabilities;
        this.status = AmbulanceStatus.AVAILABLE;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUnitNumber() {
        return unitNumber;
    }

    public void setUnitNumber(String unitNumber) {
        this.unitNumber = unitNumber;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getCrewLeadName() {
        return crewLeadName;
    }

    public void setCrewLeadName(String crewLeadName) {
        this.crewLeadName = crewLeadName;
    }

    public String getCrewContactPhone() {
        return crewContactPhone;
    }

    public void setCrewContactPhone(String crewContactPhone) {
        this.crewContactPhone = crewContactPhone;
    }

    public String getCapabilities() {
        return capabilities;
    }

    public void setCapabilities(String capabilities) {
        this.capabilities = capabilities;
    }

    public AmbulanceStatus getStatus() {
        return status;
    }

    public void setStatus(AmbulanceStatus status) {
        this.status = status;
    }

    public Double getCurrentLatitude() {
        return currentLatitude;
    }

    public void setCurrentLatitude(Double currentLatitude) {
        this.currentLatitude = currentLatitude;
    }

    public Double getCurrentLongitude() {
        return currentLongitude;
    }

    public void setCurrentLongitude(Double currentLongitude) {
        this.currentLongitude = currentLongitude;
    }

    public Double getSpeedKmH() {
        return speedKmH;
    }

    public void setSpeedKmH(Double speedKmH) {
        this.speedKmH = speedKmH;
    }

    public Long getDestinationHospitalId() {
        return destinationHospitalId;
    }

    public void setDestinationHospitalId(Long destinationHospitalId) {
        this.destinationHospitalId = destinationHospitalId;
    }

    public String getDestinationHospitalName() {
        return destinationHospitalName;
    }

    public void setDestinationHospitalName(String destinationHospitalName) {
        this.destinationHospitalName = destinationHospitalName;
    }

    public Integer getEstimatedArrivalMinutes() {
        return estimatedArrivalMinutes;
    }

    public void setEstimatedArrivalMinutes(Integer estimatedArrivalMinutes) {
        this.estimatedArrivalMinutes = estimatedArrivalMinutes;
    }

    public LocalDateTime getLastLocationUpdate() {
        return lastLocationUpdate;
    }

    public void setLastLocationUpdate(LocalDateTime lastLocationUpdate) {
        this.lastLocationUpdate = lastLocationUpdate;
    }

    public boolean isLocationAvailable() {
        return locationAvailable;
    }

    public void setLocationAvailable(boolean locationAvailable) {
        this.locationAvailable = locationAvailable;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

