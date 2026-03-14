package com.example.suiviprojet.dto.organisme;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrganismeRequestDTO {
    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotBlank(message = "le nom est obligatoire")
    private String nom;

    private String adresse;
    private String telephone;
    private String nomContact;
    private String emailContact;
    private String siteWeb;
}
