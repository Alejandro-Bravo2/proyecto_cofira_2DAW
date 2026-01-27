package com.gestioneventos.cofira.services;

import com.gestioneventos.cofira.dto.ejercicios.EjerciciosDTO;
import com.gestioneventos.cofira.dto.gimnasio.EjercicioProgresoDTO;
import com.gestioneventos.cofira.dto.gimnasio.FeedbackEjercicioDTO;
import com.gestioneventos.cofira.dto.gimnasio.GuardarProgresoRequestDTO;
import com.gestioneventos.cofira.dto.gimnasio.HistorialEntrenamientoDTO;
import com.gestioneventos.cofira.dto.rutinaejercicio.*;
import com.gestioneventos.cofira.entities.DiaEjercicio;
import com.gestioneventos.cofira.entities.Ejercicios;
import com.gestioneventos.cofira.entities.FeedbackEjercicio;
import com.gestioneventos.cofira.entities.HistorialEntrenamiento;
import com.gestioneventos.cofira.entities.RutinaEjercicio;
import com.gestioneventos.cofira.enums.DiaSemana;
import com.gestioneventos.cofira.exceptions.RecursoNoEncontradoException;
import com.gestioneventos.cofira.repositories.EjerciciosRepository;
import com.gestioneventos.cofira.repositories.FeedbackEjercicioRepository;
import com.gestioneventos.cofira.repositories.HistorialEntrenamientoRepository;
import com.gestioneventos.cofira.repositories.RutinaEjercicioRepository;
import com.gestioneventos.cofira.repositories.UsuarioRepository;
import com.gestioneventos.cofira.entities.Usuario;
import com.gestioneventos.cofira.dto.ollama.RutinaGeneradaDTO;
import com.gestioneventos.cofira.dto.ollama.DiaEjercicioGeneradoDTO;
import com.gestioneventos.cofira.dto.ollama.EjercicioGeneradoDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RutinaEjercicioService {
    private static final String RUTINA_NO_ENCONTRADA = "Rutina de ejercicio no encontrada con id ";
    private static final String EJERCICIO_NO_ENCONTRADO = "Ejercicio no encontrado con id ";

    private final RutinaEjercicioRepository rutinaEjercicioRepository;
    private final EjerciciosRepository ejerciciosRepository;
    private final FeedbackEjercicioRepository feedbackEjercicioRepository;
    private final HistorialEntrenamientoRepository historialEntrenamientoRepository;
    private final UsuarioRepository usuarioRepository;

    public RutinaEjercicioService(RutinaEjercicioRepository rutinaEjercicioRepository,
                                  EjerciciosRepository ejerciciosRepository,
                                  FeedbackEjercicioRepository feedbackEjercicioRepository,
                                  HistorialEntrenamientoRepository historialEntrenamientoRepository,
                                  UsuarioRepository usuarioRepository) {
        this.rutinaEjercicioRepository = rutinaEjercicioRepository;
        this.ejerciciosRepository = ejerciciosRepository;
        this.feedbackEjercicioRepository = feedbackEjercicioRepository;
        this.historialEntrenamientoRepository = historialEntrenamientoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<RutinaEjercicioDTO> listarRutinas() {
        List<RutinaEjercicio> listaRutinas = rutinaEjercicioRepository.findAll();
        java.util.stream.Stream<RutinaEjercicioDTO> streamMapeado = listaRutinas.stream().map(this::convertirADTO);
        return streamMapeado.collect(Collectors.toList());
    }

    public RutinaEjercicioDTO obtenerRutina(Long id) {
        RutinaEjercicio rutina = rutinaEjercicioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(RUTINA_NO_ENCONTRADA + id));
        return convertirADTO(rutina);
    }

    @Transactional
    public RutinaEjercicioDTO crearRutina(CrearRutinaEjercicioDTO dto) {
        RutinaEjercicio rutina = new RutinaEjercicio();
        rutina.setFechaInicio(dto.getFechaInicio());

        List<CrearDiaEjercicioDTO> listaDiasDTO = dto.getDiasEjercicio();
        java.util.stream.Stream<DiaEjercicio> streamDiasMapeados = listaDiasDTO.stream().map(this::convertirDiaEjercicioDTOAEntidad);
        List<DiaEjercicio> dias = streamDiasMapeados.collect(Collectors.toList());

        rutina.setDiasEjercicio(dias);

        RutinaEjercicio guardada = rutinaEjercicioRepository.save(rutina);
        return convertirADTO(guardada);
    }

    @Transactional
    public void eliminarRutina(Long id) {
        RutinaEjercicio rutina = rutinaEjercicioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(RUTINA_NO_ENCONTRADA + id));
        rutinaEjercicioRepository.delete(rutina);
    }

    public RutinaEjercicioDTO convertirADTO(RutinaEjercicio rutina) {
        RutinaEjercicioDTO dto = new RutinaEjercicioDTO();
        dto.setId(rutina.getId());
        dto.setFechaInicio(rutina.getFechaInicio());

        if (rutina.getDiasEjercicio() != null) {
            List<DiaEjercicio> listaDias = rutina.getDiasEjercicio();
            java.util.stream.Stream<DiaEjercicioDTO> streamDiasMapeados = listaDias.stream().map(this::convertirDiaEjercicioADTO);
            List<DiaEjercicioDTO> diasDTO = streamDiasMapeados.collect(Collectors.toList());
            dto.setDiasEjercicio(diasDTO);
        }

        return dto;
    }

    private DiaEjercicioDTO convertirDiaEjercicioADTO(DiaEjercicio dia) {
        DiaEjercicioDTO dto = new DiaEjercicioDTO();
        dto.setId(dia.getId());
        dto.setDiaSemana(dia.getDiaSemana().name());

        if (dia.getEjercicios() != null) {
            List<Ejercicios> listaEjercicios = dia.getEjercicios();
            java.util.stream.Stream<EjerciciosDTO> streamEjerciciosMapeados = listaEjercicios.stream().map(this::convertirEjercicioADTO);
            List<EjerciciosDTO> ejerciciosDTO = streamEjerciciosMapeados.collect(Collectors.toList());
            dto.setEjercicios(ejerciciosDTO);
        }

        return dto;
    }

    private EjerciciosDTO convertirEjercicioADTO(Ejercicios ejercicio) {
        EjerciciosDTO dto = new EjerciciosDTO();
        dto.setId(ejercicio.getId());
        dto.setNombreEjercicio(ejercicio.getNombreEjercicio());
        dto.setSeries(ejercicio.getSeries());
        dto.setRepeticiones(ejercicio.getRepeticiones());
        dto.setTiempoDescansoSegundos(ejercicio.getTiempoDescansoSegundos());
        dto.setDescripcion(ejercicio.getDescripcion());
        dto.setGrupoMuscular(ejercicio.getGrupoMuscular());
        return dto;
    }

    private DiaEjercicio convertirDiaEjercicioDTOAEntidad(CrearDiaEjercicioDTO dto) {
        DiaEjercicio dia = new DiaEjercicio();
        dia.setDiaSemana(DiaSemana.valueOf(dto.getDiaSemana().toUpperCase()));

        if (dto.getEjerciciosIds() != null && !dto.getEjerciciosIds().isEmpty()) {
            List<Long> listaIds = dto.getEjerciciosIds();
            java.util.stream.Stream<Ejercicios> streamEjerciciosBuscados = listaIds.stream().map(id -> ejerciciosRepository.findById(id)
                    .orElseThrow(() -> new RecursoNoEncontradoException(EJERCICIO_NO_ENCONTRADO + id)));
            List<Ejercicios> ejercicios = streamEjerciciosBuscados.collect(Collectors.toList());
            dia.setEjercicios(ejercicios);
        }

        return dia;
    }

    @Transactional
    public FeedbackEjercicioDTO guardarFeedback(FeedbackEjercicioDTO feedbackDTO) {
        LocalDate fechaFeedback = feedbackDTO.getFechaFeedback();
        if (fechaFeedback == null) {
            fechaFeedback = LocalDate.now();
        }

        FeedbackEjercicio feedbackEntidad = FeedbackEjercicio.builder()
                .fechaFeedback(fechaFeedback)
                .semanaNumero(feedbackDTO.getSemanaNumero())
                .ejerciciosDificiles(feedbackDTO.getEjerciciosDificiles())
                .puedeMasPeso(feedbackDTO.getPuedeMasPeso())
                .comentarios(feedbackDTO.getComentarios())
                .nivelFatiga(feedbackDTO.getNivelFatiga())
                .build();

        FeedbackEjercicio feedbackGuardado = feedbackEjercicioRepository.save(feedbackEntidad);
        FeedbackEjercicioDTO feedbackGuardadoDTO = mapearFeedbackADTO(feedbackGuardado);

        return feedbackGuardadoDTO;
    }

    public Optional<FeedbackEjercicioDTO> obtenerUltimoFeedback() {
        Optional<FeedbackEjercicio> ultimoFeedback = feedbackEjercicioRepository.findTopByOrderBySemanaNumeroDesc();

        if (ultimoFeedback.isPresent()) {
            FeedbackEjercicioDTO feedbackDTO = mapearFeedbackADTO(ultimoFeedback.get());
            return Optional.of(feedbackDTO);
        }

        return Optional.empty();
    }

    public Optional<FeedbackEjercicioDTO> obtenerFeedbackPorSemana(Integer semanaNumero) {
        Optional<FeedbackEjercicio> feedbackSemana = feedbackEjercicioRepository.findBySemanaNumero(semanaNumero);

        if (feedbackSemana.isPresent()) {
            FeedbackEjercicioDTO feedbackDTO = mapearFeedbackADTO(feedbackSemana.get());
            return Optional.of(feedbackDTO);
        }

        return Optional.empty();
    }

    @Transactional
    public List<HistorialEntrenamientoDTO> guardarProgreso(GuardarProgresoRequestDTO progresoDTO) {
        Integer semanaActual = calcularSemanaActual();
        LocalDate fechaHoy = LocalDate.now();

        List<EjercicioProgresoDTO> listaEjerciciosProgreso = progresoDTO.getEjercicios();
        java.util.stream.Stream<HistorialEntrenamiento> streamHistorialesMapeados = listaEjerciciosProgreso.stream().map(ejercicioProgreso -> {
            HistorialEntrenamiento historial = HistorialEntrenamiento.builder()
                    .fechaEntrenamiento(fechaHoy)
                    .diaSemana(progresoDTO.getDiaSemana())
                    .nombreEjercicio(ejercicioProgreso.getNombreEjercicio())
                    .grupoMuscular(ejercicioProgreso.getGrupoMuscular())
                    .seriesCompletadas(ejercicioProgreso.getSeriesCompletadas())
                    .seriesObjetivo(ejercicioProgreso.getSeriesObjetivo())
                    .repeticiones(ejercicioProgreso.getRepeticiones())
                    .completado(ejercicioProgreso.getCompletado())
                    .pesoKg(ejercicioProgreso.getPesoKg())
                    .semanaNumero(semanaActual)
                    .build();
            return historial;
        });
        List<HistorialEntrenamiento> historialesAGuardar = streamHistorialesMapeados.collect(Collectors.toList());

        List<HistorialEntrenamiento> historialesGuardados = historialEntrenamientoRepository.saveAll(historialesAGuardar);

        java.util.stream.Stream<HistorialEntrenamientoDTO> streamHistorialesDTOMapeados = historialesGuardados.stream().map(this::mapearHistorialADTO);
        List<HistorialEntrenamientoDTO> historialesDTO = streamHistorialesDTOMapeados.collect(Collectors.toList());

        return historialesDTO;
    }

    public List<HistorialEntrenamientoDTO> obtenerProgresoPorSemana(Integer semanaNumero) {
        List<HistorialEntrenamiento> historialesSemana = historialEntrenamientoRepository.findBySemanaNumero(semanaNumero);

        java.util.stream.Stream<HistorialEntrenamientoDTO> streamHistorialesMapeados = historialesSemana.stream().map(this::mapearHistorialADTO);
        List<HistorialEntrenamientoDTO> historialesDTO = streamHistorialesMapeados.collect(Collectors.toList());

        return historialesDTO;
    }

    public Map<String, Object> calcularEstadisticas() {
        Integer semanaActual = calcularSemanaActual();
        Long totalEjerciciosCompletados = historialEntrenamientoRepository.countCompletadosBySemana(semanaActual);

        Map<String, Object> estadisticas = new HashMap<>();
        estadisticas.put("semanaActual", semanaActual);
        estadisticas.put("ejerciciosCompletadosEstaSemana", totalEjerciciosCompletados);

        return estadisticas;
    }

    public Integer calcularSemanaActual() {
        Optional<FeedbackEjercicio> ultimoFeedback = feedbackEjercicioRepository.findTopByOrderBySemanaNumeroDesc();

        if (ultimoFeedback.isPresent()) {
            Integer semanaSiguiente = ultimoFeedback.get().getSemanaNumero() + 1;
            return semanaSiguiente;
        }

        return 1;
    }

    private FeedbackEjercicioDTO mapearFeedbackADTO(FeedbackEjercicio feedback) {
        FeedbackEjercicioDTO feedbackDTO = FeedbackEjercicioDTO.builder()
                .id(feedback.getId())
                .fechaFeedback(feedback.getFechaFeedback())
                .semanaNumero(feedback.getSemanaNumero())
                .ejerciciosDificiles(feedback.getEjerciciosDificiles())
                .puedeMasPeso(feedback.getPuedeMasPeso())
                .comentarios(feedback.getComentarios())
                .nivelFatiga(feedback.getNivelFatiga())
                .build();

        return feedbackDTO;
    }

    private HistorialEntrenamientoDTO mapearHistorialADTO(HistorialEntrenamiento historial) {
        HistorialEntrenamientoDTO historialDTO = HistorialEntrenamientoDTO.builder()
                .id(historial.getId())
                .fechaEntrenamiento(historial.getFechaEntrenamiento())
                .diaSemana(historial.getDiaSemana())
                .nombreEjercicio(historial.getNombreEjercicio())
                .grupoMuscular(historial.getGrupoMuscular())
                .seriesCompletadas(historial.getSeriesCompletadas())
                .seriesObjetivo(historial.getSeriesObjetivo())
                .repeticiones(historial.getRepeticiones())
                .completado(historial.getCompletado())
                .pesoKg(historial.getPesoKg())
                .semanaNumero(historial.getSemanaNumero())
                .build();

        return historialDTO;
    }

    public List<String> obtenerEjerciciosUnicos() {
        return historialEntrenamientoRepository.findDistinctNombreEjercicio();
    }

    public List<HistorialEntrenamientoDTO> obtenerProgresoPorEjercicio(String nombreEjercicio) {
        List<HistorialEntrenamiento> historiales = historialEntrenamientoRepository
                .findByNombreEjercicioConPesoOrdenadoPorFecha(nombreEjercicio);

        java.util.stream.Stream<HistorialEntrenamientoDTO> streamHistorialesProgresoMapeados = historiales.stream().map(this::mapearHistorialADTO);
        return streamHistorialesProgresoMapeados.collect(Collectors.toList());
    }

    public Optional<RutinaGeneradaDTO> obtenerMiRutina(Long usuarioId) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(usuarioId);

        if (usuarioOptional.isEmpty()) {
            return Optional.empty();
        }

        Usuario usuario = usuarioOptional.get();
        RutinaEjercicio rutinaActual = usuario.getRutinaEjercicio();

        if (rutinaActual == null) {
            return Optional.empty();
        }

        LocalDate hoy = LocalDate.now();
        LocalDate fechaFinRutina = rutinaActual.getFechaFin();

        boolean rutinaExpirada = fechaFinRutina != null && hoy.isAfter(fechaFinRutina);
        if (rutinaExpirada) {
            return Optional.empty();
        }

        RutinaGeneradaDTO rutinaDTO = convertirRutinaEntidadARutinaGeneradaDTO(rutinaActual);
        return Optional.of(rutinaDTO);
    }

    private RutinaGeneradaDTO convertirRutinaEntidadARutinaGeneradaDTO(RutinaEjercicio rutina) {
        List<DiaEjercicio> diasEntidad = rutina.getDiasEjercicio();

        List<DiaEjercicioGeneradoDTO> diasDTO = diasEntidad.stream()
                .map(this::convertirDiaEntidadADiaGeneradoDTO)
                .collect(Collectors.toList());

        RutinaGeneradaDTO rutinaDTO = RutinaGeneradaDTO.builder()
                .diasEjercicio(diasDTO)
                .build();

        return rutinaDTO;
    }

    private DiaEjercicioGeneradoDTO convertirDiaEntidadADiaGeneradoDTO(DiaEjercicio diaEntidad) {
        List<Ejercicios> ejerciciosEntidad = diaEntidad.getEjercicios();

        List<EjercicioGeneradoDTO> ejerciciosDTO = ejerciciosEntidad.stream()
                .map(this::convertirEjercicioEntidadAEjercicioGeneradoDTO)
                .collect(Collectors.toList());

        DiaEjercicioGeneradoDTO diaDTO = DiaEjercicioGeneradoDTO.builder()
                .diaSemana(diaEntidad.getDiaSemana().name())
                .ejercicios(ejerciciosDTO)
                .build();

        return diaDTO;
    }

    private EjercicioGeneradoDTO convertirEjercicioEntidadAEjercicioGeneradoDTO(Ejercicios ejercicioEntidad) {
        Integer repeticionesEntidad = ejercicioEntidad.getRepeticiones();
        String repeticionesComoTexto = repeticionesEntidad != null ? repeticionesEntidad.toString() : null;

        EjercicioGeneradoDTO ejercicioDTO = EjercicioGeneradoDTO.builder()
                .nombre(ejercicioEntidad.getNombreEjercicio())
                .series(ejercicioEntidad.getSeries())
                .repeticiones(repeticionesComoTexto)
                .descansoSegundos(ejercicioEntidad.getTiempoDescansoSegundos())
                .descripcion(ejercicioEntidad.getDescripcion())
                .grupoMuscular(ejercicioEntidad.getGrupoMuscular())
                .build();

        return ejercicioDTO;
    }
}
