package com.example.HAS.repository;

import com.example.HAS.entity.PolicyThreshold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PolicyThresholdRepository extends JpaRepository<PolicyThreshold, Long> {
    Optional<PolicyThreshold> findByPolicyKey(String policyKey);
}

