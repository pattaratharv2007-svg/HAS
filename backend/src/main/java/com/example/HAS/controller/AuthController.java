package com.example.HAS.controller;

import com.example.HAS.dto.ApiResponse;
import com.example.HAS.dto.AuthResponse;
import com.example.HAS.dto.LoginRequest;
import com.example.HAS.dto.UserCreateRequest;
import com.example.HAS.entity.Role;
import com.example.HAS.entity.User;
import com.example.HAS.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.authenticate(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<User>> createUser(
            @Valid @RequestBody UserCreateRequest request,
            @RequestParam(required = false, defaultValue = "admin") String adminUser) {
        User user = userService.createUser(request, adminUser);
        return ResponseEntity.ok(ApiResponse.ok("User created successfully", user));
    }

    @PutMapping("/users/{id}/disable")
    public ResponseEntity<ApiResponse<User>> disableUser(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "admin") String adminUser) {
        User user = userService.disableUser(id, adminUser);
        return ResponseEntity.ok(ApiResponse.ok("User account disabled", user));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers(@RequestParam(required = false) Role role) {
        List<User> users = (role != null) ? userService.getUsersByRole(role) : userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getUserById(id)));
    }
}

