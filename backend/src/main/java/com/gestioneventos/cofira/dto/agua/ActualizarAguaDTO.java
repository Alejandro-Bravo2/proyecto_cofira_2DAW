package com.gestioneventos.cofira.dto.agua;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarAguaDTO {

    @NotNull(message = "La fecha no puede ser nula")
    private LocalDate fecha;

    @NotNull(message = "Los litros no pueden ser nulos")
    @Min(value = 0, message = "Los litros no pueden ser negativos")
    private Double litros;
}
