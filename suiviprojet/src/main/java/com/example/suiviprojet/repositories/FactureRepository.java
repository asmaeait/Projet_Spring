package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {

    Optional<Facture> findByCode(String code);

    boolean existsByCode(String code);

    boolean existsByPhaseId(Long phaseId);

    Optional<Facture> findByPhaseId(Long phaseId);
}