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
@Table(name = "feedback_ejercicio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackEjercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_feedback", nullable = false)
    private LocalDate fechaFeedback;

    @Column(name = "semana_numero", nullable = false)
    private Integer semanaNumero;

    @Column(name = "ejercicios_dificiles", length = 1000)
    private String ejerciciosDificiles;

    @Column(name = "puede_mas_peso")
    private Boolean puedeMasPeso;

    @Column(name = "comentarios", length = 2000)
    private String comentarios;

    @Column(name = "nivel_fatiga")
    private Integer nivelFatiga;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (fechaFeedback == null) {
            fechaFeedback = LocalDate.now();
        }
    }
}
