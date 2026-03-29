package com.example.suiviprojet.services.impl;

import com.example.suiviprojet.dto.phase.*;
import com.example.suiviprojet.entities.*;
import com.example.suiviprojet.exceptions.*;
import com.example.suiviprojet.repositories.*;
import com.example.suiviprojet.services.PhaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhaseServiceImpl implements PhaseService {

    private final PhaseRepository phaseRepository;
    private final ProjetRepository projetRepository;

    @Override
    public PhaseResponseDTO creerPhase(PhaseRequestDTO dto) {
        // Récupérer le projet
        Projet projet = projetRepository.findById(dto.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé"));

        // Vérifier que les dates de la phase sont dans celles du projet
        if (dto.getDateDebut().isBefore(projet.getDateDebut()) ||
                dto.getDateFin().isAfter(projet.getDateFin()))
            throw new BusinessException(
                    "Les dates de la phase doivent être incluses dans les dates du projet");

        // Vérifier dateDebut <= dateFin
        if (dto.getDateDebut().isAfter(dto.getDateFin()))
            throw new BusinessException("La date de début doit être avant la date de fin");

        // Vérifier que la somme des montants ne dépasse pas le montant du projet
        if (projet.getMontant() != null) {
            double totalPhases = phaseRepository.findByProjetId(projet.getId())
                    .stream().mapToDouble(p -> p.getMontant() != null ? p.getMontant() : 0).sum();
            if (totalPhases + dto.getMontant() > projet.getMontant())
                throw new BusinessException(
                        "La somme des montants des phases dépasse le montant total du projet");
        }

        Phase phase = new Phase();
        phase.setCode(dto.getCode());
        phase.setLibelle(dto.getLibelle());
        phase.setDescription(dto.getDescription());
        phase.setDateDebut(dto.getDateDebut());
        phase.setDateFin(dto.getDateFin());
        phase.setMontant(dto.getMontant());
        phase.setProjet(projet);

        return toDTO(phaseRepository.save(phase));
    }

    @Override
    public PhaseResponseDTO modifierPhase(Long id, PhaseRequestDTO dto) {
        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée"));

        Projet projet = projetRepository.findById(dto.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé"));

        if (dto.getDateDebut().isBefore(projet.getDateDebut()) ||
                dto.getDateFin().isAfter(projet.getDateFin()))
            throw new BusinessException(
                    "Les dates de la phase doivent être incluses dans les dates du projet");

        if (dto.getDateDebut().isAfter(dto.getDateFin()))
            throw new BusinessException("La date de début doit être avant la date de fin");

        phase.setCode(dto.getCode());
        phase.setLibelle(dto.getLibelle());
        phase.setDescription(dto.getDescription());
        phase.setDateDebut(dto.getDateDebut());
        phase.setDateFin(dto.getDateFin());
        phase.setMontant(dto.getMontant());

        return toDTO(phaseRepository.save(phase));
    }

    @Override
    public PhaseResponseDTO getPhaseById(Long id) {
        return toDTO(phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée")));
    }

    @Override
    public List<PhaseResponseDTO> getPhasesByProjet(Long projetId) {
        return phaseRepository.findByProjetId(projetId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public void supprimerPhase(Long id) {
        if (!phaseRepository.existsById(id))
            throw new ResourceNotFoundException("Phase non trouvée");
        phaseRepository.deleteById(id);
    }

    @Override
    public PhaseResponseDTO updateEtatRealisation(Long id, boolean etat) {
        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée"));
        phase.setEtatRealisation(etat);
        return toDTO(phaseRepository.save(phase));
    }

    @Override
    public PhaseResponseDTO updateEtatFacturation(Long id, boolean etat) {
        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée"));
        if (!phase.isEtatRealisation())
            throw new BusinessException("La phase doit être terminée avant la facturation");
        phase.setEtatFacturation(etat);
        return toDTO(phaseRepository.save(phase));
    }

    @Override
    public PhaseResponseDTO updateEtatPaiement(Long id, boolean etat) {
        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée"));
        if (!phase.isEtatFacturation())
            throw new BusinessException("La phase doit être facturée avant le paiement");
        phase.setEtatPaiement(etat);
        return toDTO(phaseRepository.save(phase));
    }

    private PhaseResponseDTO toDTO(Phase p) {
        PhaseResponseDTO dto = new PhaseResponseDTO();
        dto.setId(p.getId());
        dto.setCode(p.getCode());
        dto.setLibelle(p.getLibelle());
        dto.setDescription(p.getDescription());
        dto.setDateDebut(p.getDateDebut());
        dto.setDateFin(p.getDateFin());
        dto.setMontant(p.getMontant());
        dto.setEtatRealisation(p.isEtatRealisation());
        dto.setEtatFacturation(p.isEtatFacturation());
        dto.setEtatPaiement(p.isEtatPaiement());
        dto.setProjetId(p.getProjet().getId());
        dto.setNomProjet(p.getProjet().getNom());
        return dto;
    }
}