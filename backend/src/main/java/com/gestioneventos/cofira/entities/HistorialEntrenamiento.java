package com.gestioneventos.cofira.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "historial_entrenamiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialEntrenamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_entrenamiento", nullable = false)
    private LocalDate fechaEntrenamiento;

    @Column(name = "dia_semana", nullable = false)
    private String diaSemana;

    @Column(name = "nombre_ejercicio", nullable = false)
    private String nombreEjercicio;

    @Column(name = "grupo_muscular")
    private String grupoMuscular;

    @Column(name = "series_completadas")
    private Integer seriesCompletadas;

    @Column(name = "series_objetivo")
    private Integer seriesObjetivo;

    @Column(name = "repeticiones")
    private String repeticiones;

    @Column(name = "completado")
    private Boolean completado;

    @Column(name = "peso_kg")
    private Double pesoKg;

    @Column(name = "semana_numero")
    private Integer semanaNumero;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
