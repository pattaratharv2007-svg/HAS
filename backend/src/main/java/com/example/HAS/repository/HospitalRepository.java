package com.example.HAS.repository;

import com.example.HAS.entity.Hospital;
import com.example.HAS.entity.HospitalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    Optional<Hospital> findByCode(String code);
    List<Hospital> findByParticipationStatus(String participationStatus);
    List<Hospital> findByOperationalStatus(HospitalStatus operationalStatus);
    List<Hospital> findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(String name, String address);
}

