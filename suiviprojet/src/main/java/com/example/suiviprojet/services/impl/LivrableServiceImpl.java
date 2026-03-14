package com.example.suiviprojet.services.impl;

import com.example.suiviprojet.dto.livrable.LivrableRequestDTO;
import com.example.suiviprojet.dto.livrable.LivrableResponseDTO;
import com.example.suiviprojet.entities.Livrable;
import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.exceptions.BusinessException;
import com.example.suiviprojet.exceptions.ResourceNotFoundException;
import com.example.suiviprojet.repositories.LivrableRepository;
import com.example.suiviprojet.repositories.PhaseRepository;
import com.example.suiviprojet.services.LivrableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LivrableServiceImpl implements LivrableService {

    private final LivrableRepository livrableRepository;
    private final PhaseRepository phaseRepository;

    @Override
    public LivrableResponseDTO creer(Long phaseId, LivrableRequestDTO dto) {
        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée : " + phaseId));

        if (livrableRepository.existsByCodeAndPhaseId(dto.getCode(), phaseId))
            throw new BusinessException("Un livrable avec ce code existe déjà dans cette phase");

        Livrable livrable = new Livrable();
        livrable.setCode(dto.getCode());
        livrable.setLibelle(dto.getLibelle());
        livrable.setDescription(dto.getDescription());
        livrable.setChemin(dto.getChemin());
        livrable.setPhase(phase);

        return toDTO(livrableRepository.save(livrable));
    }

    @Override
    public LivrableResponseDTO modifier(Long id, LivrableRequestDTO dto) {
        Livrable livrable = livrableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livrable non trouvé : " + id));

        livrable.setCode(dto.getCode());
        livrable.setLibelle(dto.getLibelle());
        livrable.setDescription(dto.getDescription());
        livrable.setChemin(dto.getChemin());

        return toDTO(livrableRepository.save(livrable));
    }

    @Override
    public LivrableResponseDTO getById(Long id) {
        return toDTO(livrableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livrable non trouvé : " + id)));
    }

    @Override
    public List<LivrableResponseDTO> getByPhase(Long phaseId) {
        return livrableRepository.findByPhaseId(phaseId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public void supprimer(Long id) {
        if (!livrableRepository.existsById(id))
            throw new ResourceNotFoundException("Livrable non trouvé : " + id);
        livrableRepository.deleteById(id);
    }

    private LivrableResponseDTO toDTO(Livrable l) {
        LivrableResponseDTO dto = new LivrableResponseDTO();
        dto.setId(l.getId());
        dto.setCode(l.getCode());
        dto.setLibelle(l.getLibelle());
        dto.setDescription(l.getDescription());
        dto.setChemin(l.getChemin());
        dto.setPhaseId(l.getPhase().getId());
        dto.setLibellePhase(l.getPhase().getLibelle());
        return dto;
    }
}