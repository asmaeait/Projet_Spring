package com.example.suiviprojet.dto.employe;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmployeRequestDTO {

    @NotBlank(message = "Le matricule est obligatoire")
    private String matricule;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prenom est obligatoire")
    private String prenom;

    private String telephone;
    private String email;

    @NotBlank(message = "Le login est obligatoire")
    private  String Login;

    @NotBlank(message = "Le password est obligatoire")
    private String password;

    private Long profilId;

}
