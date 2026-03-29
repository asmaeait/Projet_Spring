package com.example.suiviprojet.entities;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "employes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String matricule;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    private String telephone;

    @Column(unique = true)
    private String email;

    @Column(unique = true, nullable = false)
    private String login;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "profil_id", nullable = false)
    private Profil profil;

    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<LigneEmployePhase> affectations;
}
