package com.gestioneventos.cofira.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestioneventos.cofira.entities.FeedbackEjercicio;

@Repository
public interface FeedbackEjercicioRepository extends JpaRepository<FeedbackEjercicio, Long> {

    Optional<FeedbackEjercicio> findTopByOrderBySemanaNumeroDesc();

    List<FeedbackEjercicio> findByFechaFeedbackBetween(LocalDate inicio, LocalDate fin);

    Optional<FeedbackEjercicio> findBySemanaNumero(Integer semanaNumero);
}
