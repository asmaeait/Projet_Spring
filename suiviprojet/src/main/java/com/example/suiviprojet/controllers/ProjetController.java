package com.example.suiviprojet.controllers;

import com.example.suiviprojet.dto.projet.*;
import com.example.suiviprojet.services.ProjetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projets")
@RequiredArgsConstructor
public class ProjetController {

    private final ProjetService projetService;

    @PostMapping
    public ResponseEntity<ProjetResponseDTO> creer(@Valid @RequestBody ProjetRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projetService.creerProjet(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjetResponseDTO> modifier(
            @PathVariable Long id,
            @Valid @RequestBody ProjetRequestDTO dto) {
        return ResponseEntity.ok(projetService.modifierProjet(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjetResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projetService.getProjetById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProjetResponseDTO>> getAll() {
        return ResponseEntity.ok(projetService.getAllProjets());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        projetService.supprimerProjet(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/recherche")
    public ResponseEntity<List<ProjetResponseDTO>> rechercher(@RequestParam String nom) {
        return ResponseEntity.ok(projetService.rechercherParNom(nom));
    }
}