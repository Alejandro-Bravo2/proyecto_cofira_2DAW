package com.gestioneventos.cofira.services;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestioneventos.cofira.dto.ollama.ComidaGeneradaDTO;
import com.gestioneventos.cofira.dto.ollama.GenerarMenuRequestDTO;
import com.gestioneventos.cofira.dto.ollama.GenerarRutinaRequestDTO;
import com.gestioneventos.cofira.dto.ollama.MenuDiaDTO;
import com.gestioneventos.cofira.dto.ollama.MenuGeneradoDTO;
import com.gestioneventos.cofira.dto.ollama.MenuSemanalGeneradoDTO;
import com.gestioneventos.cofira.dto.ollama.ResumenNutricionalDTO;
import com.gestioneventos.cofira.dto.ollama.RutinaGeneradaDTO;

@Service
public class OllamaService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${ollama.model:llama3.2}")
    private String modeloOllama;

    public OllamaService(@Value("${ollama.url:http://localhost:11434}") String ollamaUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(ollamaUrl)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public RutinaGeneradaDTO generarRutinaEjercicio(GenerarRutinaRequestDTO solicitud) {
        String promptGenerado = construirPromptRutina(solicitud);

        String respuestaOllama = llamarOllama(promptGenerado);

        RutinaGeneradaDTO rutinaParseada = parsearRespuestaRutina(respuestaOllama);

        return rutinaParseada;
    }

    private String construirPromptRutina(GenerarRutinaRequestDTO solicitud) {
        String equipamientoTexto = solicitud.getEquipamientoDisponible() != null
                ? String.join(", ", solicitud.getEquipamientoDisponible())
                : "sin equipamiento";

        String promptCompleto = String.format("""
            Genera una rutina de ejercicios para una persona con estas caracteristicas:
            - Objetivo: %s
            - Nivel de fitness: %s
            - Dias de entrenamiento: %d dias por semana
            - Equipamiento disponible: %s
            - Genero: %s
            - Edad: %d anos

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
                solicitud.getObjetivoPrincipal(),
                solicitud.getNivelFitness(),
                solicitud.getDiasEntrenamientoPorSemana(),
                equipamientoTexto,
                solicitud.getGenero(),
                solicitud.getEdad()
        );

        return promptCompleto;
    }

    private String llamarOllama(String prompt) {
        Map<String, Object> cuerpoSolicitud = Map.of(
                "model", modeloOllama,
                "prompt", prompt,
                "stream", false,
                "format", "json"
        );

        try {
            String respuestaCompleta = webClient.post()
                    .uri("/api/generate")
                    .bodyValue(cuerpoSolicitud)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode nodoRespuesta = objectMapper.readTree(respuestaCompleta);
            String textoRespuesta = nodoRespuesta.get("response").asText();

            return textoRespuesta;

        } catch (Exception excepcion) {
            throw new RuntimeException("Error al comunicarse con Ollama: " + excepcion.getMessage(), excepcion);
        }
    }

    private RutinaGeneradaDTO parsearRespuestaRutina(String respuestaJson) {
        try {
            RutinaGeneradaDTO rutinaParsesada = objectMapper.readValue(respuestaJson, RutinaGeneradaDTO.class);
            return rutinaParsesada;

        } catch (JsonProcessingException excepcion) {
            throw new RuntimeException("Error al parsear respuesta de Ollama: " + excepcion.getMessage(), excepcion);
        }
    }

    public boolean verificarConexion() {
        try {
            String respuesta = webClient.get()
                    .uri("/api/tags")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return respuesta != null;

        } catch (Exception excepcion) {
            return false;
        }
    }

    public MenuGeneradoDTO generarMenuDiario(GenerarMenuRequestDTO solicitud) {
        String promptGenerado = construirPromptMenuDiario(solicitud);

        String respuestaOllama = llamarOllama(promptGenerado);

        MenuGeneradoDTO menuParseado = parsearRespuestaMenu(respuestaOllama);

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
            MenuGeneradoDTO menuParseado = objectMapper.readValue(respuestaJson, MenuGeneradoDTO.class);
            return menuParseado;

        } catch (JsonProcessingException excepcion) {
            throw new RuntimeException("Error al parsear respuesta de menu de Ollama: " + excepcion.getMessage(), excepcion);
        }
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

            String respuestaOllama = llamarOllama(promptDelDia);

            MenuGeneradoDTO menuDelDia = parsearRespuestaMenu(respuestaOllama);

            MenuDiaDTO menuDiaDTO = MenuDiaDTO.builder()
                    .fecha(fechaDelDia.toString())
                    .numeroDia(numeroDia)
                    .comidas(menuDelDia.getComidas())
                    .resumenNutricional(menuDelDia.getResumenNutricional())
                    .build();

            menusPorDia.add(menuDiaDTO);

            List<String> nombresDelDia = menuDelDia.getComidas().stream()
                    .map(ComidaGeneradaDTO::getNombre)
                    .collect(Collectors.toList());
            platosYaGenerados.addAll(nombresDelDia);
        }

        MenuSemanalGeneradoDTO menuSemanal = MenuSemanalGeneradoDTO.builder()
                .menusPorDia(menusPorDia)
                .fechaInicio(fechaInicio.toString())
                .fechaFin(fechaInicio.plusDays(13).toString())
                .build();

        return menuSemanal;
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
