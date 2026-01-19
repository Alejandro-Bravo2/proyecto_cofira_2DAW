import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NotificacionService } from '../../services/notificacion.service';
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

  readonly estaCargando = signal(false);
  readonly seccionActiva = signal<'general' | 'notificaciones' | 'privacidad' | 'cuenta'>('general');

  readonly preferencias = signal<Preferencias>({
    notificacionesEmail: true,
    notificacionesPush: false,
    recordatoriosEntrenamiento: true,
    recordatoriosComidas: true,
    idiomaSeleccionado: 'es',
    unidadesPeso: 'kg',
    unidadesAltura: 'cm',
  });

  readonly idiomas = [
    { codigo: 'es', nombre: 'Español' },
    { codigo: 'en', nombre: 'English' },
  ];

  readonly unidadesPesoOpciones = [
    { codigo: 'kg', nombre: 'Kilogramos (kg)' },
    { codigo: 'lb', nombre: 'Libras (lb)' },
  ];

  readonly unidadesAlturaOpciones = [
    { codigo: 'cm', nombre: 'Centímetros (cm)' },
    { codigo: 'ft', nombre: 'Pies y pulgadas' },
  ];

  cambiarSeccion(seccion: 'general' | 'notificaciones' | 'privacidad' | 'cuenta'): void {
    this.seccionActiva.set(seccion);
  }

  guardarPreferencias(): void {
    this.estaCargando.set(true);

    setTimeout(() => {
      this.estaCargando.set(false);
      this.notificacionService.exito('Configuración guardada correctamente');
    }, 800);
  }

  togglePreferencia(clave: keyof Preferencias): void {
    const prefsActuales = this.preferencias();
    const valorActual = prefsActuales[clave];

    if (typeof valorActual === 'boolean') {
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
    this.notificacionService.error('Esta función no está disponible en la demo');
  }

  exportarDatos(): void {
    this.notificacionService.info('Preparando exportación de datos...');
  }
}
