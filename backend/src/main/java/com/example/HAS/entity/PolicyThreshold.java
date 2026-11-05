package com.example.HAS.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "policy_thresholds")
public class PolicyThreshold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String policyKey;

    private String policyValue;

    private int freshnessWindowMinutes = 15;

    private int staleWindowMinutes = 30;

    private int escalationWindowMinutes = 10;

    private String version = "v1.0";

    @Column(nullable = false)
    private LocalDateTime effectiveFrom = LocalDateTime.now();

    private String updatedBy;

    public PolicyThreshold() {
    }

    public PolicyThreshold(String policyKey, String policyValue, int freshnessWindowMinutes, int staleWindowMinutes, int escalationWindowMinutes, String version, String updatedBy) {
        this.policyKey = policyKey;
        this.policyValue = policyValue;
        this.freshnessWindowMinutes = freshnessWindowMinutes;
        this.staleWindowMinutes = staleWindowMinutes;
        this.escalationWindowMinutes = escalationWindowMinutes;
        this.version = version;
        this.updatedBy = updatedBy;
        this.effectiveFrom = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPolicyKey() {
        return policyKey;
    }

    public void setPolicyKey(String policyKey) {
        this.policyKey = policyKey;
    }

    public String getPolicyValue() {
        return policyValue;
    }

    public void setPolicyValue(String policyValue) {
        this.policyValue = policyValue;
    }

    public int getFreshnessWindowMinutes() {
        return freshnessWindowMinutes;
    }

    public void setFreshnessWindowMinutes(int freshnessWindowMinutes) {
        this.freshnessWindowMinutes = freshnessWindowMinutes;
    }

    public int getStaleWindowMinutes() {
        return staleWindowMinutes;
    }

    public void setStaleWindowMinutes(int staleWindowMinutes) {
        this.staleWindowMinutes = staleWindowMinutes;
    }

    public int getEscalationWindowMinutes() {
        return escalationWindowMinutes;
    }

    public void setEscalationWindowMinutes(int escalationWindowMinutes) {
        this.escalationWindowMinutes = escalationWindowMinutes;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public LocalDateTime getEffectiveFrom() {
        return effectiveFrom;
    }

    public void setEffectiveFrom(LocalDateTime effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}

