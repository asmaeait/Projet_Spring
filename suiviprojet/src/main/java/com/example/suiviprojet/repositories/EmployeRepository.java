package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long> {

    Optional<Employe> findByMatricule(String matricule);
    Optional<Employe> findByLogin(String login);

    boolean existsByMatricule(String matricule);
    boolean existsByLogin(String login);
    boolean existsByEmail(String email);

    List<Employe> findByNomContainingIgnoreCase(String nom);

    List<Employe> findByProfilId(Long profilId);

    @Query("""
        SELECT e FROM Employe e
        WHERE e.id NOT IN (
            SELECT lep.employe.id FROM LigneEmployePhase lep
            WHERE lep.dateDebut <= :dateFin
            AND lep.dateFin >= :dateDebut)""")
    List<Employe> findDisponibles(@Param("dateDebut") LocalDate dateDebut,
                                  @Param("dateFin") LocalDate dateFin);
}