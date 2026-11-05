package com.example.HAS.service;

import com.example.HAS.dto.ReferralCreateRequest;
import com.example.HAS.dto.ReferralDecisionRequest;
import com.example.HAS.entity.AlertSeverity;
import com.example.HAS.entity.AlertType;
import com.example.HAS.entity.Hospital;
import com.example.HAS.entity.ReferralRequest;
import com.example.HAS.entity.ReferralStatus;
import com.example.HAS.repository.HospitalRepository;
import com.example.HAS.repository.ReferralRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ReferralService {

    private final ReferralRequestRepository referralRepository;
    private final HospitalRepository hospitalRepository;
    private final AlertService alertService;
    private final AuditService auditService;

    public ReferralService(ReferralRequestRepository referralRepository,
                           HospitalRepository hospitalRepository,
                           AlertService alertService,
                           AuditService auditService) {
        this.referralRepository = referralRepository;
        this.hospitalRepository = hospitalRepository;
        this.alertService = alertService;
        this.auditService = auditService;
    }

    public List<ReferralRequest> getAllReferrals() {
        return referralRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<ReferralRequest> getReferralsForHospital(Long hospitalId) {
        return referralRepository.findByDestinationHospitalId(hospitalId);
    }

    public ReferralRequest getReferralById(Long id) {
        return referralRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Referral not found with id: " + id));
    }

    public ReferralRequest createReferral(ReferralCreateRequest request, String createdBy) {
        Hospital destHospital = hospitalRepository.findById(request.getDestinationHospitalId())
                .orElseThrow(() -> new IllegalArgumentException("Destination hospital not found"));

        // T2.3: Suspended hospitals are excluded from destination suggestions
        if ("SUSPENDED".equalsIgnoreCase(destHospital.getParticipationStatus())) {
            throw new IllegalStateException("Destination hospital " + destHospital.getName() + " is currently suspended from network participation.");
        }

        String referralCode = "REF-" + System.currentTimeMillis() % 1000000;

        ReferralRequest referral = new ReferralRequest(
                referralCode,
                request.getAmbulanceUnitId(),
                request.getAmbulanceUnitNumber(),
                request.getDestinationHospitalId(),
                destHospital.getName(),
                request.getPatientDeIdentifiedReference(),
                request.getClinicalOperationalSummary(),
                request.getUrgencyLevel(),
                request.getRequiredServices()
        );

        referral.setEstimatedArrivalMinutes(request.getEstimatedArrivalMinutes());
        referral.setOriginHospitalId(request.getOriginHospitalId());
        referral.setStatus(ReferralStatus.SENT);
        referral.setSentAt(LocalDateTime.now());
        referral.setDeliveredAt(LocalDateTime.now());

        ReferralRequest saved = referralRepository.save(referral);

        auditService.log(
                createdBy != null ? createdBy : "AMBULANCE_CREW",
                "AMBULANCE_CREW",
                "REFERRAL_CREATE",
                "ReferralRequest",
                saved.getId().toString(),
                null,
                "STATUS=" + saved.getStatus(),
                "Created emergency referral request " + saved.getReferralCode() + " for hospital " + destHospital.getName(),
                destHospital.getId()
        );

        // Alert receiving hospital
        alertService.createAlert(
                destHospital.getId(),
                null,
                "New Referral Request: " + saved.getReferralCode(),
                "Referral for " + saved.getPatientDeIdentifiedReference() + " requiring " + saved.getRequiredServices(),
                AlertSeverity.HIGH,
                AlertType.AMBULANCE_INCOMING,
                "ReferralRequest",
                saved.getId().toString()
        );

        return saved;
    }

    public ReferralRequest acknowledgeReferral(Long referralId, String acknowledgedBy) {
        ReferralRequest referral = getReferralById(referralId);

        // T4.6: State transition from SENT/DELIVERED to ACKNOWLEDGED
        referral.setStatus(ReferralStatus.ACKNOWLEDGED);
        referral.setAcknowledgedAt(LocalDateTime.now());
        referral.setAcknowledgedBy(acknowledgedBy);

        ReferralRequest saved = referralRepository.save(referral);

        auditService.log(
                acknowledgedBy,
                "AMBULANCE_COORDINATOR",
                "REFERRAL_ACKNOWLEDGE",
                "ReferralRequest",
                saved.getId().toString(),
                "STATUS=SENT/DELIVERED",
                "STATUS=ACKNOWLEDGED",
                "Referral acknowledged by receiving facility coordinator (not accepted yet)",
                saved.getDestinationHospitalId()
        );

        return saved;
    }

    public ReferralRequest reviewReferral(Long referralId, String reviewer) {
        ReferralRequest referral = getReferralById(referralId);
        referral.setStatus(ReferralStatus.UNDER_REVIEW);
        return referralRepository.save(referral);
    }

    public ReferralRequest decideReferral(Long referralId, ReferralDecisionRequest request) {
        ReferralRequest referral = getReferralById(referralId);

        // T4.5: A reason is required for decline or redirect
        if (request.getDecision() == ReferralStatus.DECLINED && (request.getReason() == null || request.getReason().isBlank())) {
            throw new IllegalArgumentException("A valid reason is required when declining a referral request");
        }

        if (request.getRedirectedHospitalId() != null) {
            Hospital redirectHospital = hospitalRepository.findById(request.getRedirectedHospitalId())
                    .orElseThrow(() -> new IllegalArgumentException("Redirect hospital not found"));
            referral.setRedirectedHospitalId(redirectHospital.getId());
            referral.setRedirectedHospitalName(redirectHospital.getName());
            referral.setStatus(ReferralStatus.DECLINED); // marked declined at this hospital and redirected
            referral.setDecisionReason("Redirected to " + redirectHospital.getName() + ": " + request.getReason());
        } else {
            referral.setStatus(request.getDecision());
            referral.setDecisionReason(request.getReason());
        }

        referral.setDecisionAt(LocalDateTime.now());
        referral.setDecisionBy(request.getDecidedBy());

        ReferralRequest saved = referralRepository.save(referral);

        auditService.log(
                request.getDecidedBy(),
                "AMBULANCE_COORDINATOR",
                "REFERRAL_DECISION",
                "ReferralRequest",
                saved.getId().toString(),
                "decision=" + referral.getStatus(),
                "decision=" + request.getDecision() + " | reason=" + request.getReason(),
                "Referral decision published to sending ambulance/hospital",
                saved.getDestinationHospitalId()
        );

        return saved;
    }

    public ReferralRequest completeReferral(Long referralId, String completedBy) {
        ReferralRequest referral = getReferralById(referralId);
        referral.setStatus(ReferralStatus.COMPLETED);
        referral.setCompletedAt(LocalDateTime.now());
        ReferralRequest saved = referralRepository.save(referral);

        auditService.log(
                completedBy != null ? completedBy : "HOSPITAL_STAFF",
                "BED_MANAGER",
                "REFERRAL_COMPLETE",
                "ReferralRequest",
                saved.getId().toString(),
                null,
                "STATUS=COMPLETED",
                "Patient handoff completed at hospital",
                saved.getDestinationHospitalId()
        );

        return saved;
    }
}

