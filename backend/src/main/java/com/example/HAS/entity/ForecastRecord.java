package com.example.HAS.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "forecast_records")
public class ForecastRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long hospitalId;

    @NotBlank
    @Column(nullable = false)
    private String metricName; // ARRIVALS, BED_OCCUPANCY_PERCENT, ICU_DEMAND, WAIT_TIME_MINUTES, EQUIPMENT_PRESSURE

    private int timeHorizonHours; // e.g., 2h, 4h, 12h, 24h

    private double predictedValue;

    private double lowerBound;

    private double upperBound;

    private double confidenceScore; // e.g. 0.88 (88%)

    private String modelVersion = "CareLink-LSTM-v1.4";

    @Column(nullable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();

    @Column(length = 1000)
    private String limitations = "Advisory operational forecast only. Not intended for clinical diagnosis or autonomous allocation.";

    public ForecastRecord() {
    }

    public ForecastRecord(Long hospitalId, String metricName, int timeHorizonHours, double predictedValue, double lowerBound, double upperBound, double confidenceScore, String modelVersion) {
        this.hospitalId = hospitalId;
        this.metricName = metricName;
        this.timeHorizonHours = timeHorizonHours;
        this.predictedValue = predictedValue;
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.confidenceScore = confidenceScore;
        this.modelVersion = modelVersion;
        this.generatedAt = LocalDateTime.now();
        this.limitations = "Advisory operational forecast only. Not intended for clinical diagnosis or autonomous allocation.";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getMetricName() {
        return metricName;
    }

    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }

    public int getTimeHorizonHours() {
        return timeHorizonHours;
    }

    public void setTimeHorizonHours(int timeHorizonHours) {
        this.timeHorizonHours = timeHorizonHours;
    }

    public double getPredictedValue() {
        return predictedValue;
    }

    public void setPredictedValue(double predictedValue) {
        this.predictedValue = predictedValue;
    }

    public double getLowerBound() {
        return lowerBound;
    }

    public void setLowerBound(double lowerBound) {
        this.lowerBound = lowerBound;
    }

    public double getUpperBound() {
        return upperBound;
    }

    public void setUpperBound(double upperBound) {
        this.upperBound = upperBound;
    }

    public double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public String getLimitations() {
        return limitations;
    }

    public void setLimitations(String limitations) {
        this.limitations = limitations;
    }
}

