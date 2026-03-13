package com.example.suiviprojet.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {

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
    @JoinColumn(name = "projet_id", nullable = false)
    private Projet projet;
}
