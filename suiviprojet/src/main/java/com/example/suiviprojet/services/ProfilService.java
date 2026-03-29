package com.example.suiviprojet.services;

import com.example.suiviprojet.entities.Profil;
import com.example.suiviprojet.repositories.ProfilRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfilService {

    private final ProfilRepository profilRepository;

    public List<Profil> listerTous() {
        return profilRepository.findAll();
    }

    public Profil creer(Profil profil) {
        return profilRepository.save(profil);
    }
}