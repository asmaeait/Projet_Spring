package com.example.suiviprojet.controllers;

import com.example.suiviprojet.dto.affectation.AffectationRequestDTO;
import com.example.suiviprojet.dto.affectation.AffectationResponseDTO;
import com.example.suiviprojet.services.AffectationService;
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
public class AffectationController {

    private final AffectationService affectationService;

    @PostMapping("/phases/{phaseId}/employes/{employeId}")
    public ResponseEntity<AffectationResponseDTO> affecter(
            @PathVariable Long phaseId,
            @PathVariable Long employeId,
            @Valid @RequestBody AffectationRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(affectationService.affecter(phaseId, employeId, dto));
    }

    @PutMapping("/phases/{phaseId}/employes/{employeId}")
    public ResponseEntity<AffectationResponseDTO> modifier(
            @PathVariable Long phaseId,
            @PathVariable Long employeId,
            @Valid @RequestBody AffectationRequestDTO dto) {
        return ResponseEntity.ok(affectationService.modifier(phaseId, employeId, dto));
    }

    @GetMapping("/phases/{phaseId}/employes/{employeId}")
    public ResponseEntity<AffectationResponseDTO> getAffectation(
            @PathVariable Long phaseId,
            @PathVariable Long employeId) {
        return ResponseEntity.ok(affectationService.getAffectation(phaseId, employeId));
    }

    @GetMapping("/phases/{phaseId}/employes")
    public ResponseEntity<List<AffectationResponseDTO>> getEmployesByPhase(
            @PathVariable Long phaseId) {
        return ResponseEntity.ok(affectationService.getEmployesByPhase(phaseId));
    }

    @GetMapping("/employes/{employeId}/phases")
    public ResponseEntity<List<AffectationResponseDTO>> getPhasesByEmploye(
            @PathVariable Long employeId) {
        return ResponseEntity.ok(affectationService.getPhasesByEmploye(employeId));
    }

    @DeleteMapping("/phases/{phaseId}/employes/{employeId}")
    public ResponseEntity<Void> supprimer(
            @PathVariable Long phaseId,
            @PathVariable Long employeId) {
        affectationService.supprimerAffectation(phaseId, employeId);
        return ResponseEntity.noContent().build();
    }
}