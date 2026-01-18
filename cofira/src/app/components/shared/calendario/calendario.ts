import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Modal} from '../modal/modal';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, Modal],
  templateUrl: './calendario.html',
  styleUrl: './calendario.scss',
})
export class Calendario implements OnInit {
  @Input() abierto: boolean = false;
  @Input() fechaInicial: Date = new Date();

  @Output() cerrar = new EventEmitter<void>();
  @Output() seleccionarFecha = new EventEmitter<Date>();

  fechaActual: Date = new Date();
  mesActual: number = this.fechaActual.getMonth();
  anioActual: number = this.fechaActual.getFullYear();

  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  diasDelMes: (number | null)[] = [];

  ngOnInit(): void {
    this.generarCalendario();
  }

  generarCalendario(): void {
    const primerDia = new Date(this.anioActual, this.mesActual, 1).getDay();
    const ultimoDia = new Date(this.anioActual, this.mesActual + 1, 0).getDate();

    this.diasDelMes = [];

    for (let i = 0; i < primerDia; i++) {
      this.diasDelMes.push(null);
    }

    for (let dia = 1; dia <= ultimoDia; dia++) {
      this.diasDelMes.push(dia);
    }
  }

  mesAnterior(): void {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else {
      this.mesActual--;
    }
    this.generarCalendario();
  }

  mesSiguiente(): void {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.generarCalendario();
  }

  esDiaSeleccionado(dia: number | null): boolean {
    if (!dia) return false;
    const fecha = new Date(this.anioActual, this.mesActual, dia);
    return fecha.toDateString() === this.fechaInicial.toDateString();
  }

  seleccionarDia(dia: number | null): void {
    if (!dia) return;
    const fechaSeleccionada = new Date(this.anioActual, this.mesActual, dia);
    this.seleccionarFecha.emit(fechaSeleccionada);
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }
}
