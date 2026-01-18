import { Injectable, signal } from '@angular/core';

export type TipoNotificacion = 'exito' | 'error' | 'advertencia' | 'info';

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  mensaje: string;
  duracion: number;
}

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private contadorId = 0;

  readonly notificaciones = signal<Notificacion[]>([]);

  private readonly DURACION_DEFECTO = 5000;

  exito(mensaje: string, duracion?: number): void {
    this.mostrar('exito', mensaje, duracion);
  }

  error(mensaje: string, duracion?: number): void {
    this.mostrar('error', mensaje, duracion);
  }

  advertencia(mensaje: string, duracion?: number): void {
    this.mostrar('advertencia', mensaje, duracion);
  }

  info(mensaje: string, duracion?: number): void {
    this.mostrar('info', mensaje, duracion);
  }

  cerrar(id: number): void {
    this.notificaciones.update(lista =>
      lista.filter(notif => notif.id !== id)
    );
  }

  cerrarTodas(): void {
    this.notificaciones.set([]);
  }

  private mostrar(tipo: TipoNotificacion, mensaje: string, duracion?: number): void {
    const id = ++this.contadorId;
    const tiempoVisible = duracion ?? this.DURACION_DEFECTO;

    const notificacion: Notificacion = {
      id,
      tipo,
      mensaje,
      duracion: tiempoVisible
    };

    this.notificaciones.update(lista => [...lista, notificacion]);

    if (tiempoVisible > 0) {
      setTimeout(() => this.cerrar(id), tiempoVisible);
    }
  }
}
