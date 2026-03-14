package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.LigneEmployePhase;
import com.example.suiviprojet.entities.LigneEmployePhaseId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LigneEmployePhaseRepository
        extends JpaRepository<LigneEmployePhase, LigneEmployePhaseId> {

    List<LigneEmployePhase> findByPhaseId(Long phaseId);
    List<LigneEmployePhase> findByEmployeId(Long employeId);
    boolean existsByIdPhaseIdAndIdEmployeId(Long phaseId, Long employeId);

    // Vérifier la disponibilité d'un employé sur une période
    @Query("""
        SELECT COUNT(lep) > 0 FROM LigneEmployePhase lep
        WHERE lep.employe.id = :employeId
        AND lep.dateDebut <= :dateFin
        AND lep.dateFin >= :dateDebut
    """)
    boolean isEmployeOccupe(@Param("employeId") Long employeId,
                            @Param("dateDebut") LocalDate dateDebut,
                            @Param("dateFin") LocalDate dateFin);
}