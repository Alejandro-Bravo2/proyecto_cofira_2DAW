package com.gestioneventos.cofira.dto.consumo;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroComidaDTO {
    private Long id;
    private LocalDate fecha;
    private String tipoComida;
    private Integer comidaMenuId;
    private Boolean consumioMenu;
    private ComidaAlternativaDTO comidaAlternativa;
    private String imagenUrl;
    private Integer caloriasReales;
    private Integer proteinasReales;
    private Integer carbohidratosReales;
    private Integer grasasReales;
    private LocalDateTime creadoEn;
}
