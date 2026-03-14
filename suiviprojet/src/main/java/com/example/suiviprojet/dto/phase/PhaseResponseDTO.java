package com.example.suiviprojet.dto.phase;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhaseResponseDTO {

    private Long id;
    private String code;
    private String libelle;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double montant;
    private boolean etatRealisation;
    private boolean etatFacturation;
    private boolean etatPaiement;
    private Long projetId;
    private String nomProjet;
}