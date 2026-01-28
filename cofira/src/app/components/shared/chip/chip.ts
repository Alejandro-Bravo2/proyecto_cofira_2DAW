import {Component, EventEmitter, input, Output} from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  templateUrl: './chip.html',
  styleUrl: './chip.scss'
})
export class Chip {
  readonly texto = input.required<string>();
  readonly removible = input<boolean>(false);
  readonly seleccionado = input<boolean>(false);

  @Output() eliminar = new EventEmitter<void>();
  @Output() seleccionar = new EventEmitter<void>();

  alEliminar(): void {
    this.eliminar.emit();
  }

  alSeleccionarConTeclado(evento: Event): void {
    evento.preventDefault();
    this.seleccionar.emit();
  }
}
