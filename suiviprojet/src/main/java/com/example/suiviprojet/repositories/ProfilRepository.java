package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProfilRepository extends JpaRepository<Profil, Long> {

    Optional<Profil> findByCode(String code);
    boolean existsByCode(String code);
}