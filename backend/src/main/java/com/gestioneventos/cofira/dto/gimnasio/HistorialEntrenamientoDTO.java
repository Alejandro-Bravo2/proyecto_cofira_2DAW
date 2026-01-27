package com.gestioneventos.cofira.dto.gimnasio;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistorialEntrenamientoDTO {

    private Long id;
    private LocalDate fechaEntrenamiento;
    private String diaSemana;
    private String nombreEjercicio;
    private String grupoMuscular;
    private Integer seriesCompletadas;
    private Integer seriesObjetivo;
    private String repeticiones;
    private Boolean completado;
    private Integer semanaNumero;
}
