package com.gestioneventos.cofira.controllers;

import com.gestioneventos.cofira.api.RutinaEjercicioControllerApi;
import com.gestioneventos.cofira.dto.gimnasio.FeedbackEjercicioDTO;
import com.gestioneventos.cofira.dto.gimnasio.GuardarProgresoRequestDTO;
import com.gestioneventos.cofira.dto.gimnasio.HistorialEntrenamientoDTO;
import com.gestioneventos.cofira.dto.ollama.GenerarRutinaRequestDTO;
import com.gestioneventos.cofira.dto.ollama.RutinaGeneradaDTO;
import com.gestioneventos.cofira.dto.rutinaejercicio.CrearRutinaEjercicioDTO;
import com.gestioneventos.cofira.dto.rutinaejercicio.RutinaEjercicioDTO;
import com.gestioneventos.cofira.services.GeminiService;
import com.gestioneventos.cofira.services.RutinaEjercicioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/rutinas-ejercicio")
public class RutinaEjercicioController implements RutinaEjercicioControllerApi {

    private final RutinaEjercicioService rutinaEjercicioService;
    private final GeminiService geminiService;

    public RutinaEjercicioController(RutinaEjercicioService rutinaEjercicioService, GeminiService geminiService) {
        this.rutinaEjercicioService = rutinaEjercicioService;
        this.geminiService = geminiService;
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
        RutinaGeneradaDTO rutinaGenerada = geminiService.generarRutinaEjercicio(solicitud);
        return ResponseEntity.ok(rutinaGenerada);
    }

    @GetMapping("/ia/estado")
    public ResponseEntity<Map<String, Object>> verificarEstadoIA() {
        boolean conexionActiva = geminiService.verificarConexion();
        Map<String, Object> respuesta = Map.of(
            "conectado", conexionActiva,
            "mensaje", conexionActiva ? "Gemini funcionando correctamente" : "No se puede conectar con Gemini"
        );
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/feedback")
    public ResponseEntity<FeedbackEjercicioDTO> guardarFeedback(@RequestBody @Valid FeedbackEjercicioDTO feedbackDTO) {
        FeedbackEjercicioDTO feedbackGuardado = rutinaEjercicioService.guardarFeedback(feedbackDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackGuardado);
    }

    @GetMapping("/feedback/ultimo")
    public ResponseEntity<FeedbackEjercicioDTO> obtenerUltimoFeedback() {
        Optional<FeedbackEjercicioDTO> ultimoFeedback = rutinaEjercicioService.obtenerUltimoFeedback();

        if (ultimoFeedback.isPresent()) {
            return ResponseEntity.ok(ultimoFeedback.get());
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/feedback/semana/{semana}")
    public ResponseEntity<FeedbackEjercicioDTO> obtenerFeedbackPorSemana(@PathVariable Integer semana) {
        Optional<FeedbackEjercicioDTO> feedbackSemana = rutinaEjercicioService.obtenerFeedbackPorSemana(semana);

        if (feedbackSemana.isPresent()) {
            return ResponseEntity.ok(feedbackSemana.get());
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/progreso")
    public ResponseEntity<List<HistorialEntrenamientoDTO>> guardarProgreso(@RequestBody @Valid GuardarProgresoRequestDTO progresoDTO) {
        List<HistorialEntrenamientoDTO> progresosGuardados = rutinaEjercicioService.guardarProgreso(progresoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(progresosGuardados);
    }

    @GetMapping("/progreso/semana/{semana}")
    public ResponseEntity<List<HistorialEntrenamientoDTO>> obtenerProgresoPorSemana(@PathVariable Integer semana) {
        List<HistorialEntrenamientoDTO> progresosSemana = rutinaEjercicioService.obtenerProgresoPorSemana(semana);
        return ResponseEntity.ok(progresosSemana);
    }

    @GetMapping("/progreso/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        Map<String, Object> estadisticas = rutinaEjercicioService.calcularEstadisticas();
        return ResponseEntity.ok(estadisticas);
    }

    @GetMapping("/semana-actual")
    public ResponseEntity<Map<String, Integer>> obtenerSemanaActual() {
        Integer semanaActual = rutinaEjercicioService.calcularSemanaActual();
        Map<String, Integer> respuesta = Map.of("semanaActual", semanaActual);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/ejercicios-unicos")
    public ResponseEntity<List<String>> obtenerEjerciciosUnicos() {
        List<String> ejercicios = rutinaEjercicioService.obtenerEjerciciosUnicos();
        return ResponseEntity.ok(ejercicios);
    }

    @GetMapping("/progreso/ejercicio/{nombreEjercicio}")
    public ResponseEntity<List<HistorialEntrenamientoDTO>> obtenerProgresoPorEjercicio(@PathVariable String nombreEjercicio) {
        List<HistorialEntrenamientoDTO> progreso = rutinaEjercicioService.obtenerProgresoPorEjercicio(nombreEjercicio);
        return ResponseEntity.ok(progreso);
    }
}
