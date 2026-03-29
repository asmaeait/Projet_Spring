package com.example.suiviprojet.dto.profil;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfilRequestDTO {

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotBlank(message = "Le libellé est obligatoire")
    private String libelle;
}