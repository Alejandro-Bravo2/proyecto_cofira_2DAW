package com.gestioneventos.cofira.dto.gimnasio;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuardarProgresoRequestDTO {

    private String diaSemana;
    private List<EjercicioProgresoDTO> ejercicios;
}
