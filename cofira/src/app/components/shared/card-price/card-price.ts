import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-price.html',
  styleUrls: ['./card-price.scss']
})
export class PricingCardComponent {
  @Input() title: string = 'Cuota anual';
  @Input() features: string[] = [
    'Máximo de 7 comidas diarias',
    'Rutina de ejercicios hasta 7 días',
    'Visualizar progreso gráficamente',
    'Ver recetas con sus ingredientes'
  ];
  @Input() buttonText: string = 'Inscríbete';
  @Input() price: string = '15.99€ + IVA al mes';
  @Output() subscribe = new EventEmitter<void>();

  onSubscribe(): void {
    this.subscribe.emit();
    console.log('Plan seleccionado:', this.title);
  }
}
