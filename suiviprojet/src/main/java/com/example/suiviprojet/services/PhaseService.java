package com.example.suiviprojet.services;

import com.example.suiviprojet.dto.phase.*;
import java.util.List;

public interface PhaseService {
    PhaseResponseDTO creerPhase(PhaseRequestDTO dto);
    PhaseResponseDTO modifierPhase(Long id, PhaseRequestDTO dto);
    PhaseResponseDTO getPhaseById(Long id);
    List<PhaseResponseDTO> getPhasesByProjet(Long projetId);
    void supprimerPhase(Long id);
    PhaseResponseDTO updateEtatRealisation(Long id, boolean etat);
    PhaseResponseDTO updateEtatFacturation(Long id, boolean etat);
    PhaseResponseDTO updateEtatPaiement(Long id, boolean etat);
}