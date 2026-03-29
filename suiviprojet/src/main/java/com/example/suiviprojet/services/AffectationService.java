package com.example.suiviprojet.services;

import com.example.suiviprojet.dto.affectation.AffectationRequestDTO;
import com.example.suiviprojet.dto.affectation.AffectationResponseDTO;
import java.util.List;

public interface AffectationService {

    AffectationResponseDTO affecter(Long phaseId, Long employeId, AffectationRequestDTO dto);

    AffectationResponseDTO modifier(Long phaseId, Long employeId, AffectationRequestDTO dto);

    AffectationResponseDTO getAffectation(Long phaseId, Long employeId);

    List<AffectationResponseDTO> getEmployesByPhase(Long phaseId);

    List<AffectationResponseDTO> getPhasesByEmploye(Long employeId);

    void supprimerAffectation(Long phaseId, Long employeId);
}