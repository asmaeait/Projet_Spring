package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Phase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PhaseRepository extends JpaRepository<Phase, Long> {

    List<Phase> findByProjetId(Long projetId);
    boolean existsByCodeAndProjetId(String code, Long projetId);

    @Query("""
        SELECT ph FROM Phase ph
        WHERE ph.etatRealisation = true
        AND ph.etatFacturation = false
    """)
    List<Phase> findTermineesNonFacturees();

    @Query("""
        SELECT ph FROM Phase ph
        WHERE ph.etatFacturation = true
        AND ph.etatPaiement = false
    """)
    List<Phase> findFactureesNonPayees();

    @Query("""
        SELECT ph FROM Phase ph
        WHERE ph.etatPaiement = true
    """)
    List<Phase> findPayees();

    @Query("""
        SELECT ph FROM Phase ph
        WHERE ph.etatRealisation = true
        AND ph.etatFacturation = false
        AND ph.dateFin BETWEEN :dateDebut AND :dateFin
    """)
    List<Phase> findTermineesNonFactureesByPeriode(@Param("dateDebut") LocalDate dateDebut,
                                                   @Param("dateFin") LocalDate dateFin);

    @Query("""
        SELECT ph FROM Phase ph
        WHERE ph.etatFacturation = true
        AND ph.etatPaiement = false
        AND ph.dateFin BETWEEN :dateDebut AND :dateFin
    """)
    List<Phase> findFactureesNonPayeesByPeriode(@Param("dateDebut") LocalDate dateDebut,
                                                @Param("dateFin") LocalDate dateFin);

    @Query("""
        SELECT ph FROM Phase ph
        WHERE ph.etatPaiement = true
        AND ph.dateFin BETWEEN :dateDebut AND :dateFin
    """)
    List<Phase> findPayeesByPeriode(@Param("dateDebut") LocalDate dateDebut,
                                    @Param("dateFin") LocalDate dateFin);

    @Query("""
        SELECT COALESCE(SUM(ph.montant), 0)
        FROM Phase ph
        WHERE ph.projet.id = :projetId
    """)
    Double sumMontantByProjetId(@Param("projetId") Long projetId);
}