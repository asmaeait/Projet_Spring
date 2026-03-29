package com.example.suiviprojet.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String login;
    private String role;
    private String nom;
    private String prenom;
}