import { Injectable, signal } from '@angular/core';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICIO: NotificacionService
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Servicio para mostrar notificaciones en la aplicación.
 * Reemplaza el uso de alert() nativo por notificaciones más elegantes.
 *
 * USO:
 * ─────────────────────────────────────────────────────────────────────────────
 * // En el constructor del componente:
 * constructor(private notificacion: NotificacionService) {}
 *
 * // Mostrar notificación de éxito:
 * this.notificacion.exito('¡Registro completado!');
 *
 * // Mostrar notificación de error:
 * this.notificacion.error('Error al enviar el formulario');
 *
 * // Mostrar notificación de advertencia:
 * this.notificacion.advertencia('Revisa los campos marcados');
 *
 * // Mostrar notificación informativa:
 * this.notificacion.info('Tu sesión expirará en 5 minutos');
 *
 * TIPOS DE NOTIFICACIÓN:
 * ─────────────────────────────────────────────────────────────────────────────
 * - exito: Verde, para acciones completadas correctamente
 * - error: Rojo, para errores o fallos
 * - advertencia: Amarillo, para avisos importantes
 * - info: Azul, para información general
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

/** Tipos de notificación disponibles */
export type TipoNotificacion = 'exito' | 'error' | 'advertencia' | 'info';

/** Estructura de una notificación */
export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  mensaje: string;
  duracion: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICIO
// ─────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  // ─────────────────────────────────────────────────────────────────────────
  // PROPIEDADES
  // ─────────────────────────────────────────────────────────────────────────

  /** Contador para generar IDs únicos */
  private contadorId = 0;

  /** Lista de notificaciones activas (signal para reactividad) */
  readonly notificaciones = signal<Notificacion[]>([]);

  /** Duración por defecto en milisegundos (5 segundos) */
  private readonly DURACION_DEFECTO = 5000;

  // ─────────────────────────────────────────────────────────────────────────
  // MÉTODOS PÚBLICOS - Atajos por tipo
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Muestra una notificación de éxito (verde)
   * @param mensaje - Texto a mostrar
   * @param duracion - Duración en ms (opcional, default 5000)
   */
  exito(mensaje: string, duracion?: number): void {
    this.mostrar('exito', mensaje, duracion);
  }

  /**
   * Muestra una notificación de error (rojo)
   * @param mensaje - Texto a mostrar
   * @param duracion - Duración en ms (opcional, default 5000)
   */
  error(mensaje: string, duracion?: number): void {
    this.mostrar('error', mensaje, duracion);
  }

  /**
   * Muestra una notificación de advertencia (amarillo)
   * @param mensaje - Texto a mostrar
   * @param duracion - Duración en ms (opcional, default 5000)
   */
  advertencia(mensaje: string, duracion?: number): void {
    this.mostrar('advertencia', mensaje, duracion);
  }

  /**
   * Muestra una notificación informativa (azul)
   * @param mensaje - Texto a mostrar
   * @param duracion - Duración en ms (opcional, default 5000)
   */
  info(mensaje: string, duracion?: number): void {
    this.mostrar('info', mensaje, duracion);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MÉTODOS PÚBLICOS - Gestión
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Cierra una notificación por su ID
   * @param id - ID de la notificación a cerrar
   */
  cerrar(id: number): void {
    this.notificaciones.update(lista =>
      lista.filter(notif => notif.id !== id)
    );
  }

  /**
   * Cierra todas las notificaciones
   */
  cerrarTodas(): void {
    this.notificaciones.set([]);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MÉTODOS PRIVADOS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Método interno para mostrar una notificación
   */
  private mostrar(tipo: TipoNotificacion, mensaje: string, duracion?: number): void {
    const id = ++this.contadorId;
    const tiempoVisible = duracion ?? this.DURACION_DEFECTO;

    const notificacion: Notificacion = {
      id,
      tipo,
      mensaje,
      duracion: tiempoVisible
    };

    // Añadir a la lista
    this.notificaciones.update(lista => [...lista, notificacion]);

    // Auto-cerrar después de la duración (si es > 0)
    if (tiempoVisible > 0) {
      setTimeout(() => this.cerrar(id), tiempoVisible);
    }
  }
}
