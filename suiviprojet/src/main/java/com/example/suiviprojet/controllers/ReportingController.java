package com.example.suiviprojet.controllers;

import com.example.suiviprojet.dto.phase.PhaseResponseDTO;
import com.example.suiviprojet.dto.projet.ProjetResponseDTO;
import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.entities.Projet;
import com.example.suiviprojet.repositories.PhaseRepository;
import com.example.suiviprojet.repositories.ProjetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reporting")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReportingController {

    private final PhaseRepository phaseRepository;
    private final ProjetRepository projetRepository;

    // GET /api/reporting/phases/terminees-non-facturees
    @GetMapping("/phases/terminees-non-facturees")
    public ResponseEntity<List<PhaseResponseDTO>> termineeNonFacturees(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {

        List<Phase> phases;
        if (dateDebut != null && dateFin != null)
            phases = phaseRepository.findTermineesNonFactureesByPeriode(dateDebut, dateFin);
        else
            phases = phaseRepository.findTermineesNonFacturees();

        return ResponseEntity.ok(phases.stream().map(this::toPhaseDTO).collect(Collectors.toList()));
    }

    // GET /api/reporting/phases/facturees-non-payees
    @GetMapping("/phases/facturees-non-payees")
    public ResponseEntity<List<PhaseResponseDTO>> factureesNonPayees(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {

        List<Phase> phases;
        if (dateDebut != null && dateFin != null)
            phases = phaseRepository.findFactureesNonPayeesByPeriode(dateDebut, dateFin);
        else
            phases = phaseRepository.findFactureesNonPayees();

        return ResponseEntity.ok(phases.stream().map(this::toPhaseDTO).collect(Collectors.toList()));
    }

    // GET /api/reporting/phases/payees
    @GetMapping("/phases/payees")
    public ResponseEntity<List<PhaseResponseDTO>> payees(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {

        List<Phase> phases;
        if (dateDebut != null && dateFin != null)
            phases = phaseRepository.findPayeesByPeriode(dateDebut, dateFin);
        else
            phases = phaseRepository.findPayees();

        return ResponseEntity.ok(phases.stream().map(this::toPhaseDTO).collect(Collectors.toList()));
    }

    // GET /api/reporting/projets/en-cours
    @GetMapping("/projets/en-cours")
    public ResponseEntity<List<ProjetResponseDTO>> projetsEnCours() {
        return ResponseEntity.ok(projetRepository.findProjetsEnCours()
                .stream().map(this::toProjetDTO).collect(Collectors.toList()));
    }

    // GET /api/reporting/projets/clotures
    @GetMapping("/projets/clotures")
    public ResponseEntity<List<ProjetResponseDTO>> projetsClotures() {
        return ResponseEntity.ok(projetRepository.findProjetsClotures()
                .stream().map(this::toProjetDTO).collect(Collectors.toList()));
    }

    // GET /api/reporting/tableau-de-bord
    @GetMapping("/tableau-de-bord")
    public ResponseEntity<?> tableauDeBord() {
        java.util.Map<String, Object> dashboard = new java.util.HashMap<>();
        dashboard.put("totalProjets", projetRepository.count());
        dashboard.put("projetsEnCours", projetRepository.findProjetsEnCours().size());
        dashboard.put("projetsClotures", projetRepository.findProjetsClotures().size());
        dashboard.put("phasesTermineesNonFacturees", phaseRepository.findTermineesNonFacturees().size());
        dashboard.put("phasesFactureesNonPayees", phaseRepository.findFactureesNonPayees().size());
        dashboard.put("phasesPayees", phaseRepository.findPayees().size());
        return ResponseEntity.ok(dashboard);
    }

    // ---- Mappers ----
    private PhaseResponseDTO toPhaseDTO(Phase p) {
        PhaseResponseDTO dto = new PhaseResponseDTO();
        dto.setId(p.getId());
        dto.setCode(p.getCode());
        dto.setLibelle(p.getLibelle());
        dto.setDescription(p.getDescription());
        dto.setDateDebut(p.getDateDebut());
        dto.setDateFin(p.getDateFin());
        dto.setMontant(p.getMontant());
        dto.setEtatRealisation(p.isEtatRealisation());
        dto.setEtatFacturation(p.isEtatFacturation());
        dto.setEtatPaiement(p.isEtatPaiement());
        dto.setProjetId(p.getProjet().getId());
        dto.setNomProjet(p.getProjet().getNom());
        return dto;
    }

    private ProjetResponseDTO toProjetDTO(Projet p) {
        ProjetResponseDTO dto = new ProjetResponseDTO();
        dto.setId(p.getId());
        dto.setCode(p.getCode());
        dto.setNom(p.getNom());
        dto.setDescription(p.getDescription());
        dto.setDateDebut(p.getDateDebut());
        dto.setDateFin(p.getDateFin());
        dto.setMontant(p.getMontant());
        if (p.getOrganisme() != null)
            dto.setNomOrganisme(p.getOrganisme().getNom());
        if (p.getChefProjet() != null) {
            dto.setNomChefProjet(p.getChefProjet().getNom());
            dto.setPrenomChefProjet(p.getChefProjet().getPrenom());
        }
        return dto;
    }
}