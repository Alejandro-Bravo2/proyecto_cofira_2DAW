import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Button} from '../button/button';

@Component({
  selector: 'app-card',
  imports: [Button],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  private readonly router = inject(Router);

  @Input() titulo: string = 'Cuota anual';
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
  @Output() suscribirse = new EventEmitter<void>();

  obtenerClasesCard(): string {
    return `pricing-card pricing-card--${this.variante} pricing-card--${this.tamanio}`;
  }

  obtenerClasesTitulo(): string {
    return `pricing-card__titulo pricing-card__titulo--${this.tamanio}`;
  }

  obtenerClasesVentaja(): string {
    return `pricing-card__ventaja pricing-card__ventaja--${this.tamanio}`;
  }

  obtenerClasesPrecio(): string {
    return `pricing-card__precio pricing-card__precio--${this.tamanio}`;
  }

  alSuscribirse(): void {
    this.router.navigate(['/onboarding']);
  }
}

