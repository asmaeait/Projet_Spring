package com.example.suiviprojet.services;

import com.example.suiviprojet.dto.document.DocumentRequestDTO;
import com.example.suiviprojet.dto.document.DocumentResponseDTO;
import java.util.List;

public interface DocumentService {
    DocumentResponseDTO creer(Long projetId, DocumentRequestDTO dto);
    DocumentResponseDTO modifier(Long id, DocumentRequestDTO dto);
    DocumentResponseDTO getById(Long id);
    List<DocumentResponseDTO> getByProjet(Long projetId);
    void supprimer(Long id);
}