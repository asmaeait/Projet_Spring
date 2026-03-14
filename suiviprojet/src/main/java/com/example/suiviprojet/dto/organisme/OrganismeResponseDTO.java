package com.example.suiviprojet.dto.organisme;

import lombok.Data;

@Data
public class OrganismeResponseDTO {
    private Long id;
    private String code;
    private String nom;
    private String adresse;
    private String telephone;
    private String nomContact;
    private String emailContact;
    private String siteWeb;
}
