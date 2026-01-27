package com.gestioneventos.cofira.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestioneventos.cofira.entities.HistorialEntrenamiento;

@Repository
public interface HistorialEntrenamientoRepository extends JpaRepository<HistorialEntrenamiento, Long> {

    List<HistorialEntrenamiento> findByFechaEntrenamientoBetween(LocalDate inicio, LocalDate fin);

    List<HistorialEntrenamiento> findByDiaSemanaAndSemanaNumero(String diaSemana, Integer semanaNumero);

    List<HistorialEntrenamiento> findBySemanaNumero(Integer semanaNumero);

    @Query("SELECT COUNT(h) FROM HistorialEntrenamiento h WHERE h.completado = true AND h.semanaNumero = :semana")
    Long countCompletadosBySemana(@Param("semana") Integer semana);

    @Query("SELECT DISTINCT h.nombreEjercicio FROM HistorialEntrenamiento h ORDER BY h.nombreEjercicio")
    List<String> findDistinctNombreEjercicio();

    @Query("SELECT h FROM HistorialEntrenamiento h WHERE h.nombreEjercicio = :nombreEjercicio AND h.pesoKg IS NOT NULL ORDER BY h.fechaEntrenamiento ASC")
    List<HistorialEntrenamiento> findByNombreEjercicioConPesoOrdenadoPorFecha(@Param("nombreEjercicio") String nombreEjercicio);

    @Query("SELECT h FROM HistorialEntrenamiento h WHERE h.pesoKg IS NOT NULL ORDER BY h.fechaEntrenamiento DESC")
    List<HistorialEntrenamiento> findAllConPesoOrdenadoPorFechaDesc();
}
