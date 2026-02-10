package com.gestioneventos.cofira.services;


import com.gestioneventos.cofira.dto.grasa.ActualizarGrasaDTO;
import com.gestioneventos.cofira.dto.grasa.RegistroGrasaDTO;
import com.gestioneventos.cofira.dto.peso.ActualizarPesoDTO;
import com.gestioneventos.cofira.dto.peso.RegistroPesoDTO;
import com.gestioneventos.cofira.entities.RegistroGrasa;
import com.gestioneventos.cofira.entities.RegistroPeso;
import com.gestioneventos.cofira.entities.Usuario;
import com.gestioneventos.cofira.repositories.RegistroGrasaRepository;
import com.gestioneventos.cofira.repositories.RegistroPesoRepository;
import com.gestioneventos.cofira.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistroPesoService {

    private final RegistroPesoRepository registroPesoRepository;
    private final UsuarioRepository usuarioRepository;

    public RegistroPesoService(RegistroPesoRepository registroPesoRepository,
                               UsuarioRepository usuarioRepository) {
        this.registroPesoRepository = registroPesoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public RegistroPesoDTO obtenerPesoDelDia(String email, LocalDateTime fecha) {
        Usuario usuario = obtenerUsuarioPorEmail(email);

        return registroPesoRepository.findByUsuarioAndFecha(usuario, fecha)
                .map(this::convertirADTO)
                .orElse(null);
    }

    @Transactional
    public RegistroPesoDTO registrarPeso(String email, ActualizarPesoDTO dto) {
        Usuario usuario = obtenerUsuarioPorEmail(email);

        RegistroPeso registro = RegistroPeso.builder()
                .usuario(usuario)
                .fecha(LocalDateTime.now())
                .build();

        registro.setKilos(dto.getKilos());
        RegistroPeso registroGuardado = registroPesoRepository.save(registro);

        return convertirADTO(registroGuardado);
    }

    public List<RegistroPesoDTO> obtenerHistorial(String email, LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        Usuario usuario = obtenerUsuarioPorEmail(email);

        return registroPesoRepository
                .findByUsuarioAndFechaBetweenOrderByFechaAsc(usuario, fechaInicio, fechaFin)
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    private Usuario obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));
    }

    private RegistroPesoDTO convertirADTO(RegistroPeso registro) {
        return RegistroPesoDTO.builder()
                .id(registro.getId())
                .fecha(registro.getFecha())
                .kilos(registro.getKilos())
                .build();
    }
}
