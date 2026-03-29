package com.example.suiviprojet.services.impl;

import com.example.suiviprojet.dto.facture.FactureRequestDTO;
import com.example.suiviprojet.dto.facture.FactureResponseDTO;
import com.example.suiviprojet.entities.Facture;
import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.exceptions.BusinessException;
import com.example.suiviprojet.exceptions.ResourceNotFoundException;
import com.example.suiviprojet.repositories.FactureRepository;
import com.example.suiviprojet.repositories.PhaseRepository;
import com.example.suiviprojet.services.FactureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FactureServiceImpl implements FactureService {

    private final FactureRepository factureRepository;
    private final PhaseRepository phaseRepository;

    @Override
    public FactureResponseDTO creer(Long phaseId, FactureRequestDTO dto) {
        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée : " + phaseId));

        if (!phase.isEtatRealisation())
            throw new BusinessException(
                    "Impossible de facturer : la phase n'est pas encore terminée");

        if (factureRepository.existsByPhaseId(phaseId))
            throw new BusinessException(
                    "Cette phase est déjà facturée");

        if (factureRepository.existsByCode(dto.getCode()))
            throw new BusinessException(
                    "Ce code de facture est déjà utilisé : " + dto.getCode());

        Facture facture = new Facture();
        facture.setCode(dto.getCode());
        facture.setDateFacture(dto.getDateFacture());
        facture.setPhase(phase);

        phase.setEtatFacturation(true);
        phaseRepository.save(phase);

        return toDTO(factureRepository.save(facture));
    }

    @Override
    public FactureResponseDTO modifier(Long id, FactureRequestDTO dto) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée : " + id));

        facture.setCode(dto.getCode());
        facture.setDateFacture(dto.getDateFacture());

        return toDTO(factureRepository.save(facture));
    }

    @Override
    public FactureResponseDTO getById(Long id) {
        return toDTO(factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée : " + id)));
    }

    @Override
    public List<FactureResponseDTO> getAll() {
        return factureRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public void supprimer(Long id) {
        if (!factureRepository.existsById(id))
            throw new ResourceNotFoundException("Facture non trouvée : " + id);
        factureRepository.deleteById(id);
    }

    private FactureResponseDTO toDTO(Facture f) {
        FactureResponseDTO dto = new FactureResponseDTO();
        dto.setId(f.getId());
        dto.setCode(f.getCode());
        dto.setDateFacture(f.getDateFacture());
        dto.setPhaseId(f.getPhase().getId());
        dto.setLibellePhase(f.getPhase().getLibelle());
        dto.setMontantPhase(f.getPhase().getMontant());
        dto.setNomProjet(f.getPhase().getProjet().getNom());
        return dto;
    }
}