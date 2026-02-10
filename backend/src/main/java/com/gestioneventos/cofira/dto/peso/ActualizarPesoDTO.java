package com.gestioneventos.cofira.dto.grasa;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarGrasaDTO {

    @NotNull(message = "La fecha no puede ser nula")
    private LocalDate fecha;

    @NotNull(message = "El porcentaje de grasa no puede ser nulo")
    @Min(value = 0, message = "El porcentaje de grasa no puede ser negativo")
    private Double porcentajeGrasa;
}
