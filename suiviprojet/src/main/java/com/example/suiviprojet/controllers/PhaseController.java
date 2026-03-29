package com.example.suiviprojet.controllers;

import com.example.suiviprojet.dto.phase.*;
import com.example.suiviprojet.services.PhaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PhaseController {

    private final PhaseService phaseService;

    // POST /api/projets/{projetId}/phases
    @PostMapping("/projets/{projetId}/phases")
    public ResponseEntity<PhaseResponseDTO> creer(
            @PathVariable Long projetId,
            @Valid @RequestBody PhaseRequestDTO dto) {
        dto.setProjetId(projetId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(phaseService.creerPhase(dto));
    }

    // GET /api/projets/{projetId}/phases
    @GetMapping("/projets/{projetId}/phases")
    public ResponseEntity<List<PhaseResponseDTO>> getByProjet(@PathVariable Long projetId) {
        return ResponseEntity.ok(phaseService.getPhasesByProjet(projetId));
    }

    // GET /api/phases/{id}
    @GetMapping("/phases/{id}")
    public ResponseEntity<PhaseResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(phaseService.getPhaseById(id));
    }

    // PUT /api/phases/{id}
    @PutMapping("/phases/{id}")
    public ResponseEntity<PhaseResponseDTO> modifier(
            @PathVariable Long id,
            @Valid @RequestBody PhaseRequestDTO dto) {
        return ResponseEntity.ok(phaseService.modifierPhase(id, dto));
    }

    // DELETE /api/phases/{id}
    @DeleteMapping("/phases/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        phaseService.supprimerPhase(id);
        return ResponseEntity.noContent().build();
    }

    // PATCH /api/phases/{id}/realisation
    @PatchMapping("/phases/{id}/realisation")
    public ResponseEntity<PhaseResponseDTO> updateRealisation(
            @PathVariable Long id,
            @RequestParam boolean etat) {
        return ResponseEntity.ok(phaseService.updateEtatRealisation(id, etat));
    }

    // PATCH /api/phases/{id}/facturation
    @PatchMapping("/phases/{id}/facturation")
    public ResponseEntity<PhaseResponseDTO> updateFacturation(
            @PathVariable Long id,
            @RequestParam boolean etat) {
        return ResponseEntity.ok(phaseService.updateEtatFacturation(id, etat));
    }

    // PATCH /api/phases/{id}/paiement
    @PatchMapping("/phases/{id}/paiement")
    public ResponseEntity<PhaseResponseDTO> updatePaiement(
            @PathVariable Long id,
            @RequestParam boolean etat) {
        return ResponseEntity.ok(phaseService.updateEtatPaiement(id, etat));
    }
}
