package com.gestioneventos.cofira.controllers;


import com.gestioneventos.cofira.dto.grasa.ActualizarGrasaDTO;
import com.gestioneventos.cofira.dto.grasa.RegistroGrasaDTO;
import com.gestioneventos.cofira.dto.peso.ActualizarPesoDTO;
import com.gestioneventos.cofira.dto.peso.RegistroPesoDTO;
import com.gestioneventos.cofira.services.RegistroGrasaService;
import com.gestioneventos.cofira.services.RegistroPesoService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/registro-peso")
public class RegistroPesoController {

    private final RegistroPesoService registroPesoService;

    public RegistroPesoController(RegistroPesoService registroPesoService) {
        this.registroPesoService = registroPesoService;
    }

    @GetMapping("/hoy")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RegistroPesoDTO> obtenerPesoHoy(Principal principal) {
        RegistroPesoDTO peso = registroPesoService.obtenerPesoDelDia(principal.getName(), LocalDate.now());
        return ResponseEntity.ok(peso);
    }

    @GetMapping("/{fecha}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RegistroPesoDTO> obtenerPesoPorFecha(
            Principal principal,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        RegistroPesoDTO peso = registroPesoService.obtenerPesoDelDia(principal.getName(), fecha);
        return ResponseEntity.ok(peso);
    }

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RegistroPesoDTO> registrarPeso(
            Principal principal,
            @RequestBody @Valid ActualizarPesoDTO dto) {
        RegistroPesoDTO peso = registroPesoService.registrarPeso(principal.getName(), dto);
        return ResponseEntity.ok(peso);
    }

    @GetMapping("/historial")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RegistroPesoDTO>> obtenerHistorial(
            Principal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<RegistroPesoDTO> historial = registroPesoService.obtenerHistorial(
                principal.getName(), fechaInicio, fechaFin);
        return ResponseEntity.ok(historial);
    }
}
