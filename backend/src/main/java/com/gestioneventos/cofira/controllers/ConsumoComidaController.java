package com.gestioneventos.cofira.controllers;

import com.gestioneventos.cofira.dto.consumo.*;
import com.gestioneventos.cofira.services.ConsumoComidaService;
import com.gestioneventos.cofira.services.GeminiService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consumo-comida")
public class ConsumoComidaController {

    private final ConsumoComidaService consumoComidaService;
    private final GeminiService geminiService;

    public ConsumoComidaController(ConsumoComidaService consumoComidaService, GeminiService geminiService) {
        this.consumoComidaService = consumoComidaService;
        this.geminiService = geminiService;
    }

    @GetMapping("/hoy")
    public ResponseEntity<List<RegistroComidaDTO>> obtenerRegistrosHoy(Principal principal) {
        String username = principal.getName();
        LocalDate hoy = LocalDate.now();
        List<RegistroComidaDTO> registros = consumoComidaService.obtenerRegistrosDelDia(username, hoy);
        return ResponseEntity.ok(registros);
    }

    @GetMapping("/{fecha}")
    public ResponseEntity<List<RegistroComidaDTO>> obtenerRegistrosPorFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            Principal principal
    ) {
        String username = principal.getName();
        List<RegistroComidaDTO> registros = consumoComidaService.obtenerRegistrosDelDia(username, fecha);
        return ResponseEntity.ok(registros);
    }

    @PostMapping("/marcar")
    public ResponseEntity<RegistroComidaDTO> marcarComidaConsumida(
            @RequestBody @Valid MarcarComidaConsumidaDTO dto,
            Principal principal
    ) {
        String username = principal.getName();
        RegistroComidaDTO registro = consumoComidaService.marcarComidaConsumida(username, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registro);
    }

    @PostMapping("/alternativa")
    public ResponseEntity<RegistroComidaDTO> registrarComidaAlternativa(
            @RequestBody @Valid ComidaAlternativaDTO dto,
            Principal principal
    ) {
        String username = principal.getName();
        RegistroComidaDTO registro = consumoComidaService.registrarComidaAlternativa(username, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registro);
    }

    @DeleteMapping("/{fecha}/{tipoComida}")
    public ResponseEntity<Map<String, String>> desmarcarComida(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @PathVariable String tipoComida,
            Principal principal
    ) {
        String username = principal.getName();
        consumoComidaService.desmarcarComida(username, fecha, tipoComida);
        return ResponseEntity.ok(Map.of("mensaje", "Registro eliminado correctamente"));
    }

    @GetMapping("/resumen/{fecha}")
    public ResponseEntity<ResumenNutricionalRealDTO> obtenerResumenReal(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            Principal principal
    ) {
        String username = principal.getName();
        ResumenNutricionalRealDTO resumen = consumoComidaService.obtenerResumenRealDelDia(username, fecha);
        return ResponseEntity.ok(resumen);
    }

    @GetMapping("/resumen-semanal")
    public ResponseEntity<ResumenNutricionalRealDTO> obtenerResumenSemanal(Principal principal) {
        String username = principal.getName();
        ResumenNutricionalRealDTO resumen = consumoComidaService.obtenerResumenSemanal(username);
        return ResponseEntity.ok(resumen);
    }

    @PostMapping("/analizar-imagen")
    public ResponseEntity<AnalisisImagenDTO> analizarImagen(
            @RequestBody @Valid AnalizarImagenRequestDTO dto
    ) {
        AnalisisImagenDTO analisis = geminiService.analizarImagenComida(dto.getImagenBase64());
        return ResponseEntity.ok(analisis);
    }

    @PostMapping("/guardar-analisis")
    public ResponseEntity<RegistroComidaDTO> guardarAnalisisImagen(
            @RequestBody @Valid AnalizarImagenRequestDTO dto,
            Principal principal
    ) {
        String username = principal.getName();
        AnalisisImagenDTO analisis = geminiService.analizarImagenComida(dto.getImagenBase64());

        RegistroComidaDTO registro = consumoComidaService.guardarAnalisisImagen(
            username,
            dto.getFecha(),
            dto.getTipoComida(),
            null,
            analisis
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(registro);
    }
}
