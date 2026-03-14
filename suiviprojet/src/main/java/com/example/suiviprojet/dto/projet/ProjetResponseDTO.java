package com.example.suiviprojet.dto.projet;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjetResponseDTO {

    private Long id;
    private String code;
    private String nom;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double montant;
    private String nomOrganisme;
    private String nomChefProjet;
    private String prenomChefProjet;
}