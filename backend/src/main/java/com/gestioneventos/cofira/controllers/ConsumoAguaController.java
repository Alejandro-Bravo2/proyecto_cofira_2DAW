package com.gestioneventos.cofira.controllers;

import com.gestioneventos.cofira.dto.agua.ActualizarAguaDTO;
import com.gestioneventos.cofira.dto.agua.ConsumoAguaDTO;
import com.gestioneventos.cofira.services.ConsumoAguaService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/consumo-agua")
public class ConsumoAguaController {

    private final ConsumoAguaService consumoAguaService;

    public ConsumoAguaController(ConsumoAguaService consumoAguaService) {
        this.consumoAguaService = consumoAguaService;
    }

    @GetMapping("/hoy")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ConsumoAguaDTO> obtenerConsumoHoy(Principal principal) {
        LocalDate hoy = LocalDate.now();
        ConsumoAguaDTO consumo = consumoAguaService.obtenerConsumoDelDia(principal.getName(), hoy);
        return ResponseEntity.ok(consumo);
    }

    @GetMapping("/{fecha}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ConsumoAguaDTO> obtenerConsumoPorFecha(
            Principal principal,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        ConsumoAguaDTO consumo = consumoAguaService.obtenerConsumoDelDia(principal.getName(), fecha);
        return ResponseEntity.ok(consumo);
    }

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ConsumoAguaDTO> actualizarConsumo(
            Principal principal,
            @RequestBody @Valid ActualizarAguaDTO dto) {
        ConsumoAguaDTO consumo = consumoAguaService.actualizarConsumo(principal.getName(), dto);
        return ResponseEntity.ok(consumo);
    }

    @GetMapping("/historial")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ConsumoAguaDTO>> obtenerHistorial(
            Principal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<ConsumoAguaDTO> historial = consumoAguaService.obtenerHistorial(
            principal.getName(), fechaInicio, fechaFin);
        return ResponseEntity.ok(historial);
    }
}
