import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})

export class Card {
  @Input() title: string = 'Cuota anual';
  @Input() ventajas: string[] = [
    'Máximo de 7 comidas diarias',
    'Rutina de ejercicios hasta 7 días',
    'Visualizar progreso gráficamente',
    'Ver recetas con sus ingredientes'
  ];
  @Input() texto_boton: string = 'Inscríbete';
  @Input() precio: string = '15.99€ + IVA al mes';
  @Input() variante: 'info' | 'planes'  = 'planes';
  @Input() tamanio: 'sm' | 'md' | 'lg' = 'md';
  @Input() deshabilitada: boolean = false;
  @Output() subscribe = new EventEmitter<void>();

  obtenerClasesCard(): string {
    return `pricing-card pricing-card--${this.variante} pricing-card--${this.tamanio}`;
  }

  onSubscribe(): void {
    alert("Gracías por subscribirte al plan: " + this.title);
  }
}

