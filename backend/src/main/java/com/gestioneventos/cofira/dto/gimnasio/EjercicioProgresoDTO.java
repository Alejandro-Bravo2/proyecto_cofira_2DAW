package com.gestioneventos.cofira.dto.gimnasio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EjercicioProgresoDTO {

    private String nombreEjercicio;
    private String grupoMuscular;
    private Integer seriesCompletadas;
    private Integer seriesObjetivo;
    private String repeticiones;
    private Boolean completado;
}
