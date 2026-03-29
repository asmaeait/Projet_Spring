package com.example.suiviprojet.dto.facture;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FactureResponseDTO {
    private Long id;
    private String code;
    private LocalDate dateFacture;
    private Long phaseId;
    private String libellePhase;
    private Double montantPhase;
    private String nomProjet;
}