package com.example.suiviprojet.dto.affectation;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AffectationResponseDTO {

    private Long employeId;
    private String nomEmploye;
    private String prenomEmploye;
    private Long phaseId;
    private String libellePhase;
    private LocalDate dateDebut;
    private LocalDate dateFin;
}