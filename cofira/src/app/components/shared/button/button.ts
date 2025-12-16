import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() variante: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';

  @Input() tamanio: 'sm' | 'md' | 'lg' = 'md';

  @Input() habilitado: boolean = false;

  @Input() tipo: 'button' | 'submit' | 'reset' = 'button';

  obtenerClasesBoton(): string {
    return `button button--${this.variante} button--${this.tamanio}`;
  }
}
