package com.gestioneventos.cofira.scheduled;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestioneventos.cofira.dto.ollama.GenerarRutinaRequestDTO;
import com.gestioneventos.cofira.dto.ollama.RutinaGeneradaDTO;
import com.gestioneventos.cofira.entities.DiaEjercicio;
import com.gestioneventos.cofira.entities.Ejercicios;
import com.gestioneventos.cofira.entities.FeedbackEjercicio;
import com.gestioneventos.cofira.entities.RutinaEjercicio;
import com.gestioneventos.cofira.entities.UserProfile;
import com.gestioneventos.cofira.entities.Usuario;
import com.gestioneventos.cofira.enums.DiaSemana;
import com.gestioneventos.cofira.repositories.FeedbackEjercicioRepository;
import com.gestioneventos.cofira.repositories.UsuarioRepository;
import com.gestioneventos.cofira.services.GeminiService;

@Component
public class ScheduledTasks {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);
    private static final int DIAS_POR_CICLO_MENSUAL = 30;

    private final UsuarioRepository usuarioRepository;
    private final FeedbackEjercicioRepository feedbackEjercicioRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public ScheduledTasks(UsuarioRepository usuarioRepository,
                          FeedbackEjercicioRepository feedbackEjercicioRepository,
                          GeminiService geminiService) {
        this.usuarioRepository = usuarioRepository;
        this.feedbackEjercicioRepository = feedbackEjercicioRepository;
        this.geminiService = geminiService;
        this.objectMapper = new ObjectMapper();
    }

    @Scheduled(cron = "0 0 6 * * *")
    @Transactional
    public void generarRutinasMensuales() {
        logger.info("Iniciando job de generacion de rutinas mensuales");

        List<Usuario> usuariosConOnboarding = usuarioRepository.findUsuariosConOnboardingCompletado();
        logger.info("Encontrados {} usuarios con onboarding completado", usuariosConOnboarding.size());

        int rutinasGeneradas = 0;
        int errores = 0;

        for (Usuario usuario : usuariosConOnboarding) {
            boolean necesitaRutinaNueva = verificarSiNecesitaRutinaNueva(usuario);

            if (necesitaRutinaNueva) {
                try {
                    generarRutinaMensualParaUsuario(usuario);
                    rutinasGeneradas++;
                    logger.info("Rutina generada para usuario: {}", usuario.getEmail());
                } catch (Exception excepcion) {
                    errores++;
                    logger.error("Error generando rutina para usuario {}: {}",
                            usuario.getEmail(), excepcion.getMessage());
                }
            }
        }

        logger.info("Job completado: {} rutinas generadas, {} errores", rutinasGeneradas, errores);
    }

    private boolean verificarSiNecesitaRutinaNueva(Usuario usuario) {
        RutinaEjercicio rutinaActual = usuario.getRutinaEjercicio();

        if (rutinaActual == null) {
            logger.debug("Usuario {} no tiene rutina, necesita una nueva", usuario.getEmail());
            return true;
        }

        LocalDate fechaFinRutina = rutinaActual.getFechaFin();
        if (fechaFinRutina == null) {
            logger.debug("Usuario {} tiene rutina sin fechaFin, regenerando", usuario.getEmail());
            return true;
        }

        LocalDate hoy = LocalDate.now();
        boolean mesTerminado = hoy.isAfter(fechaFinRutina) || hoy.isEqual(fechaFinRutina);

        if (mesTerminado) {
            logger.debug("Rutina de usuario {} expirada (fechaFin: {})", usuario.getEmail(), fechaFinRutina);
        }

        return mesTerminado;
    }

    @Transactional
    public void generarRutinaMensualParaUsuario(Usuario usuario) {
        UserProfile perfil = usuario.getUserProfile();
        if (perfil == null) {
            logger.warn("Usuario {} sin perfil, saltando generacion", usuario.getEmail());
            return;
        }

        GenerarRutinaRequestDTO solicitudRutina = construirSolicitudDesdePerfilYFeedback(usuario, perfil);

        RutinaGeneradaDTO rutinaGenerada = geminiService.generarRutinaEjercicio(solicitudRutina);

        RutinaEjercicio rutinaEntidad = convertirRutinaGeneradaAEntidad(rutinaGenerada, solicitudRutina);

        usuario.setRutinaEjercicio(rutinaEntidad);
        usuarioRepository.save(usuario);

        logger.info("Rutina mensual guardada para usuario {} - Mes {}",
                usuario.getEmail(), rutinaEntidad.getMesNumero());
    }

    private GenerarRutinaRequestDTO construirSolicitudDesdePerfilYFeedback(Usuario usuario, UserProfile perfil) {
        Integer mesActual = calcularMesActual(usuario);
        FeedbackEjercicio ultimoFeedback = obtenerUltimoFeedback();

        Integer edadCalculada = calcularEdadDesdeNacimiento(perfil.getBirthDate());
        Double imcCalculado = calcularIMC(perfil.getCurrentWeightKg(), perfil.getHeightCm());
        String objetivoMapeado = mapearObjetivoPrincipal(perfil.getPrimaryGoal());
        String generoMapeado = mapearGenero(perfil.getGender());

        GenerarRutinaRequestDTO.GenerarRutinaRequestDTOBuilder solicitudBuilder = GenerarRutinaRequestDTO.builder()
                .objetivoPrincipal(objetivoMapeado)
                .nivelFitness(perfil.getFitnessLevel())
                .diasEntrenamientoPorSemana(perfil.getTrainingDaysPerWeek())
                .equipamientoDisponible(perfil.getEquipment())
                .genero(generoMapeado)
                .edad(edadCalculada)
                .duracionSesionMinutos(perfil.getSessionDurationMinutes())
                .pesoKg(perfil.getCurrentWeightKg())
                .alturaCm(perfil.getHeightCm())
                .imc(imcCalculado)
                .lesiones(perfil.getInjuries())
                .condicionesMedicas(perfil.getMedicalConditions())
                .semanaActual(mesActual);

        if (ultimoFeedback != null) {
            solicitudBuilder.feedbackPositivo(ultimoFeedback.getPuedeMasPeso());
            solicitudBuilder.ejerciciosDificiles(ultimoFeedback.getEjerciciosDificiles());
        }

        return solicitudBuilder.build();
    }

    private Integer calcularMesActual(Usuario usuario) {
        RutinaEjercicio rutinaAnterior = usuario.getRutinaEjercicio();

        if (rutinaAnterior == null || rutinaAnterior.getMesNumero() == null) {
            return 1;
        }

        return rutinaAnterior.getMesNumero() + 1;
    }

    private FeedbackEjercicio obtenerUltimoFeedback() {
        return feedbackEjercicioRepository.findTopByOrderBySemanaNumeroDesc().orElse(null);
    }

    private Integer calcularEdadDesdeNacimiento(LocalDate fechaNacimiento) {
        if (fechaNacimiento == null) {
            return 25;
        }

        LocalDate hoy = LocalDate.now();
        Period periodo = Period.between(fechaNacimiento, hoy);
        return periodo.getYears();
    }

    private Double calcularIMC(Double pesoKg, Double alturaCm) {
        if (pesoKg == null || alturaCm == null || alturaCm == 0) {
            return null;
        }

        double alturaMetros = alturaCm / 100;
        double imcCalculado = pesoKg / (alturaMetros * alturaMetros);
        double imcRedondeado = Math.round(imcCalculado * 10) / 10.0;

        return imcRedondeado;
    }

    private String mapearObjetivoPrincipal(com.gestioneventos.cofira.enums.PrimaryGoal objetivo) {
        if (objetivo == null) {
            return "Mejorar forma fisica";
        }

        return switch (objetivo) {
            case LOSE_WEIGHT -> "Perder grasa";
            case GAIN_MUSCLE -> "Ganar musculo";
            case MAINTAIN -> "Mantener peso";
            case IMPROVE_HEALTH -> "Mejorar salud general";
        };
    }

    private String mapearGenero(com.gestioneventos.cofira.enums.Gender genero) {
        if (genero == null) {
            return "Masculino";
        }

        return switch (genero) {
            case MALE -> "Masculino";
            case FEMALE -> "Femenino";
            case OTHER -> "Otro";
        };
    }

    private RutinaEjercicio convertirRutinaGeneradaAEntidad(RutinaGeneradaDTO rutinaDTO,
                                                            GenerarRutinaRequestDTO solicitud) {
        LocalDate hoy = LocalDate.now();
        LocalDate fechaFin = hoy.plusDays(DIAS_POR_CICLO_MENSUAL);

        String rutinaJson = serializarRutinaAJson(rutinaDTO);

        List<DiaEjercicio> diasEjercicio = rutinaDTO.getDiasEjercicio().stream()
                .map(this::convertirDiaEjercicioDTO)
                .toList();

        RutinaEjercicio rutinaEntidad = RutinaEjercicio.builder()
                .fechaInicio(hoy)
                .fechaFin(fechaFin)
                .mesNumero(solicitud.getSemanaActual())
                .rutinaJson(rutinaJson)
                .diasEjercicio(diasEjercicio)
                .build();

        return rutinaEntidad;
    }

    private DiaEjercicio convertirDiaEjercicioDTO(com.gestioneventos.cofira.dto.ollama.DiaEjercicioGeneradoDTO diaDTO) {
        DiaSemana diaSemanaEnum = DiaSemana.valueOf(normalizarDiaSemana(diaDTO.getDiaSemana()));

        List<Ejercicios> listaEjercicios = diaDTO.getEjercicios().stream()
                .map(this::convertirEjercicioDTO)
                .toList();

        DiaEjercicio diaEjercicio = new DiaEjercicio();
        diaEjercicio.setDiaSemana(diaSemanaEnum);
        diaEjercicio.setEjercicios(listaEjercicios);

        return diaEjercicio;
    }

    private Ejercicios convertirEjercicioDTO(com.gestioneventos.cofira.dto.ollama.EjercicioGeneradoDTO ejercicioDTO) {
        Ejercicios ejercicio = new Ejercicios();
        ejercicio.setNombreEjercicio(ejercicioDTO.getNombre());
        ejercicio.setSeries(ejercicioDTO.getSeries());

        String repeticionesTexto = ejercicioDTO.getRepeticiones();
        Integer repeticionesConvertidas = convertirRepeticionesAEntero(repeticionesTexto);
        ejercicio.setRepeticiones(repeticionesConvertidas);

        ejercicio.setTiempoDescansoSegundos(ejercicioDTO.getDescansoSegundos());
        ejercicio.setDescripcion(ejercicioDTO.getDescripcion());
        ejercicio.setGrupoMuscular(ejercicioDTO.getGrupoMuscular());
        ejercicio.setPesoSugeridoKg(ejercicioDTO.getPesoSugeridoKg());

        return ejercicio;
    }

    private Integer convertirRepeticionesAEntero(String repeticionesTexto) {
        if (repeticionesTexto == null || repeticionesTexto.isEmpty()) {
            return null;
        }

        String soloNumeros = repeticionesTexto.replaceAll("[^0-9]", " ").trim().split(" ")[0];
        if (soloNumeros.isEmpty()) {
            return null;
        }

        return Integer.parseInt(soloNumeros);
    }

    private String normalizarDiaSemana(String diaSemana) {
        if (diaSemana == null) {
            return "LUNES";
        }

        String diaMayusculas = diaSemana.toUpperCase()
                .replace("Á", "A")
                .replace("É", "E")
                .replace("Í", "I")
                .replace("Ó", "O")
                .replace("Ú", "U");

        return switch (diaMayusculas) {
            case "LUNES" -> "LUNES";
            case "MARTES" -> "MARTES";
            case "MIERCOLES", "MIÉRCOLES" -> "MIERCOLES";
            case "JUEVES" -> "JUEVES";
            case "VIERNES" -> "VIERNES";
            case "SABADO", "SÁBADO" -> "SABADO";
            case "DOMINGO" -> "DOMINGO";
            default -> "LUNES";
        };
    }

    private String serializarRutinaAJson(RutinaGeneradaDTO rutinaDTO) {
        try {
            return objectMapper.writeValueAsString(rutinaDTO);
        } catch (Exception excepcion) {
            logger.error("Error serializando rutina a JSON: {}", excepcion.getMessage());
            return "{}";
        }
    }
}
