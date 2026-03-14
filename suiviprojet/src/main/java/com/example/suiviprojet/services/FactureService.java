package com.example.suiviprojet.services;

import com.example.suiviprojet.dto.facture.FactureRequestDTO;
import com.example.suiviprojet.dto.facture.FactureResponseDTO;
import java.util.List;

public interface FactureService {
    FactureResponseDTO creer(Long phaseId, FactureRequestDTO dto);
    FactureResponseDTO modifier(Long id, FactureRequestDTO dto);
    FactureResponseDTO getById(Long id);
    List<FactureResponseDTO> getAll();
    void supprimer(Long id);
}