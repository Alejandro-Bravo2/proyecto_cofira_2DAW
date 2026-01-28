package com.gestioneventos.cofira.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestioneventos.cofira.dto.consumo.*;
import com.gestioneventos.cofira.entities.RegistroComidaConsumida;
import com.gestioneventos.cofira.entities.Usuario;
import com.gestioneventos.cofira.exceptions.RecursoNoEncontradoException;
import com.gestioneventos.cofira.repositories.RegistroComidaConsumidaRepository;
import com.gestioneventos.cofira.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsumoComidaService {

    private final RegistroComidaConsumidaRepository registroRepository;
    private final UsuarioRepository usuarioRepository;
    private final ObjectMapper objectMapper;

    public ConsumoComidaService(
            RegistroComidaConsumidaRepository registroRepository,
            UsuarioRepository usuarioRepository,
            ObjectMapper objectMapper
    ) {
        this.registroRepository = registroRepository;
        this.usuarioRepository = usuarioRepository;
        this.objectMapper = objectMapper;
    }

    public List<RegistroComidaDTO> obtenerRegistrosDelDia(String username, LocalDate fecha) {
        Usuario usuario = obtenerUsuarioPorUsername(username);
        List<RegistroComidaConsumida> registros = registroRepository
                .findByUsuarioAndFechaOrderByTipoComida(usuario, fecha);

        return registros.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public RegistroComidaDTO marcarComidaConsumida(String username, MarcarComidaConsumidaDTO dto) {
        Usuario usuario = obtenerUsuarioPorUsername(username);

        RegistroComidaConsumida registro = registroRepository
                .findByUsuarioAndFechaAndTipoComida(usuario, dto.getFecha(), dto.getTipoComida())
                .orElseGet(() -> RegistroComidaConsumida.builder()
                        .usuario(usuario)
                        .fecha(dto.getFecha())
                        .tipoComida(dto.getTipoComida())
                        .build());

        registro.setComidaMenuId(dto.getComidaMenuId());
        registro.setConsumioMenu(dto.getConsumioMenu());
        registro.setCaloriasReales(dto.getCaloriasReales());
        registro.setProteinasReales(dto.getProteinasReales());
        registro.setCarbohidratosReales(dto.getCarbohidratosReales());
        registro.setGrasasReales(dto.getGrasasReales());

        if (dto.getConsumioMenu()) {
            registro.setComidaAlternativa(null);
            registro.setImagenUrl(null);
        }

        RegistroComidaConsumida registroGuardado = registroRepository.save(registro);
        return convertirADTO(registroGuardado);
    }

    @Transactional
    public RegistroComidaDTO registrarComidaAlternativa(String username, ComidaAlternativaDTO dto) {
        Usuario usuario = obtenerUsuarioPorUsername(username);

        RegistroComidaConsumida registro = registroRepository
                .findByUsuarioAndFechaAndTipoComida(usuario, dto.getFecha(), dto.getTipoComida())
                .orElseGet(() -> RegistroComidaConsumida.builder()
                        .usuario(usuario)
                        .fecha(dto.getFecha())
                        .tipoComida(dto.getTipoComida())
                        .build());

        registro.setConsumioMenu(false);

        String comidaAlternativaJson = serializarComidaAlternativa(dto);
        registro.setComidaAlternativa(comidaAlternativaJson);

        registro.setCaloriasReales(dto.getCalorias());
        registro.setProteinasReales(dto.getProteinas());
        registro.setCarbohidratosReales(dto.getCarbohidratos());
        registro.setGrasasReales(dto.getGrasas());

        RegistroComidaConsumida registroGuardado = registroRepository.save(registro);
        return convertirADTO(registroGuardado);
    }

    @Transactional
    public RegistroComidaDTO guardarAnalisisImagen(
            String username,
            LocalDate fecha,
            String tipoComida,
            String imagenUrl,
            AnalisisImagenDTO analisis
    ) {
        Usuario usuario = obtenerUsuarioPorUsername(username);

        RegistroComidaConsumida registro = registroRepository
                .findByUsuarioAndFechaAndTipoComida(usuario, fecha, tipoComida)
                .orElseGet(() -> RegistroComidaConsumida.builder()
                        .usuario(usuario)
                        .fecha(fecha)
                        .tipoComida(tipoComida)
                        .build());

        registro.setConsumioMenu(false);
        registro.setImagenUrl(imagenUrl);

        ComidaAlternativaDTO alternativa = ComidaAlternativaDTO.builder()
                .nombre(analisis.getNombreComida())
                .calorias(analisis.getCaloriasEstimadas())
                .proteinas(analisis.getProteinasGramos())
                .carbohidratos(analisis.getCarbohidratosGramos())
                .grasas(analisis.getGrasasGramos())
                .build();

        String comidaAlternativaJson = serializarComidaAlternativa(alternativa);
        registro.setComidaAlternativa(comidaAlternativaJson);

        registro.setCaloriasReales(analisis.getCaloriasEstimadas());
        registro.setProteinasReales(analisis.getProteinasGramos());
        registro.setCarbohidratosReales(analisis.getCarbohidratosGramos());
        registro.setGrasasReales(analisis.getGrasasGramos());

        RegistroComidaConsumida registroGuardado = registroRepository.save(registro);
        return convertirADTO(registroGuardado);
    }

    @Transactional
    public void desmarcarComida(String username, LocalDate fecha, String tipoComida) {
        Usuario usuario = obtenerUsuarioPorUsername(username);
        registroRepository.deleteByUsuarioAndFechaAndTipoComida(usuario, fecha, tipoComida);
    }

    public ResumenNutricionalRealDTO obtenerResumenRealDelDia(String username, LocalDate fecha) {
        Usuario usuario = obtenerUsuarioPorUsername(username);
        List<RegistroComidaConsumida> registros = registroRepository.findByUsuarioAndFecha(usuario, fecha);

        int caloriasTotal = 0;
        int proteinasTotal = 0;
        int carbohidratosTotal = 0;
        int grasasTotal = 0;

        for (RegistroComidaConsumida registro : registros) {
            if (registro.getCaloriasReales() != null) {
                caloriasTotal += registro.getCaloriasReales();
            }
            if (registro.getProteinasReales() != null) {
                proteinasTotal += registro.getProteinasReales();
            }
            if (registro.getCarbohidratosReales() != null) {
                carbohidratosTotal += registro.getCarbohidratosReales();
            }
            if (registro.getGrasasReales() != null) {
                grasasTotal += registro.getGrasasReales();
            }
        }

        return ResumenNutricionalRealDTO.builder()
                .caloriasConsumidas(caloriasTotal)
                .proteinasConsumidas(proteinasTotal)
                .carbohidratosConsumidos(carbohidratosTotal)
                .grasasConsumidas(grasasTotal)
                .comidasRegistradas(registros.size())
                .totalComidas(5)
                .build();
    }

    public ResumenNutricionalRealDTO obtenerResumenSemanal(String username) {
        Usuario usuario = obtenerUsuarioPorUsername(username);
        LocalDate hoy = LocalDate.now();
        LocalDate haceUnaSemana = hoy.minusDays(6);

        List<RegistroComidaConsumida> registros = registroRepository
                .findByUsuarioAndFechaBetween(usuario, haceUnaSemana, hoy);

        int caloriasTotal = 0;
        int proteinasTotal = 0;
        int carbohidratosTotal = 0;
        int grasasTotal = 0;

        for (RegistroComidaConsumida registro : registros) {
            if (registro.getCaloriasReales() != null) {
                caloriasTotal += registro.getCaloriasReales();
            }
            if (registro.getProteinasReales() != null) {
                proteinasTotal += registro.getProteinasReales();
            }
            if (registro.getCarbohidratosReales() != null) {
                carbohidratosTotal += registro.getCarbohidratosReales();
            }
            if (registro.getGrasasReales() != null) {
                grasasTotal += registro.getGrasasReales();
            }
        }

        int totalComidasSemana = 5 * 7;

        return ResumenNutricionalRealDTO.builder()
                .caloriasConsumidas(caloriasTotal)
                .proteinasConsumidas(proteinasTotal)
                .carbohidratosConsumidos(carbohidratosTotal)
                .grasasConsumidas(grasasTotal)
                .comidasRegistradas(registros.size())
                .totalComidas(totalComidasSemana)
                .build();
    }

    private Usuario obtenerUsuarioPorUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado: " + username));
    }

    private RegistroComidaDTO convertirADTO(RegistroComidaConsumida registro) {
        ComidaAlternativaDTO comidaAlternativaDTO = null;
        if (registro.getComidaAlternativa() != null) {
            comidaAlternativaDTO = deserializarComidaAlternativa(registro.getComidaAlternativa());
        }

        return RegistroComidaDTO.builder()
                .id(registro.getId())
                .fecha(registro.getFecha())
                .tipoComida(registro.getTipoComida())
                .comidaMenuId(registro.getComidaMenuId())
                .consumioMenu(registro.getConsumioMenu())
                .comidaAlternativa(comidaAlternativaDTO)
                .imagenUrl(registro.getImagenUrl())
                .caloriasReales(registro.getCaloriasReales())
                .proteinasReales(registro.getProteinasReales())
                .carbohidratosReales(registro.getCarbohidratosReales())
                .grasasReales(registro.getGrasasReales())
                .creadoEn(registro.getCreadoEn())
                .build();
    }

    private String serializarComidaAlternativa(ComidaAlternativaDTO dto) {
        try {
            return objectMapper.writeValueAsString(dto);
        } catch (JsonProcessingException excepcion) {
            throw new RuntimeException("Error al serializar comida alternativa", excepcion);
        }
    }

    private ComidaAlternativaDTO deserializarComidaAlternativa(String json) {
        try {
            return objectMapper.readValue(json, ComidaAlternativaDTO.class);
        } catch (JsonProcessingException excepcion) {
            return null;
        }
    }
}
