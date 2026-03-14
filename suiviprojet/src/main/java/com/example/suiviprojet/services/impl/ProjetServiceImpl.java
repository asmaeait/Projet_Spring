package com.example.suiviprojet.services.impl;

import com.example.suiviprojet.dto.projet.*;
import com.example.suiviprojet.entities.*;
import com.example.suiviprojet.exceptions.*;
import com.example.suiviprojet.repositories.*;
import com.example.suiviprojet.services.ProjetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjetServiceImpl implements ProjetService {

    private final ProjetRepository projetRepository;
    private final OrganismeRepository organismeRepository;
    private final EmployeRepository employeRepository;

    @Override
    public ProjetResponseDTO creerProjet(ProjetRequestDTO dto) {
        // Vérifier code unique
        if (projetRepository.existsByCode(dto.getCode()))
            throw new BusinessException("Code projet déjà utilisé : " + dto.getCode());

        // Vérifier dates
        if (dto.getDateDebut().isAfter(dto.getDateFin()))
            throw new BusinessException("La date de début doit être avant la date de fin");

        // Vérifier organisme
        Organisme organisme = organismeRepository.findById(dto.getOrganismeId())
                .orElseThrow(() -> new ResourceNotFoundException("Organisme non trouvé"));

        // Vérifier chef de projet
        Employe chefProjet = null;
        if (dto.getChefProjetId() != null) {
            chefProjet = employeRepository.findById(dto.getChefProjetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Chef de projet non trouvé"));
        }

        Projet projet = new Projet();
        projet.setCode(dto.getCode());
        projet.setNom(dto.getNom());
        projet.setDescription(dto.getDescription());
        projet.setDateDebut(dto.getDateDebut());
        projet.setDateFin(dto.getDateFin());
        projet.setMontant(dto.getMontant());
        projet.setOrganisme(organisme);
        projet.setChefProjet(chefProjet);

        return toDTO(projetRepository.save(projet));
    }

    @Override
    public ProjetResponseDTO modifierProjet(Long id, ProjetRequestDTO dto) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé"));

        if (dto.getDateDebut().isAfter(dto.getDateFin()))
            throw new BusinessException("La date de début doit être avant la date de fin");

        Organisme organisme = organismeRepository.findById(dto.getOrganismeId())
                .orElseThrow(() -> new ResourceNotFoundException("Organisme non trouvé"));

        Employe chefProjet = null;
        if (dto.getChefProjetId() != null) {
            chefProjet = employeRepository.findById(dto.getChefProjetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Chef de projet non trouvé"));
        }

        projet.setNom(dto.getNom());
        projet.setDescription(dto.getDescription());
        projet.setDateDebut(dto.getDateDebut());
        projet.setDateFin(dto.getDateFin());
        projet.setMontant(dto.getMontant());
        projet.setOrganisme(organisme);
        projet.setChefProjet(chefProjet);

        return toDTO(projetRepository.save(projet));
    }

    @Override
    public ProjetResponseDTO getProjetById(Long id) {
        return toDTO(projetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé")));
    }

    @Override
    public List<ProjetResponseDTO> getAllProjets() {
        return projetRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public void supprimerProjet(Long id) {
        if (!projetRepository.existsById(id))
            throw new ResourceNotFoundException("Projet non trouvé");
        projetRepository.deleteById(id);
    }

    @Override
    public List<ProjetResponseDTO> rechercherParNom(String nom) {
        return projetRepository.findByNomContaining(nom)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private ProjetResponseDTO toDTO(Projet p) {
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