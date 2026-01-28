import { Component, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { NotificacionService } from '../../services/notificacion.service';
import { SuscripcionService } from '../../services/suscripcion.service';
import { Button } from '../../components/shared/button/button';

interface Preferencias {
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  recordatoriosEntrenamiento: boolean;
  recordatoriosComidas: boolean;
  idiomaSeleccionado: string;
  unidadesPeso: string;
  unidadesAltura: string;
}

type SeccionConfiguracion = "general" | "notificaciones" | "privacidad" | "suscripcion" | "cuenta";

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [FormsModule, RouterLink, Button],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Configuracion {
  private readonly notificacionService = inject(NotificacionService);
  private readonly suscripcionService = inject(SuscripcionService);
  private readonly router = inject(Router);

  readonly estaCargando = signal(false);
  readonly cargandoSuscripcion = signal(false);
  readonly seccionActiva = signal<SeccionConfiguracion>("general");

  readonly esPro = computed(function(this: Configuracion) {
    return this.suscripcionService.esPro();
  }.bind(this));

  readonly suscripcionActual = computed(function(this: Configuracion) {
    return this.suscripcionService.suscripcionActual();
  }.bind(this));

  readonly diasRestantes = computed(function(this: Configuracion) {
    return this.suscripcionService.obtenerDiasRestantes();
  }.bind(this));

  readonly renovacionAutomatica = computed(function(this: Configuracion) {
    const suscripcion = this.suscripcionActual();
    return suscripcion?.renovacionAutomatica ?? false;
  }.bind(this));

  readonly preferencias = signal<Preferencias>({
    notificacionesEmail: true,
    notificacionesPush: false,
    recordatoriosEntrenamiento: true,
    recordatoriosComidas: true,
    idiomaSeleccionado: "es",
    unidadesPeso: "kg",
    unidadesAltura: "cm",
  });

  readonly idiomas = [
    { codigo: "es", nombre: "Español" },
    { codigo: "en", nombre: "English" },
  ];

  readonly unidadesPesoOpciones = [
    { codigo: "kg", nombre: "Kilogramos (kg)" },
    { codigo: "lb", nombre: "Libras (lb)" },
  ];

  readonly unidadesAlturaOpciones = [
    { codigo: "cm", nombre: "Centímetros (cm)" },
    { codigo: "ft", nombre: "Pies y pulgadas" },
  ];

  cambiarSeccion(seccion: SeccionConfiguracion): void {
    this.seccionActiva.set(seccion);
  }

  guardarPreferencias(): void {
    this.estaCargando.set(true);

    setTimeout(() => {
      this.estaCargando.set(false);
      this.notificacionService.exito("Configuración guardada correctamente");
    }, 800);
  }

  togglePreferencia(clave: keyof Preferencias): void {
    const prefsActuales = this.preferencias();
    const valorActual = prefsActuales[clave];

    if (typeof valorActual === "boolean") {
      this.preferencias.set({
        ...prefsActuales,
        [clave]: !valorActual,
      });
    }
  }

  actualizarPreferencia(clave: keyof Preferencias, valor: string): void {
    const prefsActuales = this.preferencias();
    this.preferencias.set({
      ...prefsActuales,
      [clave]: valor,
    });
  }

  eliminarCuenta(): void {
    this.notificacionService.error("Esta función no está disponible en la demo");
  }

  exportarDatos(): void {
    this.notificacionService.info("Preparando exportación de datos...");
  }

  toggleRenovacionAutomatica(): void {
    this.cargandoSuscripcion.set(true);

    this.suscripcionService.toggleRenovacionAutomatica().subscribe({
      next: function(this: Configuracion) {
        this.cargandoSuscripcion.set(false);
        const nuevoEstado = this.renovacionAutomatica();
        const mensaje = nuevoEstado
          ? "Renovación automática activada"
          : "Renovación automática desactivada";
        this.notificacionService.exito(mensaje);
      }.bind(this),
      error: function(this: Configuracion) {
        this.cargandoSuscripcion.set(false);
        this.notificacionService.error("No se pudo actualizar la configuración");
      }.bind(this)
    });
  }

  cancelarSuscripcion(): void {
    this.cargandoSuscripcion.set(true);

    this.suscripcionService.cancelarSuscripcion().subscribe({
      next: function(this: Configuracion) {
        this.cargandoSuscripcion.set(false);
        this.notificacionService.exito("Suscripción cancelada. Mantendrás acceso hasta que expire.");
      }.bind(this),
      error: function(this: Configuracion) {
        this.cargandoSuscripcion.set(false);
        this.notificacionService.error("No se pudo cancelar la suscripción");
      }.bind(this)
    });
  }

  activarPro(): void {
    this.router.navigate(["/acceso-pro"]);
  }

  formatearFechaSuscripcion(fechaIso: string): string {
    if (!fechaIso) return "No disponible";

    const fecha = new Date(fechaIso);
    const opciones: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    return fecha.toLocaleDateString("es-ES", opciones);
  }
}
