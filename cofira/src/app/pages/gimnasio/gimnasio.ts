import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {Button} from '../../components/shared/button/button';
import {GimnasioService} from '../../services/gimnasio.service';
import {Ejercicio, FeedbackEjercicio} from '../../models/gimnasio.model';

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
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
  ];

  readonly diaActualIndex = signal(0);

  feedback: FeedbackEjercicio = {
    semanaNumero: 1,
    ejerciciosDificiles: '',
    puedeMasPeso: false,
    comentarios: '',
    nivelFatiga: 3
  };

  readonly isLoading = this.gimnasioService.isLoading;
  readonly error = this.gimnasioService.error;
  readonly tieneRutina = this.gimnasioService.tieneRutina;
  readonly estadoIA = this.gimnasioService.estadoIA;
  readonly semanaActual = this.gimnasioService.semanaActual;
  readonly feedbackEnviado = this.gimnasioService.feedbackEnviado;

  readonly ejerciciosDelDia = computed(() => {
    const diaSeleccionado = this.diasSemana[this.diaActualIndex()];
    const ejerciciosPorDia = this.gimnasioService.ejerciciosPorDia();
    return ejerciciosPorDia[diaSeleccionado] ?? [];
  });

  ngOnInit(): void {
    this.establecerDiaActual();
    this.gimnasioService.cargarSemanaDeStorage();

    this.gimnasioService.obtenerSemanaActual().subscribe({
      next: (semana) => {
        this.feedback.semanaNumero = semana;
      }
    });

    this.cargarMiRutina();
  }

  diaAnterior(): void {
    if (this.diaActualIndex() > 0) {
      this.diaActualIndex.update(indice => indice - 1);
    }
  }

  diaSiguiente(): void {
    if (this.diaActualIndex() < this.diasSemana.length - 1) {
      this.diaActualIndex.update(indice => indice + 1);
    }
  }

  toggleEjercicio(ejercicio: Ejercicio): void {
    const diaSeleccionado = this.diasSemana[this.diaActualIndex()];
    this.gimnasioService.toggleExpandirEjercicio(diaSeleccionado, ejercicio.id);
  }

  marcarRealizado(ejercicio: Ejercicio, realizado: boolean): void {
    const diaSeleccionado = this.diasSemana[this.diaActualIndex()];
    const nuevoValor = ejercicio.realizado === realizado ? null : realizado;
    this.gimnasioService.marcarEjercicioRealizado(diaSeleccionado, ejercicio.id, nuevoValor);

    if (nuevoValor === true) {
      this.gimnasioService.guardarProgreso(diaSeleccionado).subscribe({
        next: () => {
          console.log("Progreso guardado correctamente");
        },
        error: (errorCapturado) => {
          console.error("Error al guardar progreso:", errorCapturado);
        }
      });
    }
  }

  actualizarPeso(ejercicio: Ejercicio, evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const pesoNuevo = input.value ? parseFloat(input.value) : undefined;
    const diaSeleccionado = this.diasSemana[this.diaActualIndex()];
    this.gimnasioService.actualizarPesoEjercicio(diaSeleccionado, ejercicio.id, pesoNuevo);
  }

  enviarFeedback(): void {
    this.feedback.semanaNumero = this.semanaActual();

    this.gimnasioService.guardarFeedback(this.feedback).subscribe({
      next: () => {
        console.log("Feedback guardado correctamente");
        this.resetFeedback();
      },
      error: (errorCapturado) => {
        console.error("Error al guardar feedback:", errorCapturado);
      }
    });
  }

  cancelarFeedback(): void {
    this.resetFeedback();
  }

  private establecerDiaActual(): void {
    const hoy = new Date();
    const diaHoy = hoy.getDay();
    const indiceCorregido = diaHoy === 0 ? 6 : diaHoy - 1;
    this.diaActualIndex.set(indiceCorregido);
  }

  private cargarMiRutina(): void {
    this.gimnasioService.obtenerMiRutina().subscribe();
  }

  private resetFeedback(): void {
    this.feedback = {
      semanaNumero: this.semanaActual(),
      ejerciciosDificiles: "",
      puedeMasPeso: false,
      comentarios: "",
      nivelFatiga: 3
    };
  }
}
