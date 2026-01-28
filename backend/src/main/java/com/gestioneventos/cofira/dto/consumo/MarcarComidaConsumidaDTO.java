package com.gestioneventos.cofira.dto.consumo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarcarComidaConsumidaDTO {

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @NotBlank(message = "El tipo de comida es obligatorio")
    private String tipoComida;

    private Integer comidaMenuId;

    @NotNull(message = "Debe indicar si consumió del menú")
    private Boolean consumioMenu;

    private Integer caloriasReales;
    private Integer proteinasReales;
    private Integer carbohidratosReales;
    private Integer grasasReales;
}
