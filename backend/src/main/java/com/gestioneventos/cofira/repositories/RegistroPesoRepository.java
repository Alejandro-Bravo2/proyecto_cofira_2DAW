package com.gestioneventos.cofira.repositories;

import com.gestioneventos.cofira.entities.RegistroGrasa;
import com.gestioneventos.cofira.entities.RegistroPeso;
import com.gestioneventos.cofira.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RegistroPesoRepository extends JpaRepository<RegistroPeso, Long> {

    Optional<RegistroPeso> findByUsuarioAndFecha(Usuario usuario, LocalDateTime fecha);

    List<RegistroPeso> findByUsuarioAndFechaBetweenOrderByFechaAsc(
            Usuario usuario,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    );
}
