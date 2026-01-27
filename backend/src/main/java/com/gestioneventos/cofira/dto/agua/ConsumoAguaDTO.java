package com.gestioneventos.cofira.dto.agua;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsumoAguaDTO {
    private Long id;
    private LocalDate fecha;
    private Double litros;
}
