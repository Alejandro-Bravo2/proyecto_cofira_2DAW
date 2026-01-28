package com.gestioneventos.cofira.dto.consumo;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumenNutricionalRealDTO {
    private Integer caloriasConsumidas;
    private Integer proteinasConsumidas;
    private Integer carbohidratosConsumidos;
    private Integer grasasConsumidas;
    private Integer comidasRegistradas;
    private Integer totalComidas;
}
