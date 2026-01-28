import {Component, EventEmitter, input, Output} from '@angular/core';

@Component({
  selector: 'app-option-card',
  standalone: true,
  templateUrl: './option-card.html',
  styleUrl: './option-card.scss'
})
export class OptionCard {
  readonly titulo = input.required<string>();
  readonly descripcion = input<string>('');
  readonly icono = input<string>('');
  readonly seleccionado = input<boolean>(false);
  readonly valor = input<string>('');

  @Output() seleccionar = new EventEmitter<string>();

  alSeleccionar(): void {
    this.seleccionar.emit(this.valor());
  }
}
