package com.example.suiviprojet.dto.document;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DocumentRequestDTO {

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotBlank(message = "Le libellé est obligatoire")
    private String libelle;

    private String description;
    private String chemin;
}