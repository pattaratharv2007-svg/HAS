package com.example.HAS.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "alert_rules")
public class AlertRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String metricName; // e.g. "BED_OCCUPANCY_PERCENT", "ICU_AVAILABLE_COUNT", "DATA_AGE_MINUTES", "PROCEDURE_DELAY_MINUTES"

    private double thresholdValue;

    private String operator = ">="; // >=, <=, ==, !=

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertSeverity severity = AlertSeverity.HIGH;

    private boolean enabled = true;

    private String description;

    private Long hospitalId; // null = network-wide

    public AlertRule() {
    }

    public AlertRule(String name, String metricName, double thresholdValue, String operator, AlertSeverity severity, boolean enabled, String description, Long hospitalId) {
        this.name = name;
        this.metricName = metricName;
        this.thresholdValue = thresholdValue;
        this.operator = operator;
        this.severity = severity;
        this.enabled = enabled;
        this.description = description;
        this.hospitalId = hospitalId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMetricName() {
        return metricName;
    }

    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }

    public double getThresholdValue() {
        return thresholdValue;
    }

    public void setThresholdValue(double thresholdValue) {
        this.thresholdValue = thresholdValue;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public AlertSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(AlertSeverity severity) {
        this.severity = severity;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }
}

