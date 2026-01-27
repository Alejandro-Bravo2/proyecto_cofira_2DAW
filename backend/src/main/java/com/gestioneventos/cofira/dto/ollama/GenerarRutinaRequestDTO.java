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
public class GenerarRutinaRequestDTO {

    private String objetivoPrincipal;
    private String nivelFitness;
    private Integer diasEntrenamientoPorSemana;
    private List<String> equipamientoDisponible;
    private String genero;
    private Integer edad;
    private Integer duracionSesionMinutos;

    private Double pesoKg;
    private Double alturaCm;
    private Double imc;

    private String ubicacionEntrenamiento;

    private List<String> lesiones;
    private List<String> condicionesMedicas;

    private Integer semanaActual;
    private Boolean feedbackPositivo;
    private String ejerciciosDificiles;
}
