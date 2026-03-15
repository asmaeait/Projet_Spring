package com.example.suiviprojet.services;

import com.example.suiviprojet.config.JwtUtil;
import com.example.suiviprojet.dto.auth.LoginRequestDTO;
import com.example.suiviprojet.dto.auth.LoginResponseDTO;
import com.example.suiviprojet.entities.Employe;
import com.example.suiviprojet.repositories.EmployeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final EmployeRepository employeRepository;
    private final JwtUtil jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO dto) {
        Employe employe = employeRepository.findByLogin(dto.getLogin())
                .orElseThrow(() -> new RuntimeException("Login ou mot de passe incorrect"));

        if (!employe.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("Login ou mot de passe incorrect");
        }

        String role = employe.getProfil() != null ?
                employe.getProfil().getCode() : "USER";

        String token = jwtUtil.generateToken(employe.getLogin(), role);
        return new LoginResponseDTO(token, employe.getLogin(), role);
    }
}
