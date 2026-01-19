import {Component, inject} from '@angular/core';

import {NotificacionService} from '../../../services/notificacion.service';
import {Notification} from '../notification/notification';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [Notification],
  templateUrl: './notification-container.html',
  styleUrl: './notification-container.scss'
})
export class NotificationContainer {
  private readonly notificacionService = inject(NotificacionService);

  readonly notificaciones = this.notificacionService.notificaciones;

  obtenerTipoNotificacion(tipo: string): 'success' | 'error' | 'warning' | 'info' {
    const mapasTipos: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
      'exito': 'success',
      'error': 'error',
      'advertencia': 'warning',
      'info': 'info'
    };
    return mapasTipos[tipo] || 'info';
  }

  cerrarNotificacion(id: number): void {
    this.notificacionService.cerrar(id);
  }
}
