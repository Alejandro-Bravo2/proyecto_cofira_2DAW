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
public class GenerarMenuRequestDTO {

    private String tipoDieta;
    private List<String> alergias;
    private Integer comidasPorDia;
    private Double caloriasDiarias;
    private Double proteinasGramos;
    private Double carbohidratosGramos;
    private Double grasasGramos;
    private String objetivoPrincipal;
    private String genero;
    private Integer edad;
}
