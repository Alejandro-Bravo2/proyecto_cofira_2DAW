package com.gestioneventos.cofira.dto.ollama;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComidaGeneradaDTO {

    private String tipoComida;
    private String nombre;
    private Double caloriasEstimadas;
    private Double proteinasGramos;
    private Double carbohidratosGramos;
    private Double grasasGramos;
    private List<AlimentoGeneradoDTO> alimentos;
    private String preparacion;
}
