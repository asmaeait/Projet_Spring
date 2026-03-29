package com.example.suiviprojet.dto.facture;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class FactureRequestDTO {

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotNull(message = "La date de facturation est obligatoire")
    private LocalDate dateFacture;
}