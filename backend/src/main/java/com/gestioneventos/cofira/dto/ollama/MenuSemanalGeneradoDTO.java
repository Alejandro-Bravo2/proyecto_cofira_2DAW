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
public class MenuSemanalGeneradoDTO {

    private List<MenuDiaDTO> menusPorDia;
    private String fechaInicio;
    private String fechaFin;
}
