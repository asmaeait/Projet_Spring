package com.example.suiviprojet.controllers;

import com.example.suiviprojet.dto.employe.EmployeRequestDTO;
import com.example.suiviprojet.dto.employe.EmployeResponseDTO;
import com.example.suiviprojet.services.EmployeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmployeController {

    private final EmployeService employeService;

    @PostMapping
    public ResponseEntity<EmployeResponseDTO> creer(@Valid @RequestBody EmployeRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeService.creer(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeResponseDTO> modifier(@PathVariable Long id,
                                                       @Valid @RequestBody EmployeRequestDTO dto) {
        return ResponseEntity.ok(employeService.modifier(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<EmployeResponseDTO>> listerTous() {
        return ResponseEntity.ok(employeService.listerTous());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeResponseDTO> trouverParId(@PathVariable Long id) {
        return ResponseEntity.ok(employeService.trouverParId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        employeService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<EmployeResponseDTO>> disponibles(
            @RequestParam String dateDebut,
            @RequestParam String dateFin) {
        return ResponseEntity.ok(employeService.trouverDisponibles(dateDebut, dateFin));
    }
}