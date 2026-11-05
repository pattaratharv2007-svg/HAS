package com.example.HAS.dto;

import com.example.HAS.entity.AmbulanceStatus;

public class AmbulanceLocationUpdate {

    private Double latitude;
    private Double longitude;
    private Double speedKmH;
    private Long destinationHospitalId;
    private Integer estimatedArrivalMinutes;
    private AmbulanceStatus status;
    private boolean locationAvailable = true;

    public AmbulanceLocationUpdate() {
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
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

    public Integer getEstimatedArrivalMinutes() {
        return estimatedArrivalMinutes;
    }

    public void setEstimatedArrivalMinutes(Integer estimatedArrivalMinutes) {
        this.estimatedArrivalMinutes = estimatedArrivalMinutes;
    }

    public AmbulanceStatus getStatus() {
        return status;
    }

    public void setStatus(AmbulanceStatus status) {
        this.status = status;
    }

    public boolean isLocationAvailable() {
        return locationAvailable;
    }

    public void setLocationAvailable(boolean locationAvailable) {
        this.locationAvailable = locationAvailable;
    }
}

