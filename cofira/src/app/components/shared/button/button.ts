import {Component, Input} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() variante: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';

  @Input() tamanio: 'sm' | 'md' | 'lg' = 'md';

  @Input() habilitado: boolean = false;

  @Input() tipo: 'button' | 'submit' | 'reset' = 'button';

  @Input() enlace: string | null = null;

  @Input() href: string | null = null;

  @Input() fullWidth: boolean = false;

  obtenerClasesBoton(): string {
    let clases = `button button--${this.variante} button--${this.tamanio}`;
    if (this.fullWidth) {
      clases += ' button--full-width';
    }
    return clases;
  }
}
