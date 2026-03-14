package com.example.suiviprojet.services.impl;

import com.example.suiviprojet.dto.affectation.AffectationRequestDTO;
import com.example.suiviprojet.dto.affectation.AffectationResponseDTO;
import com.example.suiviprojet.entities.*;
import com.example.suiviprojet.exceptions.*;
import com.example.suiviprojet.repositories.*;
import com.example.suiviprojet.services.AffectationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AffectationServiceImpl implements AffectationService {

    private final LigneEmployePhaseRepository affectationRepository;
    private final PhaseRepository phaseRepository;
    private final EmployeRepository employeRepository;

    @Override
    public AffectationResponseDTO affecter(Long phaseId, Long employeId,
                                           AffectationRequestDTO dto) {
        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée : " + phaseId));

        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé : " + employeId));

        if (affectationRepository.existsByIdPhaseIdAndIdEmployeId(phaseId, employeId))
            throw new BusinessException("Cet employé est déjà affecté à cette phase");

        if (dto.getDateDebut().isAfter(dto.getDateFin()))
            throw new BusinessException("La date de début doit être avant la date de fin");

        if (dto.getDateDebut().isBefore(phase.getDateDebut()) ||
                dto.getDateFin().isAfter(phase.getDateFin()))
            throw new BusinessException(
                    "Les dates d'affectation doivent être incluses dans les dates de la phase");

        if (affectationRepository.isEmployeOccupe(employeId, dto.getDateDebut(), dto.getDateFin()))
            throw new BusinessException(
                    "L'employé n'est pas disponible sur cette période");

        LigneEmployePhaseId id = new LigneEmployePhaseId(employeId, phaseId);
        LigneEmployePhase affectation = new LigneEmployePhase();
        affectation.setId(id);
        affectation.setEmploye(employe);
        affectation.setPhase(phase);
        affectation.setDateDebut(dto.getDateDebut());
        affectation.setDateFin(dto.getDateFin());

        return toDTO(affectationRepository.save(affectation));
    }

    @Override
    public AffectationResponseDTO modifier(Long phaseId, Long employeId,
                                           AffectationRequestDTO dto) {
        LigneEmployePhaseId id = new LigneEmployePhaseId(employeId, phaseId);
        LigneEmployePhase affectation = affectationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Affectation non trouvée"));

        Phase phase = affectation.getPhase();

        if (dto.getDateDebut().isAfter(dto.getDateFin()))
            throw new BusinessException("La date de début doit être avant la date de fin");

        if (dto.getDateDebut().isBefore(phase.getDateDebut()) ||
                dto.getDateFin().isAfter(phase.getDateFin()))
            throw new BusinessException(
                    "Les dates d'affectation doivent être incluses dans les dates de la phase");

        affectation.setDateDebut(dto.getDateDebut());
        affectation.setDateFin(dto.getDateFin());

        return toDTO(affectationRepository.save(affectation));
    }

    @Override
    public AffectationResponseDTO getAffectation(Long phaseId, Long employeId) {
        LigneEmployePhaseId id = new LigneEmployePhaseId(employeId, phaseId);
        return toDTO(affectationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Affectation non trouvée")));
    }

    @Override
    public List<AffectationResponseDTO> getEmployesByPhase(Long phaseId) {
        return affectationRepository.findByPhaseId(phaseId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<AffectationResponseDTO> getPhasesByEmploye(Long employeId) {
        return affectationRepository.findByEmployeId(employeId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public void supprimerAffectation(Long phaseId, Long employeId) {
        LigneEmployePhaseId id = new LigneEmployePhaseId(employeId, phaseId);
        if (!affectationRepository.existsById(id))
            throw new ResourceNotFoundException("Affectation non trouvée");
        affectationRepository.deleteById(id);
    }

    private AffectationResponseDTO toDTO(LigneEmployePhase a) {
        AffectationResponseDTO dto = new AffectationResponseDTO();
        dto.setEmployeId(a.getEmploye().getId());
        dto.setNomEmploye(a.getEmploye().getNom());
        dto.setPrenomEmploye(a.getEmploye().getPrenom());
        dto.setPhaseId(a.getPhase().getId());
        dto.setLibellePhase(a.getPhase().getLibelle());
        dto.setDateDebut(a.getDateDebut());
        dto.setDateFin(a.getDateFin());
        return dto;
    }
}