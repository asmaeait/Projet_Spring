package com.example.suiviprojet.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "livrables")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Livrable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String libelle;

    private String description;
    private String chemin;

    @ManyToOne
    @JoinColumn(name = "phase_id", nullable = false)
    private Phase phase;
}
