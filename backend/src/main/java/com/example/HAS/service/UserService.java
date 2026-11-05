package com.example.HAS.service;

import com.example.HAS.dto.AuthResponse;
import com.example.HAS.dto.LoginRequest;
import com.example.HAS.dto.UserCreateRequest;
import com.example.HAS.entity.Role;
import com.example.HAS.entity.User;
import com.example.HAS.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuditService auditService;

    public UserService(UserRepository userRepository, AuditService auditService) {
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    public AuthResponse authenticate(LoginRequest request) {
        // T1.2: Invalid credentials do not reveal whether a username exists
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        // T1.3: Disabled users cannot sign in
        if (!user.isActive()) {
            throw new IllegalStateException("Account is disabled. Contact system administrator.");
        }

        String sessionToken = "carelink_sess_" + UUID.randomUUID().toString().replace("-", "");

        auditService.log(
                user.getUsername(),
                user.getRole().name(),
                "USER_SIGN_IN",
                "User",
                user.getId().toString(),
                null,
                null,
                "User signed in successfully",
                user.getHospitalId()
        );

        return new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getRole(),
                user.getHospitalId(),
                user.getAmbulanceUnitId(),
                sessionToken
        );
    }

    public User createUser(UserCreateRequest request, String createdByAdmin) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken");
        }

        User user = new User(
                request.getUsername(),
                request.getPassword(),
                request.getFullName(),
                request.getEmail(),
                request.getRole(),
                request.getHospitalId(),
                request.getAmbulanceUnitId()
        );

        User saved = userRepository.save(user);

        auditService.log(
                createdByAdmin != null ? createdByAdmin : "SYSTEM",
                "ADMINISTRATOR",
                "USER_CREATE",
                "User",
                saved.getId().toString(),
                null,
                saved.getUsername() + " (" + saved.getRole() + ")",
                "Created user account",
                saved.getHospitalId()
        );

        return saved;
    }

    public User disableUser(Long userId, String disabledByAdmin) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        User updated = userRepository.save(user);

        auditService.log(
                disabledByAdmin != null ? disabledByAdmin : "ADMIN",
                "ADMINISTRATOR",
                "USER_DISABLE",
                "User",
                user.getId().toString(),
                "active=true",
                "active=false",
                "Account disabled by admin",
                user.getHospitalId()
        );

        return updated;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
}

