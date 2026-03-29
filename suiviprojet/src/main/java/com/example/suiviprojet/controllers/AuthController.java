package com.example.suiviprojet.controllers;

import com.example.suiviprojet.dto.auth.*;
import com.example.suiviprojet.entities.Employe;
import com.example.suiviprojet.services.AuthService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // GET /api/auth/me
    @GetMapping("/me")
    public ResponseEntity<Employe> me() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }

    // POST /api/auth/change-password
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordDTO request) {
        authService.changePassword(request);
        return ResponseEntity.ok("Mot de passe modifié avec succès");
    }
}