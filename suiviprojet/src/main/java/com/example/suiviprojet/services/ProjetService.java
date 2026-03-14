package com.example.suiviprojet.services;

import com.example.suiviprojet.dto.projet.*;
import java.util.List;

public interface ProjetService {
    ProjetResponseDTO creerProjet(ProjetRequestDTO dto);
    ProjetResponseDTO modifierProjet(Long id, ProjetRequestDTO dto);
    ProjetResponseDTO getProjetById(Long id);
    List<ProjetResponseDTO> getAllProjets();
    void supprimerProjet(Long id);
    List<ProjetResponseDTO> rechercherParNom(String nom);
}