package com.gestioneventos.cofira.dto.gimnasio;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackEjercicioDTO {

    private Long id;
    private LocalDate fechaFeedback;
    private Integer semanaNumero;
    private String ejerciciosDificiles;
    private Boolean puedeMasPeso;
    private String comentarios;
    private Integer nivelFatiga;
}
