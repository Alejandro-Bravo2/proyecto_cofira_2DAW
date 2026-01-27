import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';

import {Calendario} from '../../components/shared/calendario/calendario';
import {Ingredientes} from '../../components/shared/ingredientes/ingredientes';
import {AlimentacionService} from '../../services/alimentacion.service';
import {NotificacionService} from '../../services/notificacion.service';
import {Alimento, Comida} from '../../models/alimentacion.model';

@Component({
  selector: 'app-alimentacion',
  standalone: true,
  imports: [Calendario, Ingredientes],
  templateUrl: './alimentacion.html',
  styleUrl: './alimentacion.scss',
})
export class Alimentacion implements OnInit {
  private readonly alimentacionService = inject(AlimentacionService);
  private readonly notificacionService = inject(NotificacionService);

  readonly fechaActualDate = signal(new Date());

  constructor() {
    effect(() => {
      const mensajeError = this.alimentacionService.error();
      if (mensajeError) {
        this.notificacionService.error(mensajeError, 5000);
        this.alimentacionService.error.set(null);
      }
    }, { allowSignalWrites: true });
  }
  calendarioAbierto = false;
  ingredientesAbierto = false;
  alimentoSeleccionado: Alimento | null = null;
  comidaSeleccionada: Comida | null = null;

  readonly diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  readonly isLoading = this.alimentacionService.isLoading;
  readonly error = this.alimentacionService.error;
  readonly tieneMenu = this.alimentacionService.tieneMenu;
  readonly estadoIA = this.alimentacionService.estadoIA;
  readonly menuGenerado = this.alimentacionService.menuGenerado;
  readonly progresoGeneracion = this.alimentacionService.progresoGeneracion;
  readonly estaGenerando = this.alimentacionService.estaGenerando;

  readonly comidasDelDia = computed(() => {
    return this.alimentacionService.obtenerComidasDelDia(this.fechaActualDate());
  });

  readonly resumenNutricional = computed(() => {
    return this.alimentacionService.obtenerResumenDelDia(this.fechaActualDate());
  });

  readonly tieneMenuParaFecha = computed(() => {
    const fechaActual = this.fechaActualDate();
    const fechaInicio = this.alimentacionService.fechaInicio();
    const fechaFin = this.alimentacionService.fechaFin();

    if (!fechaInicio || !fechaFin) {
      return false;
    }

    const fechaActualSinHora = new Date(fechaActual);
    fechaActualSinHora.setHours(0, 0, 0, 0);

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    return fechaActualSinHora >= inicio && fechaActualSinHora <= fin;
  });

  readonly fechaActual = computed(() => {
    const fecha = this.fechaActualDate();
    const diaSemana = this.diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    return `${diaSemana} ${dia}`;
  });

  ngOnInit(): void {
    if (!this.tieneMenu()) {
      this.generarMenuSemanalAutomatico();
    } else {
      this.alimentacionService.verificarYRegenerarSiNecesario();
    }
  }

  diaAnterior(): void {
    this.fechaActualDate.update(fecha =>
      new Date(fecha.getTime() - 24 * 60 * 60 * 1000)
    );
  }

  diaSiguiente(): void {
    this.fechaActualDate.update(fecha =>
      new Date(fecha.getTime() + 24 * 60 * 60 * 1000)
    );
  }

  abrirCalendario(): void {
    this.calendarioAbierto = true;
  }

  cerrarCalendario(): void {
    this.calendarioAbierto = false;
  }

  seleccionarFechaCalendario(fecha: Date): void {
    this.fechaActualDate.set(fecha);
    this.cerrarCalendario();
  }

  verIngredientes(alimento: Alimento, comida: Comida): void {
    this.alimentoSeleccionado = alimento;
    this.comidaSeleccionada = comida;
    this.ingredientesAbierto = true;
  }

  cerrarIngredientes(): void {
    this.ingredientesAbierto = false;
    this.alimentoSeleccionado = null;
    this.comidaSeleccionada = null;
  }

  regenerarMenu(): void {
    this.alimentacionService.generarMenuSemanalConStreaming();
  }

  cancelarGeneracion(): void {
    this.alimentacionService.cancelarGeneracion();
  }

  private generarMenuSemanalAutomatico(): void {
    this.alimentacionService.verificarConexionIA().subscribe({
      next: (estado) => {
        if (estado.conectado) {
          this.alimentacionService.generarMenuSemanalConStreaming();
        }
      }
    });
  }
}
