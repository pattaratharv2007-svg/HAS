package com.example.HAS.repository;

import com.example.HAS.entity.AmbulanceStatus;
import com.example.HAS.entity.AmbulanceUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmbulanceUnitRepository extends JpaRepository<AmbulanceUnit, Long> {
    Optional<AmbulanceUnit> findByUnitNumber(String unitNumber);
    List<AmbulanceUnit> findByStatus(AmbulanceStatus status);
    List<AmbulanceUnit> findByDestinationHospitalId(Long destinationHospitalId);
}

