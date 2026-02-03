package com.gestioneventos.cofira.scheduled;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.gestioneventos.cofira.entities.RutinaEjercicio;
import com.gestioneventos.cofira.entities.Usuario;
import com.gestioneventos.cofira.repositories.UsuarioRepository;
import com.gestioneventos.cofira.services.RutinaEjercicioService;

@Component
public class ScheduledTasks {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);

    private final UsuarioRepository usuarioRepository;
    private final RutinaEjercicioService rutinaEjercicioService;

    public ScheduledTasks(UsuarioRepository usuarioRepository,
                          RutinaEjercicioService rutinaEjercicioService) {
        this.usuarioRepository = usuarioRepository;
        this.rutinaEjercicioService = rutinaEjercicioService;
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
                    rutinaEjercicioService.generarYPersistirRutinaParaUsuario(usuario.getId());
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
}
