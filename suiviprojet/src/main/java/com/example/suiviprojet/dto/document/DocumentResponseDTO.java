package com.example.suiviprojet.dto.document;

import lombok.Data;

@Data
public class DocumentResponseDTO {

    private Long id;
    private String code;
    private String libelle;
    private String description;
    private String chemin;
    private Long projetId;
    private String nomProjet;
}