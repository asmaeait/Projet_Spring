package com.example.suiviprojet.services;

import com.example.suiviprojet.dto.livrable.LivrableRequestDTO;
import com.example.suiviprojet.dto.livrable.LivrableResponseDTO;
import java.util.List;

public interface LivrableService {
    LivrableResponseDTO creer(Long phaseId, LivrableRequestDTO dto);
    LivrableResponseDTO modifier(Long id, LivrableRequestDTO dto);
    LivrableResponseDTO getById(Long id);
    List<LivrableResponseDTO> getByPhase(Long phaseId);
    void supprimer(Long id);
}