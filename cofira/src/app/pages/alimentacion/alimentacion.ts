import {Component} from '@angular/core';
import {Calendario} from '../../components/shared/calendario/calendario';
import {Ingredientes} from '../../components/shared/ingredientes/ingredientes';

interface Alimento {
  id: number;
  descripcion: string;
  icono: 'pizza' | 'bebida' | 'plato';
  ingredientes?: string[];
}

interface Comida {
  id: number;
  tipo: 'desayuno' | 'almuerzo' | 'cena' | 'merienda';
  nombre: string;
  costoTotal: string;
  alimentos: Alimento[];
}

@Component({
  selector: 'app-alimentacion',
  standalone: true,
  imports: [Calendario, Ingredientes],
  templateUrl: './alimentacion.html',
  styleUrl: './alimentacion.scss',
})
export class Alimentacion {
  fechaActualDate = new Date();
  calendarioAbierto: boolean = false;
  ingredientesAbierto: boolean = false;
  alimentoSeleccionado: Alimento | null = null;

  diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  comidasDelDia: Comida[] = [
    {
      id: 1,
      tipo: 'desayuno',
      nombre: 'Desayuno',
      costoTotal: '8,3',
      alimentos: [
        {id: 1, descripcion: '2 porciones de pizza', icono: 'pizza'},
        {id: 2, descripcion: '1 baso de leche', icono: 'bebida'},
      ],
    },
    {
      id: 2,
      tipo: 'almuerzo',
      nombre: 'Almuerzo',
      costoTotal: '9',
      alimentos: [
        {id: 3, descripcion: '1 plato de arroz con pollo', icono: 'plato'},
      ],
    },
    {
      id: 3,
      tipo: 'merienda',
      nombre: 'Merienda',
      costoTotal: '4,5',
      alimentos: [
        {id: 4, descripcion: '1 yogur natural con frutos secos', icono: 'plato'},
        {id: 5, descripcion: '1 zumo de naranja', icono: 'bebida'},
      ],
    },
    {
      id: 4,
      tipo: 'cena',
      nombre: 'Cena',
      costoTotal: '12',
      alimentos: [
        {id: 6, descripcion: '1 ensalada mediterránea', icono: 'plato'},
        {id: 7, descripcion: '1 filete de salmón a la plancha', icono: 'plato'},
        {id: 8, descripcion: '1 vaso de agua', icono: 'bebida'},
      ],
    },
  ];

  get fechaActual(): string {
    const diaSemana = this.diasSemana[this.fechaActualDate.getDay()];
    const dia = this.fechaActualDate.getDate();
    return `${diaSemana} ${dia}`;
  }

  diaAnterior(): void {
    this.fechaActualDate = new Date(this.fechaActualDate.getTime() - 24 * 60 * 60 * 1000);
  }

  diaSiguiente(): void {
    this.fechaActualDate = new Date(this.fechaActualDate.getTime() + 24 * 60 * 60 * 1000);
  }

  abrirCalendario(): void {
    this.calendarioAbierto = true;
  }

  cerrarCalendario(): void {
    this.calendarioAbierto = false;
  }

  seleccionarFechaCalendario(fecha: Date): void {
    this.fechaActualDate = fecha;
    this.cerrarCalendario();
  }

  verIngredientes(alimento: Alimento): void {
    this.alimentoSeleccionado = alimento;
    this.ingredientesAbierto = true;
  }

  cerrarIngredientes(): void {
    this.ingredientesAbierto = false;
    this.alimentoSeleccionado = null;
  }
}
