package com.gestioneventos.cofira.dto.ollama;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumenNutricionalDTO {

    private Double caloriasTotal;
    private Double proteinasTotal;
    private Double carbohidratosTotal;
    private Double grasasTotal;
}
