package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {

    Optional<Projet> findByCode(String code);

    boolean existsByCode(String code);
    List<Projet> findByNomContainingIgnoreCase(String nom);
    List<Projet> findByOrganismeId(Long organismeId);
    List<Projet> findByChefProjetId(Long chefProjetId);

    // Recherche par mot clé (nom OU code)
    @Query("""
        SELECT p FROM Projet p
        WHERE LOWER(p.nom) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(p.code) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    List<Projet> searchByKeyword(@Param("keyword") String keyword);

    // Projets en cours (au moins une phase non terminée)
    @Query("""
        SELECT DISTINCT p FROM Projet p
        JOIN p.phases ph
        WHERE ph.etatRealisation = false
    """)
    List<Projet> findProjetsEnCours();

    // Projets clôturés (toutes les phases terminées)
    @Query("""
        SELECT p FROM Projet p
        WHERE NOT EXISTS (
            SELECT ph FROM Phase ph
            WHERE ph.projet = p
            AND ph.etatRealisation = false
        )
    """)
    List<Projet> findProjetsClotures();
}