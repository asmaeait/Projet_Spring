package com.example.suiviprojet.controllers;

import com.example.suiviprojet.dto.facture.FactureRequestDTO;
import com.example.suiviprojet.dto.facture.FactureResponseDTO;
import com.example.suiviprojet.services.FactureService;
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
public class FactureController {

    private final FactureService factureService;

    @PostMapping("/phases/{phaseId}/facture")
    public ResponseEntity<FactureResponseDTO> creer(
            @PathVariable Long phaseId,
            @Valid @RequestBody FactureRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(factureService.creer(phaseId, dto));
    }

    @GetMapping("/factures")
    public ResponseEntity<List<FactureResponseDTO>> getAll() {
        return ResponseEntity.ok(factureService.getAll());
    }

    @GetMapping("/factures/{id}")
    public ResponseEntity<FactureResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.getById(id));
    }

    @PutMapping("/factures/{id}")
    public ResponseEntity<FactureResponseDTO> modifier(
            @PathVariable Long id,
            @Valid @RequestBody FactureRequestDTO dto) {
        return ResponseEntity.ok(factureService.modifier(id, dto));
    }

    @DeleteMapping("/factures/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        factureService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}