package com.gestioneventos.cofira.dto.grasa;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroGrasaDTO {
    private Long id;
    private LocalDate fecha;
    private Double porcentajeGrasa;
}
