package com.example.suiviprojet.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordDTO {
    @NotBlank
    private String ancienPassword;

    @NotBlank
    @Size(min = 6, message = "Minimum 6 caractères")
    private String nouveauPassword;
}