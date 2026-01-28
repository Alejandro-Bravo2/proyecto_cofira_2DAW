package com.gestioneventos.cofira.dto.ollama;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EjercicioGeneradoDTO {

    private String nombre;
    private Integer series;
    private String repeticiones;
    private Integer descansoSegundos;
    private String descripcion;
    private String grupoMuscular;
    private Double pesoSugeridoKg;
}
