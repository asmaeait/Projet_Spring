package com.example.suiviprojet.controllers;

import com.example.suiviprojet.dto.document.DocumentRequestDTO;
import com.example.suiviprojet.dto.document.DocumentResponseDTO;
import com.example.suiviprojet.services.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/projets/{projetId}/documents")
    public ResponseEntity<DocumentResponseDTO> creer(
            @PathVariable Long projetId,
            @Valid @RequestBody DocumentRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(documentService.creer(projetId, dto));
    }

    @GetMapping("/projets/{projetId}/documents")
    public ResponseEntity<List<DocumentResponseDTO>> getByProjet(
            @PathVariable Long projetId) {
        return ResponseEntity.ok(documentService.getByProjet(projetId));
    }

    @GetMapping("/documents/{id}")
    public ResponseEntity<DocumentResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getById(id));
    }

    @PutMapping("/documents/{id}")
    public ResponseEntity<DocumentResponseDTO> modifier(
            @PathVariable Long id,
            @Valid @RequestBody DocumentRequestDTO dto) {
        return ResponseEntity.ok(documentService.modifier(id, dto));
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        documentService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}