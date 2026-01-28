import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() variante: 'primario' | 'secundario' | 'fantasma' | 'peligro' = 'primario';

  @Input() tamanio: 'pequeno' | 'mediano' | 'grande' = 'mediano';

  @Input() habilitado: boolean = false;

  @Input() tipo: 'button' | 'submit' | 'reset' = 'button';

  @Input() enlace: string | null = null;

  @Input() href: string | null = null;

  @Input() anchoCompleto: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  obtenerClasesBoton(): string {
    let clases = `boton boton--${this.variante} boton--${this.tamanio}`;
    if (this.anchoCompleto) {
      clases += ' boton--completo';
    }
    return clases;
  }

  alHacerClick(): void {
    if (!this.habilitado) {
      this.clicked.emit();
    }
  }
}
