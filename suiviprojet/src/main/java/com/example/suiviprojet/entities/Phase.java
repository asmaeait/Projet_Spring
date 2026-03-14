package com.example.suiviprojet.entities;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "phases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Phase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String libelle;

    private String description;

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    private Double montant;

    private boolean etatRealisation = false;
    private boolean etatFacturation  = false;
    private boolean etatPaiement     = false;

    @ManyToOne
    @JoinColumn(name = "projet_id", nullable = false)
    private Projet projet;

    @OneToMany(mappedBy = "phase", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Livrable> livrables;

    @OneToMany(mappedBy = "phase", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<LigneEmployePhase> affectations;

    @OneToOne(mappedBy = "phase")
    @JsonIgnore
    private Facture facture;
}
