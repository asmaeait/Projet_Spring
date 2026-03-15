package com.example.suiviprojet.controllers;

import com.example.suiviprojet.dto.auth.LoginRequestDTO;
import com.example.suiviprojet.dto.auth.LoginResponseDTO;
import com.example.suiviprojet.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authservice;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto){
        return ResponseEntity.ok(authservice.login(dto));
    }
}
