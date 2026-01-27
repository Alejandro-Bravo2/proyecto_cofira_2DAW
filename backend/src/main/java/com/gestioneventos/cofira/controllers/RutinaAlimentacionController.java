package com.gestioneventos.cofira.controllers;

import com.gestioneventos.cofira.api.RutinaAlimentacionControllerApi;
import com.gestioneventos.cofira.dto.ollama.GenerarMenuRequestDTO;
import com.gestioneventos.cofira.dto.ollama.MenuGeneradoDTO;
import com.gestioneventos.cofira.dto.ollama.MenuSemanalGeneradoDTO;
import com.gestioneventos.cofira.dto.rutinaalimentacion.CrearRutinaAlimentacionDTO;
import com.gestioneventos.cofira.dto.rutinaalimentacion.RutinaAlimentacionDTO;
import com.gestioneventos.cofira.services.GeminiService;
import com.gestioneventos.cofira.services.RutinaAlimentacionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.security.concurrent.DelegatingSecurityContextExecutorService;

@RestController
@RequestMapping("/api/rutinas-alimentacion")
public class RutinaAlimentacionController implements RutinaAlimentacionControllerApi {

    private final RutinaAlimentacionService rutinaAlimentacionService;
    private final GeminiService geminiService;
    private final ExecutorService executorService = new DelegatingSecurityContextExecutorService(
            Executors.newCachedThreadPool()
    );

    public RutinaAlimentacionController(RutinaAlimentacionService rutinaAlimentacionService, GeminiService geminiService) {
        this.rutinaAlimentacionService = rutinaAlimentacionService;
        this.geminiService = geminiService;
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
        MenuGeneradoDTO menuGenerado = geminiService.generarMenuDiario(solicitud);
        return ResponseEntity.ok(menuGenerado);
    }

    @PostMapping("/generar-menu-semanal")
    public ResponseEntity<MenuSemanalGeneradoDTO> generarMenuSemanal(@RequestBody @Valid GenerarMenuRequestDTO solicitud) {
        MenuSemanalGeneradoDTO menuSemanal = geminiService.generarMenuSemanal(solicitud);
        return ResponseEntity.ok(menuSemanal);
    }

    @PostMapping(value = "/generar-menu-semanal-stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter generarMenuSemanalStream(@RequestBody @Valid GenerarMenuRequestDTO solicitud) {
        long tiempoTimeoutMilisegundos = 30L * 60L * 1000L;
        SseEmitter emisorEventos = new SseEmitter(tiempoTimeoutMilisegundos);

        executorService.execute(() -> {
            geminiService.generarMenuSemanalConStreaming(solicitud, emisorEventos);
        });

        return emisorEventos;
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

    @GetMapping("/mi-menu")
    public ResponseEntity<Map<String, Object>> obtenerMiMenu(Principal principal) {
        String username = principal.getName();
        String menuJson = rutinaAlimentacionService.obtenerMenuDelUsuario(username);

        if (menuJson == null) {
            return ResponseEntity.ok(Map.of("tieneMenu", false));
        }

        return ResponseEntity.ok(Map.of(
            "tieneMenu", true,
            "menuJson", menuJson
        ));
    }

    @PostMapping("/guardar-menu")
    public ResponseEntity<Map<String, String>> guardarMiMenu(
            @RequestBody Map<String, String> solicitud,
            Principal principal) {
        String username = principal.getName();
        String menuJson = solicitud.get("menuJson");
        String fechaInicio = solicitud.get("fechaInicio");
        String fechaFin = solicitud.get("fechaFin");

        rutinaAlimentacionService.guardarMenuDelUsuario(username, menuJson, fechaInicio, fechaFin);

        return ResponseEntity.ok(Map.of("mensaje", "Menú guardado correctamente"));
    }
}
