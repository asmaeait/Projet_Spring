package com.example.suiviprojet.controllers;

import com.example.suiviprojet.dto.livrable.LivrableRequestDTO;
import com.example.suiviprojet.dto.livrable.LivrableResponseDTO;
import com.example.suiviprojet.services.LivrableService;
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
public class LivrableController {

    private final LivrableService livrableService;

    @PostMapping("/phases/{phaseId}/livrables")
    public ResponseEntity<LivrableResponseDTO> creer(
            @PathVariable Long phaseId,
            @Valid @RequestBody LivrableRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(livrableService.creer(phaseId, dto));
    }

    @GetMapping("/phases/{phaseId}/livrables")
    public ResponseEntity<List<LivrableResponseDTO>> getByPhase(
            @PathVariable Long phaseId) {
        return ResponseEntity.ok(livrableService.getByPhase(phaseId));
    }

    @GetMapping("/livrables/{id}")
    public ResponseEntity<LivrableResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(livrableService.getById(id));
    }

    @PutMapping("/livrables/{id}")
    public ResponseEntity<LivrableResponseDTO> modifier(
            @PathVariable Long id,
            @Valid @RequestBody LivrableRequestDTO dto) {
        return ResponseEntity.ok(livrableService.modifier(id, dto));
    }

    @DeleteMapping("/livrables/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        livrableService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}