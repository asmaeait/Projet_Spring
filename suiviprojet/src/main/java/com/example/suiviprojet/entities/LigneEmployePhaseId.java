package com.example.suiviprojet.entities;

import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneEmployePhaseId implements Serializable {
    private Long employeId;
    private Long phaseId;
}