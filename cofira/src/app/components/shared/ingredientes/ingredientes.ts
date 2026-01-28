import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Modal} from '../modal/modal';
import {Alimento, TipoIconoAlimento} from '../../../models/alimentacion.model';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {
  faBreadSlice,
  faAppleWhole,
  faCarrot,
  faDrumstickBite,
  faCheese,
  faMugHot,
  faWheatAwn,
  faSeedling,
  faBowlRice,
  faUtensils
} from '@fortawesome/free-solid-svg-icons';

interface IngredienteDetalle {
  nombre: string;
  cantidad: string;
  calorias: number;
}

@Component({
  selector: 'app-ingredientes',
  standalone: true,
  imports: [CommonModule, Modal, FaIconComponent],
  templateUrl: './ingredientes.html',
  styleUrl: './ingredientes.scss',
})
export class Ingredientes {
  @Input() abierto: boolean = false;
  @Input() alimento: Alimento | null = null;

  @Output() cerrar = new EventEmitter<void>();

  private readonly mapaIconosAlimento: Record<TipoIconoAlimento, IconDefinition> = {
    "pan": faBreadSlice,
    "fruta": faAppleWhole,
    "verdura": faCarrot,
    "proteina": faDrumstickBite,
    "lacteo": faCheese,
    "bebida": faMugHot,
    "cereal": faWheatAwn,
    "legumbre": faSeedling,
    "fruto-seco": faBowlRice,
    "pizza": faUtensils,
    "plato": faUtensils
  };

  ingredientesDetallados: IngredienteDetalle[] = [
    {nombre: "Harina de trigo", cantidad: "200g", calorias: 360},
    {nombre: "Queso mozzarella", cantidad: "150g", calorias: 280},
    {nombre: "Salsa de tomate", cantidad: "100g", calorias: 30},
    {nombre: "Aceite de oliva", cantidad: "15ml", calorias: 120},
  ];

  get iconoActual(): IconDefinition {
    if (!this.alimento?.icono) {
      return faUtensils;
    }
    return this.mapaIconosAlimento[this.alimento.icono] || faUtensils;
  }

  get caloriasTotal(): number {
    return this.ingredientesDetallados.reduce(
      (total, ing) => total + ing.calorias,
      0
    );
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }
}
