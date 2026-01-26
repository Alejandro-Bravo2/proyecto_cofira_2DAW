package com.gestioneventos.cofira.controllers;

import com.gestioneventos.cofira.api.RutinaEjercicioControllerApi;
import com.gestioneventos.cofira.dto.ollama.GenerarRutinaRequestDTO;
import com.gestioneventos.cofira.dto.ollama.RutinaGeneradaDTO;
import com.gestioneventos.cofira.dto.rutinaejercicio.CrearRutinaEjercicioDTO;
import com.gestioneventos.cofira.dto.rutinaejercicio.RutinaEjercicioDTO;
import com.gestioneventos.cofira.services.OllamaService;
import com.gestioneventos.cofira.services.RutinaEjercicioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rutinas-ejercicio")
public class RutinaEjercicioController implements RutinaEjercicioControllerApi {

    private final RutinaEjercicioService rutinaEjercicioService;
    private final OllamaService ollamaService;

    public RutinaEjercicioController(RutinaEjercicioService rutinaEjercicioService, OllamaService ollamaService) {
        this.rutinaEjercicioService = rutinaEjercicioService;
        this.ollamaService = ollamaService;
    }

    @GetMapping
    public ResponseEntity<List<RutinaEjercicioDTO>> listarRutinas() {
        List<RutinaEjercicioDTO> rutinas = rutinaEjercicioService.listarRutinas();
        return ResponseEntity.ok(rutinas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RutinaEjercicioDTO> obtenerRutina(@PathVariable Long id) {
        RutinaEjercicioDTO rutina = rutinaEjercicioService.obtenerRutina(id);
        return ResponseEntity.ok(rutina);
    }

    @PostMapping
    public ResponseEntity<RutinaEjercicioDTO> crearRutina(@RequestBody @Valid CrearRutinaEjercicioDTO dto) {
        RutinaEjercicioDTO nuevaRutina = rutinaEjercicioService.crearRutina(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaRutina);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarRutina(@PathVariable Long id) {
        rutinaEjercicioService.eliminarRutina(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generar")
    public ResponseEntity<RutinaGeneradaDTO> generarRutinaConIA(@RequestBody @Valid GenerarRutinaRequestDTO solicitud) {
        RutinaGeneradaDTO rutinaGenerada = ollamaService.generarRutinaEjercicio(solicitud);
        return ResponseEntity.ok(rutinaGenerada);
    }

    @GetMapping("/ollama/estado")
    public ResponseEntity<Map<String, Object>> verificarEstadoOllama() {
        boolean conexionActiva = ollamaService.verificarConexion();
        Map<String, Object> respuesta = Map.of(
            "conectado", conexionActiva,
            "mensaje", conexionActiva ? "Ollama funcionando correctamente" : "No se puede conectar con Ollama"
        );
        return ResponseEntity.ok(respuesta);
    }
}
