package com.gestioneventos.cofira.dto.peso;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarPesoDTO {

    @NotNull(message = "La fecha no puede ser nula")
    private LocalDateTime fecha;

    @NotNull(message = "El valor de peso no puede ser nulo")
    @Min(value = 0, message = "El valor de peso no puede ser negativo")
    private Double kilos;
}
