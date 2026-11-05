package com.example.HAS.controller;

import com.example.HAS.dto.ApiResponse;
import com.example.HAS.entity.ForecastRecord;
import com.example.HAS.service.ForecastService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forecasts")
@CrossOrigin(origins = "*")
public class ForecastController {

    private final ForecastService forecastService;

    public ForecastController(ForecastService forecastService) {
        this.forecastService = forecastService;
    }

    // T6.4: Expose forecast API
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<ApiResponse<List<ForecastRecord>>> getHospitalForecasts(@PathVariable Long hospitalId) {
        List<ForecastRecord> forecasts = forecastService.getForecastsForHospital(hospitalId);
        return ResponseEntity.ok(ApiResponse.ok("Forecasts retrieved (Advisory only)", forecasts));
    }

    @PostMapping("/hospital/{hospitalId}/refresh")
    public ResponseEntity<ApiResponse<List<ForecastRecord>>> refreshForecasts(@PathVariable Long hospitalId) {
        List<ForecastRecord> forecasts = forecastService.generateBaselineForecasts(hospitalId);
        return ResponseEntity.ok(ApiResponse.ok("Generated updated baseline forecasts", forecasts));
    }
}

