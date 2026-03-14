package com.example.suiviprojet.services.impl;

import com.example.suiviprojet.dto.document.DocumentRequestDTO;
import com.example.suiviprojet.dto.document.DocumentResponseDTO;
import com.example.suiviprojet.entities.Document;
import com.example.suiviprojet.entities.Projet;
import com.example.suiviprojet.exceptions.BusinessException;
import com.example.suiviprojet.exceptions.ResourceNotFoundException;
import com.example.suiviprojet.repositories.DocumentRepository;
import com.example.suiviprojet.repositories.ProjetRepository;
import com.example.suiviprojet.services.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final ProjetRepository projetRepository;

    @Override
    public DocumentResponseDTO creer(Long projetId, DocumentRequestDTO dto) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé : " + projetId));

        // Vérifier unicité du code dans le projet
        if (documentRepository.existsByCodeAndProjetId(dto.getCode(), projetId))
            throw new BusinessException(
                    "Un document avec ce code existe déjà dans ce projet");

        Document document = new Document();
        document.setCode(dto.getCode());
        document.setLibelle(dto.getLibelle());
        document.setDescription(dto.getDescription());
        document.setChemin(dto.getChemin());
        document.setProjet(projet);

        return toDTO(documentRepository.save(document));
    }

    @Override
    public DocumentResponseDTO modifier(Long id, DocumentRequestDTO dto) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé : " + id));

        document.setCode(dto.getCode());
        document.setLibelle(dto.getLibelle());
        document.setDescription(dto.getDescription());
        document.setChemin(dto.getChemin());

        return toDTO(documentRepository.save(document));
    }

    @Override
    public DocumentResponseDTO getById(Long id) {
        return toDTO(documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé : " + id)));
    }

    @Override
    public List<DocumentResponseDTO> getByProjet(Long projetId) {
        return documentRepository.findByProjetId(projetId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public void supprimer(Long id) {
        if (!documentRepository.existsById(id))
            throw new ResourceNotFoundException("Document non trouvé : " + id);
        documentRepository.deleteById(id);
    }

    private DocumentResponseDTO toDTO(Document d) {
        DocumentResponseDTO dto = new DocumentResponseDTO();
        dto.setId(d.getId());
        dto.setCode(d.getCode());
        dto.setLibelle(d.getLibelle());
        dto.setDescription(d.getDescription());
        dto.setChemin(d.getChemin());
        dto.setProjetId(d.getProjet().getId());
        dto.setNomProjet(d.getProjet().getNom());
        return dto;
    }
}