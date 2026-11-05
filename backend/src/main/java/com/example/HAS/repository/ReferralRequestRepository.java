package com.example.HAS.repository;

import com.example.HAS.entity.ReferralRequest;
import com.example.HAS.entity.ReferralStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReferralRequestRepository extends JpaRepository<ReferralRequest, Long> {
    Optional<ReferralRequest> findByReferralCode(String referralCode);
    List<ReferralRequest> findByDestinationHospitalId(Long destinationHospitalId);
    List<ReferralRequest> findByDestinationHospitalIdAndStatus(Long destinationHospitalId, ReferralStatus status);
    List<ReferralRequest> findByAmbulanceUnitId(Long ambulanceUnitId);
    List<ReferralRequest> findAllByOrderByCreatedAtDesc();
}

