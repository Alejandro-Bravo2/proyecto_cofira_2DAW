package com.gestioneventos.cofira.api;

import com.gestioneventos.cofira.dto.ollama.RutinaGeneradaDTO;
import com.gestioneventos.cofira.dto.rutinaejercicio.CrearRutinaEjercicioDTO;
import com.gestioneventos.cofira.dto.rutinaejercicio.RutinaEjercicioDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@Tag(name = "Rutinas de Ejercicio", description = "API para gestión de rutinas de ejercicio semanales")
public interface RutinaEjercicioControllerApi {

    @Operation(summary = "Listar todas las rutinas de ejercicio", description = "Obtiene una lista de todas las rutinas de ejercicio")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de rutinas obtenida exitosamente",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = RutinaEjercicioDTO.class)))
    })
    ResponseEntity<List<RutinaEjercicioDTO>> listarRutinas();

    @Operation(summary = "Obtener rutina por ID", description = "Obtiene los detalles de una rutina de ejercicio específica")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Rutina encontrada",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = RutinaEjercicioDTO.class))),
        @ApiResponse(responseCode = "404", description = "Rutina no encontrada", content = @Content)
    })
    ResponseEntity<RutinaEjercicioDTO> obtenerRutina(
        @Parameter(description = "ID de la rutina a obtener", required = true) @PathVariable Long id);

    @Operation(summary = "Crear una nueva rutina de ejercicio", description = "Crea una nueva rutina de ejercicio con 7 días")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Rutina creada exitosamente",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = RutinaEjercicioDTO.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content)
    })
    ResponseEntity<RutinaEjercicioDTO> crearRutina(
        @Parameter(description = "Datos de la rutina a crear", required = true) @RequestBody @Valid CrearRutinaEjercicioDTO dto);

    @Operation(summary = "Eliminar una rutina de ejercicio", description = "Elimina una rutina de ejercicio existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Rutina eliminada exitosamente", content = @Content),
        @ApiResponse(responseCode = "404", description = "Rutina no encontrada", content = @Content)
    })
    ResponseEntity<?> eliminarRutina(
        @Parameter(description = "ID de la rutina a eliminar", required = true) @PathVariable Long id);

    @Operation(summary = "Generar rutina con IA", description = "Genera una rutina de ejercicios personalizada usando IA y la persiste para el usuario autenticado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Rutina generada y guardada exitosamente",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = RutinaGeneradaDTO.class))),
        @ApiResponse(responseCode = "500", description = "Error al comunicarse con el servicio de IA", content = @Content)
    })
    ResponseEntity<RutinaGeneradaDTO> generarRutinaConIA(@AuthenticationPrincipal UserDetails userDetails);

    @Operation(summary = "Verificar estado de IA", description = "Comprueba si el servicio de Gemini esta disponible")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estado de Gemini obtenido")
    })
    ResponseEntity<Map<String, Object>> verificarEstadoIA();
}
