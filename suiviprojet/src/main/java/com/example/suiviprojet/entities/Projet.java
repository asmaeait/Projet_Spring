package com.example.suiviprojet.entities;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "projets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Projet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String nom;

    private String description;

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    private Double montant;

    @ManyToOne
    @JoinColumn(name = "organisme_id", nullable = false)
    private Organisme organisme;

    @ManyToOne
    @JoinColumn(name = "chef_projet_id")
    private Employe chefProjet;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Phase> phases;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Document> documents;
}
