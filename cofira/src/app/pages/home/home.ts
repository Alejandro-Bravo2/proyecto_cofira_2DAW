import {Component, ViewEncapsulation} from '@angular/core';
import {Card} from '../../components/shared/card/card';
import {Button} from '../../components/shared/button/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Card,
    Button
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Home {
  notificaciones: Array<{
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }> = [];
  notifId = 0;

  estadoFaqAbierto: Record<number, boolean> = {};

  alternarEstadoFaq(indiceFaq: number): void {
    this.estadoFaqAbierto[indiceFaq] = !this.estadoFaqAbierto[indiceFaq];
  }

  navegarAPlanes(): void {
    const seccionPlanes = document.getElementById('seccion-planes');

    if (seccionPlanes) {
      seccionPlanes.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  mostrarNotif() {
    const id = ++this.notifId;
    this.notificaciones.push({
      id,
      type: 'success',
      message: '¡Guardado correctamente!',
    });
  }

  eliminarNotificacion(id: number) {
    this.notificaciones = this.notificaciones.filter((n) => n.id !== id);
  }
}
