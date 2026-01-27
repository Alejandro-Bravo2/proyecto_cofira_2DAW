package com.gestioneventos.cofira.services;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestioneventos.cofira.dto.ollama.AlimentoGeneradoDTO;
import com.gestioneventos.cofira.dto.ollama.ComidaGeneradaDTO;
import com.gestioneventos.cofira.dto.ollama.GenerarMenuRequestDTO;
import com.gestioneventos.cofira.dto.ollama.GenerarRutinaRequestDTO;
import com.gestioneventos.cofira.dto.ollama.MenuDiaDTO;
import com.gestioneventos.cofira.dto.ollama.MenuGeneradoDTO;
import com.gestioneventos.cofira.dto.ollama.MenuSemanalGeneradoDTO;
import com.gestioneventos.cofira.dto.ollama.RutinaGeneradaDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${openrouter.api-key}")
    private String openRouterApiKey;

    @Value("${openrouter.model:openai/gpt-4o-mini}")
    private String modeloOpenRouter;

    public GeminiService() {
        SimpleClientHttpRequestFactory factoriaConexiones = new SimpleClientHttpRequestFactory();
        factoriaConexiones.setConnectTimeout(30000);
        factoriaConexiones.setReadTimeout(120000);
        this.restTemplate = new RestTemplate(factoriaConexiones);
        this.objectMapper = new ObjectMapper();
    }

    public RutinaGeneradaDTO generarRutinaEjercicio(GenerarRutinaRequestDTO solicitud) {
        logger.info("Generando rutina de ejercicio para: objetivo={}, nivel={}, dias={}",
            solicitud.getObjetivoPrincipal(),
            solicitud.getNivelFitness(),
            solicitud.getDiasEntrenamientoPorSemana());

        String promptGenerado = construirPromptRutina(solicitud);
        logger.debug("Prompt generado para rutina de ejercicio");

        String respuestaOpenRouter = llamarOpenRouter(promptGenerado);
        logger.debug("Respuesta recibida de OpenRouter, longitud: {} caracteres", respuestaOpenRouter.length());

        RutinaGeneradaDTO rutinaParseada = parsearRespuestaRutina(respuestaOpenRouter);
        logger.info("Rutina generada exitosamente con {} dias de ejercicio",
            rutinaParseada.getDiasEjercicio() != null ? rutinaParseada.getDiasEjercicio().size() : 0);

        return rutinaParseada;
    }

    private String construirPromptRutina(GenerarRutinaRequestDTO solicitud) {
        String equipamientoTexto = solicitud.getEquipamientoDisponible() != null
                ? String.join(", ", solicitud.getEquipamientoDisponible())
                : "sin equipamiento especifico";

        String lesionesTexto = solicitud.getLesiones() != null && !solicitud.getLesiones().isEmpty()
                ? String.join(", ", solicitud.getLesiones())
                : "ninguna";

        String condicionesTexto = solicitud.getCondicionesMedicas() != null && !solicitud.getCondicionesMedicas().isEmpty()
                ? String.join(", ", solicitud.getCondicionesMedicas())
                : "ninguna";

        String ubicacionTexto = mapearUbicacionEntrenamiento(solicitud.getUbicacionEntrenamiento());
        String nivelIntensidad = calcularNivelIntensidad(solicitud);
        String seccionProgresion = construirSeccionProgresion(solicitud);

        int semanaActual = solicitud.getSemanaActual() != null ? solicitud.getSemanaActual() : 1;
        double pesoKg = solicitud.getPesoKg() != null ? solicitud.getPesoKg() : 70.0;
        double alturaCm = solicitud.getAlturaCm() != null ? solicitud.getAlturaCm() : 170.0;
        double imc = solicitud.getImc() != null ? solicitud.getImc() : 24.0;
        int duracionMinutos = solicitud.getDuracionSesionMinutos() != null ? solicitud.getDuracionSesionMinutos() : 60;

        String promptCompleto = String.format("""
            Genera una rutina de ejercicios SEMANA %d para una persona con estas caracteristicas:

            === DATOS PERSONALES ===
            - Objetivo: %s
            - Nivel de fitness: %s
            - Genero: %s
            - Edad: %d anos
            - Peso: %.1f kg
            - Altura: %.1f cm
            - IMC: %.1f

            === ENTRENAMIENTO ===
            - Dias de entrenamiento: %d dias por semana
            - Duracion por sesion: %d minutos
            - Ubicacion: %s
            - Equipamiento disponible: %s

            === SALUD Y LIMITACIONES (MUY IMPORTANTE) ===
            - Lesiones: %s
            - Condiciones medicas: %s

            === PROGRESION ===
            - Semana actual: %d
            - Nivel de intensidad sugerido: %s
            %s

            REGLAS IMPORTANTES:
            1. NO incluyas ejercicios que puedan agravar las lesiones indicadas
            2. Adapta la intensidad segun las condiciones medicas
            3. Si es ubicacion CASA, usa ejercicios sin maquinas pesadas
            4. Si es ubicacion GYM, puedes incluir maquinas y pesos libres
            5. Aumenta progresivamente la dificultad cada semana

            Responde UNICAMENTE con un JSON valido con esta estructura exacta, sin texto adicional:
            {
              "diasEjercicio": [
                {
                  "diaSemana": "Lunes",
                  "grupoMuscular": "Pecho y Triceps",
                  "ejercicios": [
                    {
                      "nombre": "Press de banca",
                      "series": 4,
                      "repeticiones": "8-10",
                      "descansoSegundos": 90,
                      "descripcion": "Acostado en banco, bajar barra al pecho y empujar",
                      "grupoMuscular": "Pecho"
                    }
                  ]
                }
              ]
            }
            """,
                semanaActual,
                solicitud.getObjetivoPrincipal(),
                solicitud.getNivelFitness(),
                solicitud.getGenero(),
                solicitud.getEdad(),
                pesoKg,
                alturaCm,
                imc,
                solicitud.getDiasEntrenamientoPorSemana(),
                duracionMinutos,
                ubicacionTexto,
                equipamientoTexto,
                lesionesTexto,
                condicionesTexto,
                semanaActual,
                nivelIntensidad,
                seccionProgresion
        );

        return promptCompleto;
    }

    private String calcularNivelIntensidad(GenerarRutinaRequestDTO solicitud) {
        int semana = solicitud.getSemanaActual() != null ? solicitud.getSemanaActual() : 1;
        boolean feedbackPositivo = Boolean.TRUE.equals(solicitud.getFeedbackPositivo());

        if (semana == 1) {
            return "MODERADO (semana inicial de adaptacion)";
        } else if (feedbackPositivo) {
            return "ALTO (usuario indica que puede mas)";
        } else {
            return "MODERADO-ALTO (progresion gradual)";
        }
    }

    private String construirSeccionProgresion(GenerarRutinaRequestDTO solicitud) {
        if (solicitud.getSemanaActual() == null || solicitud.getSemanaActual() <= 1) {
            return "";
        }

        StringBuilder seccion = new StringBuilder();
        seccion.append("\n=== AJUSTES BASADOS EN FEEDBACK ===\n");

        if (Boolean.TRUE.equals(solicitud.getFeedbackPositivo())) {
            seccion.append("- El usuario indica que PUEDE LEVANTAR MAS PESO\n");
            seccion.append("- Aumenta series en 1 o repeticiones en 2-3 respecto a la semana anterior\n");
        }

        if (solicitud.getEjerciciosDificiles() != null && !solicitud.getEjerciciosDificiles().isEmpty()) {
            seccion.append("- Ejercicios que resultaron DIFICILES: ").append(solicitud.getEjerciciosDificiles()).append("\n");
            seccion.append("- Considera reducir intensidad o sustituir estos ejercicios\n");
        }

        return seccion.toString();
    }

    private String mapearUbicacionEntrenamiento(String ubicacion) {
        if (ubicacion == null) {
            return "Gimnasio";
        }

        return switch (ubicacion) {
            case "HOME" -> "Casa (equipamiento limitado)";
            case "GYM" -> "Gimnasio (equipamiento completo)";
            case "OUTDOOR" -> "Aire libre (sin equipamiento)";
            case "MIXED" -> "Mixto (casa y gimnasio)";
            default -> "Gimnasio";
        };
    }

    private String llamarOpenRouter(String prompt) {
        logger.info("Llamando a OpenRouter con modelo: {}", modeloOpenRouter);

        Map<String, Object> mensaje = Map.of(
                "role", "user",
                "content", prompt
        );

        Map<String, Object> cuerpoSolicitud = Map.of(
                "model", modeloOpenRouter,
                "messages", List.of(mensaje),
                "temperature", 0.7
        );

        try {
            HttpHeaders cabeceras = new HttpHeaders();
            cabeceras.setContentType(MediaType.APPLICATION_JSON);
            cabeceras.setBearerAuth(openRouterApiKey);
            cabeceras.set("HTTP-Referer", "https://cofira.app");
            cabeceras.set("X-Title", "Cofira");

            String cuerpoJson = objectMapper.writeValueAsString(cuerpoSolicitud);
            HttpEntity<String> solicitudHttp = new HttpEntity<>(cuerpoJson, cabeceras);

            logger.debug("Enviando solicitud a OpenRouter...");
            String respuestaCompleta = restTemplate.postForObject(OPENROUTER_URL, solicitudHttp, String.class);
            logger.debug("Respuesta completa recibida de OpenRouter");

            JsonNode nodoRespuesta = objectMapper.readTree(respuestaCompleta);

            JsonNode errorNode = nodoRespuesta.get("error");
            if (errorNode != null) {
                String mensajeError = errorNode.has("message") ? errorNode.get("message").asText() : "Error desconocido de OpenRouter";
                logger.error("OpenRouter devolvio error: {}", mensajeError);
                throw new RuntimeException("Error de OpenRouter: " + mensajeError);
            }

            JsonNode choices = nodoRespuesta.get("choices");
            if (choices == null || choices.isEmpty()) {
                logger.error("OpenRouter no devolvio choices. Respuesta completa: {}", respuestaCompleta);
                throw new RuntimeException("OpenRouter no devolvio choices en la respuesta");
            }

            String textoRespuesta = choices.get(0).get("message").get("content").asText();
            logger.info("Respuesta de OpenRouter recibida exitosamente, longitud: {} caracteres", textoRespuesta.length());

            return textoRespuesta;

        } catch (Exception excepcion) {
            logger.error("Error al comunicarse con OpenRouter: {}", excepcion.getMessage(), excepcion);
            throw new RuntimeException("Error al comunicarse con OpenRouter: " + excepcion.getMessage(), excepcion);
        }
    }

    private RutinaGeneradaDTO parsearRespuestaRutina(String respuestaJson) {
        try {
            String jsonLimpio = limpiarRespuestaJson(respuestaJson);
            logger.debug("JSON limpio para parsear rutina, longitud: {} caracteres", jsonLimpio.length());

            RutinaGeneradaDTO rutinaParsesada = objectMapper.readValue(jsonLimpio, RutinaGeneradaDTO.class);
            return rutinaParsesada;

        } catch (JsonProcessingException excepcion) {
            logger.error("Error al parsear respuesta de rutina. Respuesta original: {}", respuestaJson);
            logger.error("Detalle del error de parsing: {}", excepcion.getMessage());
            throw new RuntimeException("Error al parsear respuesta de OpenRouter: " + excepcion.getMessage(), excepcion);
        }
    }

    private String limpiarRespuestaJson(String respuesta) {
        if (respuesta == null || respuesta.isEmpty()) {
            logger.warn("Respuesta vacia recibida de OpenRouter");
            return "{}";
        }

        String respuestaLimpia = respuesta.trim();

        if (respuestaLimpia.startsWith("```json")) {
            respuestaLimpia = respuestaLimpia.substring(7);
            logger.debug("Eliminado prefijo ```json de la respuesta");
        } else if (respuestaLimpia.startsWith("```")) {
            respuestaLimpia = respuestaLimpia.substring(3);
            logger.debug("Eliminado prefijo ``` de la respuesta");
        }

        if (respuestaLimpia.endsWith("```")) {
            respuestaLimpia = respuestaLimpia.substring(0, respuestaLimpia.length() - 3);
            logger.debug("Eliminado sufijo ``` de la respuesta");
        }

        return respuestaLimpia.trim();
    }

    public boolean verificarConexion() {
        try {
            Map<String, Object> mensaje = Map.of(
                    "role", "user",
                    "content", "Responde solo: OK"
            );

            Map<String, Object> cuerpoSolicitud = Map.of(
                    "model", modeloOpenRouter,
                    "messages", List.of(mensaje),
                    "max_tokens", 10
            );

            HttpHeaders cabeceras = new HttpHeaders();
            cabeceras.setContentType(MediaType.APPLICATION_JSON);
            cabeceras.setBearerAuth(openRouterApiKey);
            cabeceras.set("HTTP-Referer", "https://cofira.app");

            String cuerpoJson = objectMapper.writeValueAsString(cuerpoSolicitud);
            HttpEntity<String> solicitudHttp = new HttpEntity<>(cuerpoJson, cabeceras);

            String respuesta = restTemplate.postForObject(OPENROUTER_URL, solicitudHttp, String.class);

            return respuesta != null;

        } catch (Exception excepcion) {
            return false;
        }
    }

    public MenuGeneradoDTO generarMenuDiario(GenerarMenuRequestDTO solicitud) {
        String promptGenerado = construirPromptMenuDiario(solicitud);

        String respuestaOpenRouter = llamarOpenRouter(promptGenerado);

        MenuGeneradoDTO menuParseado = parsearRespuestaMenu(respuestaOpenRouter);

        return menuParseado;
    }

    private String construirPromptMenuDiario(GenerarMenuRequestDTO solicitud) {
        String alergiasTexto = solicitud.getAlergias() != null && !solicitud.getAlergias().isEmpty()
                ? String.join(", ", solicitud.getAlergias())
                : "ninguna";

        String promptCompleto = String.format("""
            Genera un menu diario de alimentacion para una persona con estas caracteristicas:
            - Tipo de dieta: %s
            - Alergias o intolerancias: %s
            - Numero de comidas al dia: %d
            - Calorias diarias objetivo: %.0f kcal
            - Proteinas objetivo: %.0f gramos
            - Carbohidratos objetivo: %.0f gramos
            - Grasas objetivo: %.0f gramos
            - Objetivo principal: %s
            - Genero: %s
            - Edad: %d anos

            IMPORTANTE:
            - NO incluyas ningun alimento que contenga los alergenos indicados
            - Distribuye las calorias y macros de forma equilibrada entre las comidas
            - Incluye ingredientes con sus cantidades aproximadas en gramos

            Responde UNICAMENTE con un JSON valido con esta estructura exacta, sin texto adicional:
            {
              "comidas": [
                {
                  "tipoComida": "DESAYUNO",
                  "nombre": "Tostadas con aguacate y huevos",
                  "caloriasEstimadas": 450,
                  "proteinasGramos": 20,
                  "carbohidratosGramos": 35,
                  "grasasGramos": 25,
                  "alimentos": [
                    {
                      "nombre": "Pan integral",
                      "cantidad": "2 rebanadas",
                      "gramos": 60,
                      "icono": "pan"
                    }
                  ],
                  "preparacion": "Descripcion breve de como preparar el plato"
                }
              ],
              "resumenNutricional": {
                "caloriasTotal": 2000,
                "proteinasTotal": 120,
                "carbohidratosTotal": 200,
                "grasasTotal": 70
              }
            }

            Los tipos de comida validos son: DESAYUNO, ALMUERZO, COMIDA, MERIENDA, CENA
            Los iconos validos son: pan, fruta, verdura, proteina, lacteo, bebida, cereal, legumbre, fruto-seco
            """,
                solicitud.getTipoDieta(),
                alergiasTexto,
                solicitud.getComidasPorDia(),
                solicitud.getCaloriasDiarias(),
                solicitud.getProteinasGramos(),
                solicitud.getCarbohidratosGramos(),
                solicitud.getGrasasGramos(),
                solicitud.getObjetivoPrincipal(),
                solicitud.getGenero(),
                solicitud.getEdad()
        );

        return promptCompleto;
    }

    private MenuGeneradoDTO parsearRespuestaMenu(String respuestaJson) {
        try {
            String jsonLimpio = limpiarRespuestaJson(respuestaJson);
            MenuGeneradoDTO menuParseado = objectMapper.readValue(jsonLimpio, MenuGeneradoDTO.class);
            normalizarCapitalizacionMenu(menuParseado);
            return menuParseado;

        } catch (JsonProcessingException excepcion) {
            logger.error("Error al parsear respuesta de menu. Respuesta original: {}", respuestaJson);
            throw new RuntimeException("Error al parsear respuesta de menu de OpenRouter: " + excepcion.getMessage(), excepcion);
        }
    }

    private void normalizarCapitalizacionMenu(MenuGeneradoDTO menu) {
        if (menu == null || menu.getComidas() == null) {
            return;
        }

        for (ComidaGeneradaDTO comida : menu.getComidas()) {
            if (comida.getNombre() != null) {
                comida.setNombre(capitalizarEstiloEspanol(comida.getNombre()));
            }

            if (comida.getAlimentos() != null) {
                for (AlimentoGeneradoDTO alimento : comida.getAlimentos()) {
                    if (alimento.getNombre() != null) {
                        alimento.setNombre(capitalizarEstiloEspanol(alimento.getNombre()));
                    }
                    if (alimento.getCantidad() != null) {
                        alimento.setCantidad(capitalizarEstiloEspanol(alimento.getCantidad()));
                    }
                }
            }
        }
    }

    private String capitalizarEstiloEspanol(String texto) {
        if (texto == null || texto.isEmpty()) {
            return texto;
        }

        String textoMinusculas = texto.toLowerCase();
        String primeraLetra = textoMinusculas.substring(0, 1).toUpperCase();
        String restoTexto = textoMinusculas.substring(1);

        return primeraLetra + restoTexto;
    }

    public MenuSemanalGeneradoDTO generarMenuSemanal(GenerarMenuRequestDTO solicitud) {
        List<MenuDiaDTO> menusPorDia = new ArrayList<>();

        LocalDate hoy = LocalDate.now();
        LocalDate lunesSemanaActual = hoy.with(DayOfWeek.MONDAY);
        LocalDate fechaInicio = lunesSemanaActual;

        List<String> platosYaGenerados = new ArrayList<>();

        for (int indiceDia = 0; indiceDia < 14; indiceDia++) {
            LocalDate fechaDelDia = fechaInicio.plusDays(indiceDia);
            int numeroDia = indiceDia + 1;

            String promptDelDia = construirPromptMenuDelDia(solicitud, numeroDia, platosYaGenerados);

            String respuestaOpenRouter = llamarOpenRouter(promptDelDia);

            MenuGeneradoDTO menuDelDia = parsearRespuestaMenu(respuestaOpenRouter);

            MenuDiaDTO menuDiaDTO = MenuDiaDTO.builder()
                    .fecha(fechaDelDia.toString())
                    .numeroDia(numeroDia)
                    .comidas(menuDelDia.getComidas())
                    .resumenNutricional(menuDelDia.getResumenNutricional())
                    .build();

            menusPorDia.add(menuDiaDTO);

            List<ComidaGeneradaDTO> comidasDelDia = menuDelDia.getComidas();
            java.util.stream.Stream<String> streamNombres = comidasDelDia.stream().map(ComidaGeneradaDTO::getNombre);
            List<String> nombresDelDia = streamNombres.collect(Collectors.toList());
            platosYaGenerados.addAll(nombresDelDia);
        }

        MenuSemanalGeneradoDTO menuSemanal = MenuSemanalGeneradoDTO.builder()
                .menusPorDia(menusPorDia)
                .fechaInicio(fechaInicio.toString())
                .fechaFin(fechaInicio.plusDays(13).toString())
                .build();

        return menuSemanal;
    }

    public void generarMenuSemanalConStreaming(GenerarMenuRequestDTO solicitud, SseEmitter emisorEventos) {
        LocalDate hoy = LocalDate.now();
        LocalDate lunesSemanaActual = hoy.with(DayOfWeek.MONDAY);
        LocalDate fechaInicio = lunesSemanaActual;

        List<String> platosYaGenerados = new ArrayList<>();
        int totalDias = 14;

        try {
            Map<String, String> eventoInicio = Map.of(
                "tipo", "inicio",
                "totalDias", String.valueOf(totalDias),
                "fechaInicio", fechaInicio.toString(),
                "fechaFin", fechaInicio.plusDays(totalDias - 1).toString()
            );
            emisorEventos.send(SseEmitter.event()
                .name("inicio")
                .data(objectMapper.writeValueAsString(eventoInicio)));

            for (int indiceDia = 0; indiceDia < totalDias; indiceDia++) {
                LocalDate fechaDelDia = fechaInicio.plusDays(indiceDia);
                int numeroDia = indiceDia + 1;

                String promptDelDia = construirPromptMenuDelDia(solicitud, numeroDia, platosYaGenerados);
                String respuestaOpenRouter = llamarOpenRouter(promptDelDia);
                MenuGeneradoDTO menuDelDia = parsearRespuestaMenu(respuestaOpenRouter);

                MenuDiaDTO menuDiaDTO = MenuDiaDTO.builder()
                    .fecha(fechaDelDia.toString())
                    .numeroDia(numeroDia)
                    .comidas(menuDelDia.getComidas())
                    .resumenNutricional(menuDelDia.getResumenNutricional())
                    .build();

                String menuDiaJson = objectMapper.writeValueAsString(menuDiaDTO);
                emisorEventos.send(SseEmitter.event()
                    .name("menu-dia")
                    .data(menuDiaJson));

                List<ComidaGeneradaDTO> comidasDelDiaStream = menuDelDia.getComidas();
                java.util.stream.Stream<String> streamNombresComidas = comidasDelDiaStream.stream().map(ComidaGeneradaDTO::getNombre);
                List<String> nombresDelDia = streamNombresComidas.collect(Collectors.toList());
                platosYaGenerados.addAll(nombresDelDia);
            }

            Map<String, String> eventoFin = Map.of("tipo", "completado");
            emisorEventos.send(SseEmitter.event()
                .name("fin")
                .data(objectMapper.writeValueAsString(eventoFin)));

            emisorEventos.complete();

        } catch (IOException excepcion) {
            emisorEventos.completeWithError(excepcion);
        } catch (Exception excepcion) {
            try {
                Map<String, String> eventoError = Map.of(
                    "tipo", "error",
                    "mensaje", excepcion.getMessage() != null ? excepcion.getMessage() : "Error desconocido"
                );
                emisorEventos.send(SseEmitter.event()
                    .name("error")
                    .data(objectMapper.writeValueAsString(eventoError)));
            } catch (IOException ioExcepcion) {
                emisorEventos.completeWithError(ioExcepcion);
            }
            emisorEventos.completeWithError(excepcion);
        }
    }

    private String construirPromptMenuDelDia(GenerarMenuRequestDTO solicitud, int numeroDia, List<String> platosYaGenerados) {
        String alergiasTexto = solicitud.getAlergias() != null && !solicitud.getAlergias().isEmpty()
                ? String.join(", ", solicitud.getAlergias())
                : "ninguna";

        String platosEvitarTexto = platosYaGenerados.isEmpty()
                ? "ninguno (es el primer dia)"
                : String.join(", ", platosYaGenerados);

        String promptCompleto = String.format("""
            Genera el menu del DIA %d de 14 para una persona con estas caracteristicas:
            - Tipo de dieta: %s
            - Alergias o intolerancias: %s
            - Numero de comidas al dia: %d
            - Calorias diarias objetivo: %.0f kcal
            - Proteinas objetivo: %.0f gramos
            - Carbohidratos objetivo: %.0f gramos
            - Grasas objetivo: %.0f gramos
            - Objetivo principal: %s
            - Genero: %s
            - Edad: %d anos

            IMPORTANTE - REGLAS DE VARIEDAD:
            - Este es el dia %d de un plan de 14 dias
            - NO repitas estos platos que ya se generaron en dias anteriores: %s
            - Genera platos DIFERENTES y VARIADOS para mantener la dieta interesante
            - Usa ingredientes de temporada y recetas distintas cada dia

            IMPORTANTE - ALERGIAS:
            - NO incluyas ningun alimento que contenga los alergenos indicados
            - Distribuye las calorias y macros de forma equilibrada entre las comidas
            - Incluye ingredientes con sus cantidades aproximadas en gramos

            Responde UNICAMENTE con un JSON valido con esta estructura exacta, sin texto adicional:
            {
              "comidas": [
                {
                  "tipoComida": "DESAYUNO",
                  "nombre": "Nombre del plato",
                  "caloriasEstimadas": 450,
                  "proteinasGramos": 20,
                  "carbohidratosGramos": 35,
                  "grasasGramos": 25,
                  "alimentos": [
                    {
                      "nombre": "Ingrediente",
                      "cantidad": "cantidad descriptiva",
                      "gramos": 60,
                      "icono": "pan"
                    }
                  ],
                  "preparacion": "Descripcion breve de como preparar el plato"
                }
              ],
              "resumenNutricional": {
                "caloriasTotal": 2000,
                "proteinasTotal": 120,
                "carbohidratosTotal": 200,
                "grasasTotal": 70
              }
            }

            Los tipos de comida validos son: DESAYUNO, ALMUERZO, COMIDA, MERIENDA, CENA
            Los iconos validos son: pan, fruta, verdura, proteina, lacteo, bebida, cereal, legumbre, fruto-seco
            """,
                numeroDia,
                solicitud.getTipoDieta(),
                alergiasTexto,
                solicitud.getComidasPorDia(),
                solicitud.getCaloriasDiarias(),
                solicitud.getProteinasGramos(),
                solicitud.getCarbohidratosGramos(),
                solicitud.getGrasasGramos(),
                solicitud.getObjetivoPrincipal(),
                solicitud.getGenero(),
                solicitud.getEdad(),
                numeroDia,
                platosEvitarTexto
        );

        return promptCompleto;
    }
}
