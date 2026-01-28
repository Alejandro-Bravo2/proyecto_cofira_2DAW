package com.gestioneventos.cofira.dto.consumo;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalisisImagenDTO {
    private String nombreComida;
    private Integer caloriasEstimadas;
    private Integer proteinasGramos;
    private Integer carbohidratosGramos;
    private Integer grasasGramos;
    private List<String> ingredientesDetectados;
    private String confianza;
}
