package com.example.suiviprojet.controllers;

import com.example.suiviprojet.dto.profil.ProfilRequestDTO;
import com.example.suiviprojet.dto.profil.ProfilResponseDTO;
import com.example.suiviprojet.entities.Profil;
import com.example.suiviprojet.exceptions.BusinessException;
import com.example.suiviprojet.exceptions.ResourceNotFoundException;
import com.example.suiviprojet.repositories.ProfilRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profils")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfilController {

    private final ProfilRepository profilRepository;

    @PostMapping
    public ResponseEntity<ProfilResponseDTO> creer(
            @Valid @RequestBody ProfilRequestDTO dto) {
        if (profilRepository.existsByCode(dto.getCode()))
            throw new BusinessException("Code profil déjà utilisé : " + dto.getCode());
        Profil profil = new Profil();
        profil.setCode(dto.getCode());
        profil.setLibelle(dto.getLibelle());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toDTO(profilRepository.save(profil)));
    }

    @GetMapping
    public ResponseEntity<List<ProfilResponseDTO>> getAll() {
        return ResponseEntity.ok(profilRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfilResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(toDTO(profilRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profil non trouvé : " + id))));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        if (!profilRepository.existsById(id))
            throw new ResourceNotFoundException("Profil non trouvé : " + id);
        profilRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ProfilResponseDTO toDTO(Profil p) {
        ProfilResponseDTO dto = new ProfilResponseDTO();
        dto.setId(p.getId());
        dto.setCode(p.getCode());
        dto.setLibelle(p.getLibelle());
        return dto;
    }
}