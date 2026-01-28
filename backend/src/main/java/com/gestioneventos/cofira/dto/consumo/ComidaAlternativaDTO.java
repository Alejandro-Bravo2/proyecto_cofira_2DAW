package com.gestioneventos.cofira.dto.consumo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComidaAlternativaDTO {

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @NotBlank(message = "El tipo de comida es obligatorio")
    private String tipoComida;

    @NotBlank(message = "El nombre de la comida es obligatorio")
    private String nombre;

    private String descripcion;

    @PositiveOrZero(message = "Las calorías deben ser un valor positivo")
    private Integer calorias;

    @PositiveOrZero(message = "Las proteínas deben ser un valor positivo")
    private Integer proteinas;

    @PositiveOrZero(message = "Los carbohidratos deben ser un valor positivo")
    private Integer carbohidratos;

    @PositiveOrZero(message = "Las grasas deben ser un valor positivo")
    private Integer grasas;
}
