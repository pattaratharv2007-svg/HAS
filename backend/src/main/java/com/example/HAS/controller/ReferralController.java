package com.example.HAS.controller;

import com.example.HAS.dto.ApiResponse;
import com.example.HAS.dto.ReferralCreateRequest;
import com.example.HAS.dto.ReferralDecisionRequest;
import com.example.HAS.entity.ReferralRequest;
import com.example.HAS.service.ReferralService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referrals")
@CrossOrigin(origins = "*")
public class ReferralController {

    private final ReferralService referralService;

    public ReferralController(ReferralService referralService) {
        this.referralService = referralService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReferralRequest>>> getAllReferrals() {
        return ResponseEntity.ok(ApiResponse.ok(referralService.getAllReferrals()));
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<ApiResponse<List<ReferralRequest>>> getReferralsForHospital(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(ApiResponse.ok(referralService.getReferralsForHospital(hospitalId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReferralRequest>> getReferralById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(referralService.getReferralById(id)));
    }

    // T4.4: Create referral request
    @PostMapping
    public ResponseEntity<ApiResponse<ReferralRequest>> createReferral(
            @Valid @RequestBody ReferralCreateRequest request,
            @RequestParam(required = false, defaultValue = "ambulance_crew") String actor) {
        ReferralRequest saved = referralService.createReferral(request, actor);
        return ResponseEntity.ok(ApiResponse.ok("Referral request created and dispatched", saved));
    }

    // T4.6: Explicit acknowledgement
    @PutMapping("/{id}/acknowledge")
    public ResponseEntity<ApiResponse<ReferralRequest>> acknowledgeReferral(
            @PathVariable Long id,
            @RequestParam String acknowledgedBy) {
        ReferralRequest updated = referralService.acknowledgeReferral(id, acknowledgedBy);
        return ResponseEntity.ok(ApiResponse.ok("Referral request acknowledged (awaiting clinical decision)", updated));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<ApiResponse<ReferralRequest>> reviewReferral(
            @PathVariable Long id,
            @RequestParam String reviewer) {
        ReferralRequest updated = referralService.reviewReferral(id, reviewer);
        return ResponseEntity.ok(ApiResponse.ok("Referral marked under clinical review", updated));
    }

    // T4.5: Explicit accept or decline/redirect
    @PutMapping("/{id}/decide")
    public ResponseEntity<ApiResponse<ReferralRequest>> decideReferral(
            @PathVariable Long id,
            @Valid @RequestBody ReferralDecisionRequest request) {
        ReferralRequest updated = referralService.decideReferral(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Referral decision processed: " + updated.getStatus(), updated));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<ReferralRequest>> completeReferral(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "bed_manager") String completedBy) {
        ReferralRequest updated = referralService.completeReferral(id, completedBy);
        return ResponseEntity.ok(ApiResponse.ok("Referral marked complete upon patient arrival", updated));
    }
}

