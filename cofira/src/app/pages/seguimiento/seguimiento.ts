import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

interface Macro {
  gramos: number;
  porcentaje: number;
}

interface Ejercicio {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './seguimiento.html',
  styleUrl: './seguimiento.scss',
})
export class Seguimiento {
  caloriasActuales = 1850;
  caloriasObjetivo = 2250;

  macros = {
    proteinas: {gramos: 120, porcentaje: 30} as Macro,
    carbohidratos: {gramos: 200, porcentaje: 40} as Macro,
    grasas: {gramos: 65, porcentaje: 30} as Macro,
  };

  fibra = 25;
  aguaActual = 2;
  aguaObjetivo = 3;

  ejercicios: Ejercicio[] = [
    {id: 1, nombre: 'Press banca'},
    {id: 2, nombre: 'Sentadillas'},
    {id: 3, nombre: 'Peso muerto'},
    {id: 4, nombre: 'Press militar'},
    {id: 5, nombre: 'Dominadas'},
  ];

  ejercicioSeleccionado = 1;

  private readonly circunferencia = 2 * Math.PI * 80;

  calcularDashArray(porcentaje: number): string {
    const longitud = (porcentaje / 100) * this.circunferencia;
    return `${longitud} ${this.circunferencia}`;
  }

  calcularDashOffset(porcentajeAcumulado: number): number {
    return -(porcentajeAcumulado / 100) * this.circunferencia;
  }

  cambiarEjercicio(): void {
    console.log('Ejercicio seleccionado:', this.ejercicioSeleccionado);
  }
}
