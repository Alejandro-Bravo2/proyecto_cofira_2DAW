import {Component, computed, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {Button} from '../../components/shared/button/button';
import {GimnasioService} from '../../services/gimnasio.service';
import {Ejercicio} from '../../models/gimnasio.model';

interface Feedback {
  ejerciciosDificiles: string;
  masPeso: string;
}

@Component({
  selector: 'app-gimnasio',
  standalone: true,
  imports: [FormsModule, Button],
  templateUrl: './gimnasio.html',
  styleUrl: './gimnasio.scss',
})
export class Gimnasio implements OnInit {
  private readonly gimnasioService = inject(GimnasioService);

  readonly diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  diaActualIndex = 0;

  feedback: Feedback = {
    ejerciciosDificiles: '',
    masPeso: '',
  };

  readonly isLoading = this.gimnasioService.isLoading;
  readonly error = this.gimnasioService.error;
  readonly tieneRutina = this.gimnasioService.tieneRutina;
  readonly estadoOllama = this.gimnasioService.estadoOllama;

  readonly ejerciciosDelDia = computed(() => {
    const diaSeleccionado = this.diasSemana[this.diaActualIndex];
    return this.gimnasioService.obtenerEjerciciosDelDia(diaSeleccionado);
  });

  ngOnInit(): void {
    this.establecerDiaActual();

    if (!this.tieneRutina()) {
      this.verificarYGenerarRutina();
    }
  }

  diaAnterior(): void {
    if (this.diaActualIndex > 0) {
      this.diaActualIndex--;
    }
  }

  diaSiguiente(): void {
    if (this.diaActualIndex < this.diasSemana.length - 1) {
      this.diaActualIndex++;
    }
  }

  toggleEjercicio(ejercicio: Ejercicio): void {
    const diaSeleccionado = this.diasSemana[this.diaActualIndex];
    this.gimnasioService.toggleExpandirEjercicio(diaSeleccionado, ejercicio.id);
  }

  marcarRealizado(ejercicio: Ejercicio, realizado: boolean): void {
    const diaSeleccionado = this.diasSemana[this.diaActualIndex];
    const nuevoValor = ejercicio.realizado === realizado ? null : realizado;
    this.gimnasioService.marcarEjercicioRealizado(diaSeleccionado, ejercicio.id, nuevoValor);
  }

  generarNuevaRutina(): void {
    this.gimnasioService.generarRutina().subscribe({
      next: () => {
        console.log('Rutina generada correctamente');
      },
      error: (errorCapturado) => {
        console.error('Error al generar rutina:', errorCapturado);
      }
    });
  }

  enviarFeedback(): void {
    console.log('Feedback enviado:', this.feedback);
    this.resetFeedback();
  }

  cancelarFeedback(): void {
    this.resetFeedback();
  }

  private establecerDiaActual(): void {
    const hoy = new Date();
    const diaHoy = hoy.getDay();
    const indiceCorregido = diaHoy === 0 ? 6 : diaHoy - 1;
    this.diaActualIndex = indiceCorregido;
  }

  private verificarYGenerarRutina(): void {
    this.gimnasioService.verificarConexionOllama().subscribe({
      next: (estado) => {
        if (estado.conectado) {
          this.generarNuevaRutina();
        }
      }
    });
  }

  private resetFeedback(): void {
    this.feedback = {
      ejerciciosDificiles: '',
      masPeso: '',
    };
  }
}
