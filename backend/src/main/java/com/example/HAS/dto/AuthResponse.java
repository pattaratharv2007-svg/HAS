package com.example.HAS.dto;

import com.example.HAS.entity.Role;

public class AuthResponse {

    private Long userId;
    private String username;
    private String fullName;
    private Role role;
    private Long hospitalId;
    private Long ambulanceUnitId;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(Long userId, String username, String fullName, Role role, Long hospitalId, Long ambulanceUnitId, String token) {
        this.userId = userId;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.hospitalId = hospitalId;
        this.ambulanceUnitId = ambulanceUnitId;
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public Long getAmbulanceUnitId() {
        return ambulanceUnitId;
    }

    public void setAmbulanceUnitId(Long ambulanceUnitId) {
        this.ambulanceUnitId = ambulanceUnitId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

