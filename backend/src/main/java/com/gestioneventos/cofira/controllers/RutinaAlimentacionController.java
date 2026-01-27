package com.gestioneventos.cofira.controllers;

import com.gestioneventos.cofira.api.RutinaAlimentacionControllerApi;
import com.gestioneventos.cofira.dto.ollama.GenerarMenuRequestDTO;
import com.gestioneventos.cofira.dto.ollama.MenuGeneradoDTO;
import com.gestioneventos.cofira.dto.ollama.MenuSemanalGeneradoDTO;
import com.gestioneventos.cofira.dto.rutinaalimentacion.CrearRutinaAlimentacionDTO;
import com.gestioneventos.cofira.dto.rutinaalimentacion.RutinaAlimentacionDTO;
import com.gestioneventos.cofira.services.OllamaService;
import com.gestioneventos.cofira.services.RutinaAlimentacionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/rutinas-alimentacion")
public class RutinaAlimentacionController implements RutinaAlimentacionControllerApi {

    private final RutinaAlimentacionService rutinaAlimentacionService;
    private final OllamaService ollamaService;
    private final ExecutorService executorService = Executors.newCachedThreadPool();

    public RutinaAlimentacionController(RutinaAlimentacionService rutinaAlimentacionService, OllamaService ollamaService) {
        this.rutinaAlimentacionService = rutinaAlimentacionService;
        this.ollamaService = ollamaService;
    }

    @GetMapping
    public ResponseEntity<List<RutinaAlimentacionDTO>> listarRutinas() {
        List<RutinaAlimentacionDTO> rutinas = rutinaAlimentacionService.listarRutinas();
        return ResponseEntity.ok(rutinas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RutinaAlimentacionDTO> obtenerRutina(@PathVariable Long id) {
        RutinaAlimentacionDTO rutina = rutinaAlimentacionService.obtenerRutina(id);
        return ResponseEntity.ok(rutina);
    }

    @PostMapping
    public ResponseEntity<RutinaAlimentacionDTO> crearRutina(@RequestBody @Valid CrearRutinaAlimentacionDTO dto) {
        RutinaAlimentacionDTO nuevaRutina = rutinaAlimentacionService.crearRutina(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaRutina);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarRutina(@PathVariable Long id) {
        rutinaAlimentacionService.eliminarRutina(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generar-menu")
    public ResponseEntity<MenuGeneradoDTO> generarMenuConIA(@RequestBody @Valid GenerarMenuRequestDTO solicitud) {
        MenuGeneradoDTO menuGenerado = ollamaService.generarMenuDiario(solicitud);
        return ResponseEntity.ok(menuGenerado);
    }

    @PostMapping("/generar-menu-semanal")
    public ResponseEntity<MenuSemanalGeneradoDTO> generarMenuSemanal(@RequestBody @Valid GenerarMenuRequestDTO solicitud) {
        MenuSemanalGeneradoDTO menuSemanal = ollamaService.generarMenuSemanal(solicitud);
        return ResponseEntity.ok(menuSemanal);
    }

    @PostMapping(value = "/generar-menu-semanal-stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter generarMenuSemanalStream(@RequestBody @Valid GenerarMenuRequestDTO solicitud) {
        long tiempoTimeoutMilisegundos = 30L * 60L * 1000L;
        SseEmitter emisorEventos = new SseEmitter(tiempoTimeoutMilisegundos);

        executorService.execute(() -> {
            ollamaService.generarMenuSemanalConStreaming(solicitud, emisorEventos);
        });

        return emisorEventos;
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
