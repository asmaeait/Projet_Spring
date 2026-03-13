package com.example.suiviprojet.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "ligne_employe_phase")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneEmployePhase {

    @EmbeddedId
    private LigneEmployePhaseId id;

    @ManyToOne
    @MapsId("employeId")
    @JoinColumn(name = "employe_id")
    private Employe employe;

    @ManyToOne
    @MapsId("phaseId")
    @JoinColumn(name = "phase_id")
    private Phase phase;

    private LocalDate dateDebut;
    private LocalDate dateFin;
}