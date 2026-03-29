package com.example.suiviprojet.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {
    @NotBlank(message = "Login obligatoire")
    private String login;

    @NotBlank(message = "Mot de passe obligatoire")
    private String password;
}