package com.example.suiviprojet.services;

import com.example.suiviprojet.dto.auth.*;
import com.example.suiviprojet.entities.Employe;
import com.example.suiviprojet.repositories.EmployeRepository;
import com.example.suiviprojet.security.EmployeUserDetails;
import com.example.suiviprojet.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final EmployeRepository employeRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDTO login(LoginRequestDTO request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getLogin(), request.getPassword()
                )
        );
        EmployeUserDetails userDetails =
                (EmployeUserDetails) auth.getPrincipal();
        Employe employe = userDetails.getEmploye();

        String role = employe.getProfil().getCode();
        String token = jwtUtils.generateToken(employe.getLogin(), role);

        return new LoginResponseDTO(
                token,
                employe.getLogin(),
                role,
                employe.getNom(),
                employe.getPrenom()
        );
    }

    public Employe getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // ← Correction ici
        String login = auth.getName();
        return employeRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public void changePassword(ChangePasswordDTO request) {
        Employe employe = getCurrentUser();
        if (!passwordEncoder.matches(
                request.getAncienPassword(), employe.getPassword())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }
        employe.setPassword(
                passwordEncoder.encode(request.getNouveauPassword())
        );
        employeRepository.save(employe);
    }
}