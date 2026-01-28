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
public class AnalizarImagenRequestDTO {

    @NotBlank(message = "La imagen en base64 es obligatoria")
    private String imagenBase64;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @NotBlank(message = "El tipo de comida es obligatorio")
    private String tipoComida;
}
