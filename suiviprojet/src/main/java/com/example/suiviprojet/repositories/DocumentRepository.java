package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByProjetId(Long projetId);
    boolean existsByCodeAndProjetId(String code, Long projetId);
}