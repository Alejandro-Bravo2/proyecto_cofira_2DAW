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
public class MenuDiaDTO {

    private String fecha;
    private Integer numeroDia;
    private List<ComidaGeneradaDTO> comidas;
    private ResumenNutricionalDTO resumenNutricional;
}
