package com.example.suiviprojet.services;

import com.example.suiviprojet.dto.employe.EmployeRequestDTO;
import com.example.suiviprojet.dto.employe.EmployeResponseDTO;
import com.example.suiviprojet.entities.Employe;
import com.example.suiviprojet.entities.Profil;
import com.example.suiviprojet.repositories.EmployeRepository;
import com.example.suiviprojet.repositories.ProfilRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeService {

    private final EmployeRepository employeRepository;
    private final ProfilRepository profilRepository;

    public EmployeResponseDTO creer(EmployeRequestDTO dto) {
        if (employeRepository.existsByMatricule(dto.getMatricule())) {
            throw new RuntimeException("Matricule " + dto.getMatricule() + " déjà utilisé");
        }
        if (employeRepository.existsByLogin(dto.getLogin())) {
            throw new RuntimeException("Login " + dto.getLogin() + " déjà utilisé");
        }
        return toDTO(employeRepository.save(toEntity(dto)));
    }

    public EmployeResponseDTO modifier(Long id, EmployeRequestDTO dto) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employé non trouvé : " + id));
        employe.setMatricule(dto.getMatricule());
        employe.setNom(dto.getNom());
        employe.setPrenom(dto.getPrenom());
        employe.setTelephone(dto.getTelephone());
        employe.setEmail(dto.getEmail());
        employe.setLogin(dto.getLogin());
        employe.setPassword(dto.getPassword());
        if (dto.getProfilId() != null) {
            Profil profil = profilRepository.findById(dto.getProfilId())
                    .orElseThrow(() -> new EntityNotFoundException("Profil non trouvé : " + dto.getProfilId()));
            employe.setProfil(profil);
        }
        return toDTO(employeRepository.save(employe));
    }

    public List<EmployeResponseDTO> listerTous() {
        return employeRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public EmployeResponseDTO trouverParId(Long id) {
        return toDTO(employeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employé non trouvé : " + id)));
    }

    public void supprimer(Long id) {
        if (!employeRepository.existsById(id)) {
            throw new EntityNotFoundException("Employé non trouvé : " + id);
        }
        employeRepository.deleteById(id);
    }

    public List<EmployeResponseDTO> trouverDisponibles(String dateDebut, String dateFin) {
        java.time.LocalDate debut = java.time.LocalDate.parse(dateDebut);
        java.time.LocalDate fin = java.time.LocalDate.parse(dateFin);
        return employeRepository.findDisponibles(debut, fin)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private Employe toEntity(EmployeRequestDTO dto) {
        Employe e = new Employe();
        e.setMatricule(dto.getMatricule());
        e.setNom(dto.getNom());
        e.setPrenom(dto.getPrenom());
        e.setTelephone(dto.getTelephone());
        e.setEmail(dto.getEmail());
        e.setLogin(dto.getLogin());
        e.setPassword(dto.getPassword());
        if (dto.getProfilId() != null) {
            Profil profil = profilRepository.findById(dto.getProfilId())
                    .orElseThrow(() -> new EntityNotFoundException("Profil non trouvé : " + dto.getProfilId()));
            e.setProfil(profil);
        }
        return e;
    }

    private EmployeResponseDTO toDTO(Employe e) {
        EmployeResponseDTO dto = new EmployeResponseDTO();
        dto.setId(e.getId());
        dto.setMatricule(e.getMatricule());
        dto.setNom(e.getNom());
        dto.setPrenom(e.getPrenom());
        dto.setTelephone(e.getTelephone());
        dto.setEmail(e.getEmail());
        dto.setLogin(e.getLogin());
        if (e.getProfil() != null) {
            dto.setProfilLibelle(e.getProfil().getLibelle());
        }
        return dto;
    }
}