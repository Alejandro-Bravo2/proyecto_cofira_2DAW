package com.gestioneventos.cofira.dto.ollama;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlimentoGeneradoDTO {

    private String nombre;
    private String cantidad;
    private Integer gramos;
    private String icono;
}
