package com.example.HAS.dto;

import com.example.HAS.entity.ReferralStatus;
import jakarta.validation.constraints.NotNull;

public class ReferralDecisionRequest {

    @NotNull(message = "Decision status is required (ACCEPTED, DECLINED, or UNDER_REVIEW)")
    private ReferralStatus decision; // ACCEPTED, DECLINED, UNDER_REVIEW

    private String reason; // required if DECLINED or REDIRECTED

    private Long redirectedHospitalId;

    private String decidedBy;

    public ReferralDecisionRequest() {
    }

    public ReferralDecisionRequest(ReferralStatus decision, String reason, Long redirectedHospitalId, String decidedBy) {
        this.decision = decision;
        this.reason = reason;
        this.redirectedHospitalId = redirectedHospitalId;
        this.decidedBy = decidedBy;
    }

    public ReferralStatus getDecision() {
        return decision;
    }

    public void setDecision(ReferralStatus decision) {
        this.decision = decision;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Long getRedirectedHospitalId() {
        return redirectedHospitalId;
    }

    public void setRedirectedHospitalId(Long redirectedHospitalId) {
        this.redirectedHospitalId = redirectedHospitalId;
    }

    public String getDecidedBy() {
        return decidedBy;
    }

    public void setDecidedBy(String decidedBy) {
        this.decidedBy = decidedBy;
    }
}

