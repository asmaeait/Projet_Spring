package com.example.suiviprojet.controllers;

import com.example.suiviprojet.dto.OrganismeRequestDTO;
import com.example.suiviprojet.dto.organisme.OrganismeResponseDTO;
import com.example.suiviprojet.services.OrganismeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/organismes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrganismeController {

    private final OrganismeService organismeService;

    @PostMapping
    public ResponseEntity<OrganismeResponseDTO> creer(@Valid @RequestBody OrganismeRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(organismeService.creer(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrganismeResponseDTO> modifier(@PathVariable Long id,
                                                         @Valid @RequestBody OrganismeRequestDTO dto) {
        return ResponseEntity.ok(organismeService.modifier(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<OrganismeResponseDTO>> listerTous() {
        return ResponseEntity.ok(organismeService.listerTous());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganismeResponseDTO> trouverParId(@PathVariable Long id) {
        return ResponseEntity.ok(organismeService.trouverParId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        organismeService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}