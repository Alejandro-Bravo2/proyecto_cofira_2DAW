package com.gestioneventos.cofira.services;

import com.gestioneventos.cofira.dto.agua.ActualizarAguaDTO;
import com.gestioneventos.cofira.dto.agua.ConsumoAguaDTO;
import com.gestioneventos.cofira.entities.ConsumoAgua;
import com.gestioneventos.cofira.entities.Usuario;
import com.gestioneventos.cofira.repositories.ConsumoAguaRepository;
import com.gestioneventos.cofira.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ConsumoAguaService {

    private final ConsumoAguaRepository consumoAguaRepository;
    private final UsuarioRepository usuarioRepository;

    public ConsumoAguaService(ConsumoAguaRepository consumoAguaRepository,
                               UsuarioRepository usuarioRepository) {
        this.consumoAguaRepository = consumoAguaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public ConsumoAguaDTO obtenerConsumoDelDia(String email, LocalDate fecha) {
        Usuario usuario = obtenerUsuarioPorEmail(email);

        return consumoAguaRepository.findByUsuarioAndFecha(usuario, fecha)
            .map(this::convertirADTO)
            .orElse(ConsumoAguaDTO.builder()
                .fecha(fecha)
                .litros(0.0)
                .build());
    }

    @Transactional
    public ConsumoAguaDTO actualizarConsumo(String email, ActualizarAguaDTO dto) {
        Usuario usuario = obtenerUsuarioPorEmail(email);

        ConsumoAgua consumo = consumoAguaRepository
            .findByUsuarioAndFecha(usuario, dto.getFecha())
            .orElse(ConsumoAgua.builder()
                .usuario(usuario)
                .fecha(dto.getFecha())
                .litros(0.0)
                .build());

        consumo.setLitros(dto.getLitros());
        ConsumoAgua guardado = consumoAguaRepository.save(consumo);

        return convertirADTO(guardado);
    }

    public List<ConsumoAguaDTO> obtenerHistorial(String email, LocalDate fechaInicio, LocalDate fechaFin) {
        Usuario usuario = obtenerUsuarioPorEmail(email);

        return consumoAguaRepository
            .findByUsuarioAndFechaBetweenOrderByFechaAsc(usuario, fechaInicio, fechaFin)
            .stream()
            .map(this::convertirADTO)
            .toList();
    }

    private Usuario obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));
    }

    private ConsumoAguaDTO convertirADTO(ConsumoAgua consumo) {
        return ConsumoAguaDTO.builder()
            .id(consumo.getId())
            .fecha(consumo.getFecha())
            .litros(consumo.getLitros())
            .build();
    }
}
