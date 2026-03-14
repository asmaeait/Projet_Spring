package com.example.suiviprojet.services;

import com.example.suiviprojet.dto.organisme.OrganismeRequestDTO;
import com.example.suiviprojet.dto.organisme.OrganismeResponseDTO;
import com.example.suiviprojet.entities.Organisme;
import com.example.suiviprojet.repositories.OrganismeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganismeService {

    private final OrganismeRepository organismeRepository;

    public OrganismeResponseDTO creer(OrganismeRequestDTO dto) {
        if (organismeRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Code " + dto.getCode() + " déjà utilisé");
        }
        return toDTO(organismeRepository.save(toEntity(dto)));
    }

    public OrganismeResponseDTO modifier(Long id, OrganismeRequestDTO dto) {
        Organisme organisme = organismeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organisme non trouvé : " + id));
        organisme.setCode(dto.getCode());
        organisme.setNom(dto.getNom());
        organisme.setAdresse(dto.getAdresse());
        organisme.setTelephone(dto.getTelephone());
        organisme.setNomContact(dto.getNomContact());
        organisme.setEmailContact(dto.getEmailContact());
        organisme.setSiteWeb(dto.getSiteWeb());
        return toDTO(organismeRepository.save(organisme));
    }

    public List<OrganismeResponseDTO> listerTous() {
        return organismeRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OrganismeResponseDTO trouverParId(Long id) {
        return toDTO(organismeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organisme non trouvé : " + id)));
    }

    public void supprimer(Long id) {
        if (!organismeRepository.existsById(id)) {
            throw new EntityNotFoundException("Organisme non trouvé : " + id);
        }
        organismeRepository.deleteById(id);
    }

    private Organisme toEntity(OrganismeRequestDTO dto) {
        Organisme o = new Organisme();
        o.setCode(dto.getCode());
        o.setNom(dto.getNom());
        o.setAdresse(dto.getAdresse());
        o.setTelephone(dto.getTelephone());
        o.setNomContact(dto.getNomContact());
        o.setEmailContact(dto.getEmailContact());
        o.setSiteWeb(dto.getSiteWeb());
        return o;
    }

    private OrganismeResponseDTO toDTO(Organisme o) {
        OrganismeResponseDTO dto = new OrganismeResponseDTO();
        dto.setId(o.getId());
        dto.setCode(o.getCode());
        dto.setNom(o.getNom());
        dto.setAdresse(o.getAdresse());
        dto.setTelephone(o.getTelephone());
        dto.setNomContact(o.getNomContact());
        dto.setEmailContact(o.getEmailContact());
        dto.setSiteWeb(o.getSiteWeb());
        return dto;
    }
}