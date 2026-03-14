package com.example.suiviprojet.dto.employe;

import lombok.Data;

@Data
public class EmployeResponseDTO {
    private Long id;
    private String matricule;
    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String login;
    private String profilLibelle;
}
