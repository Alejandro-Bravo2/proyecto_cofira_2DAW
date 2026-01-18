import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Button} from '../../components/shared/button/button';

interface Ejercicio {
  id: number;
  nombre: string;
  repeticiones: string;
  descanso: string;
  series: number;
  realizado: boolean | null;
  expandido: boolean;
}

interface Feedback {
  ejerciciosDificiles: string;
  masPeso: string;
}

type EjerciciosPorDia = Record<string, Ejercicio[]>;

@Component({
  selector: 'app-gimnasio',
  standalone: true,
  imports: [FormsModule, Button],
  templateUrl: './gimnasio.html',
  styleUrl: './gimnasio.scss',
})
export class Gimnasio {
  readonly diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  diaActualIndex = 1;

  feedback: Feedback = {
    ejerciciosDificiles: '',
    masPeso: '',
  };

  private readonly ejerciciosPorDia: EjerciciosPorDia = {
    Lunes: [
      {
        id: 1,
        nombre: 'Press banca',
        repeticiones: '8-12',
        descanso: "2' 30\"",
        series: 4,
        realizado: null,
        expandido: false
      },
      {
        id: 2,
        nombre: 'Sentadillas',
        repeticiones: '8-10',
        descanso: "2'",
        series: 3,
        realizado: null,
        expandido: false
      },
      {
        id: 3,
        nombre: 'Dominadas',
        repeticiones: '10-12',
        descanso: "1' 30\"",
        series: 4,
        realizado: null,
        expandido: false
      },
    ],
    Martes: [
      {
        id: 4,
        nombre: 'Press banca',
        repeticiones: '8-12',
        descanso: "2' 30\"",
        series: 4,
        realizado: null,
        expandido: false
      },
      {
        id: 5,
        nombre: 'Sentadillas',
        repeticiones: '8-10',
        descanso: "2'",
        series: 3,
        realizado: null,
        expandido: false
      },
      {
        id: 6,
        nombre: 'Dominadas',
        repeticiones: '10-12',
        descanso: "1' 30\"",
        series: 4,
        realizado: null,
        expandido: false
      },
    ],
    Miércoles: [
      {id: 7, nombre: 'Peso muerto', repeticiones: '6-8', descanso: "3'", series: 4, realizado: null, expandido: false},
      {
        id: 8,
        nombre: 'Remo con barra',
        repeticiones: '8-10',
        descanso: "2'",
        series: 3,
        realizado: null,
        expandido: false
      },
    ],
    Jueves: [
      {
        id: 9,
        nombre: 'Press militar',
        repeticiones: '8-12',
        descanso: "2'",
        series: 4,
        realizado: null,
        expandido: false
      },
      {
        id: 10,
        nombre: 'Curl bíceps',
        repeticiones: '10-12',
        descanso: "1' 30\"",
        series: 3,
        realizado: null,
        expandido: false
      },
    ],
    Viernes: [
      {
        id: 11,
        nombre: 'Sentadillas',
        repeticiones: '8-10',
        descanso: "2' 30\"",
        series: 4,
        realizado: null,
        expandido: false
      },
      {id: 12, nombre: 'Prensa', repeticiones: '10-12', descanso: "2'", series: 3, realizado: null, expandido: false},
    ],
    Sábado: [],
    Domingo: [],
  };

  get ejerciciosDelDia(): Ejercicio[] {
    const dia = this.diasSemana[this.diaActualIndex];
    return this.ejerciciosPorDia[dia] ?? [];
  }

  diaAnterior(): void {
    if (this.diaActualIndex > 0) {
      this.diaActualIndex--;
    }
  }

  diaSiguiente(): void {
    if (this.diaActualIndex < this.diasSemana.length - 1) {
      this.diaActualIndex++;
    }
  }

  toggleEjercicio(ejercicio: Ejercicio): void {
    ejercicio.expandido = !ejercicio.expandido;
  }

  marcarRealizado(ejercicio: Ejercicio, realizado: boolean): void {
    ejercicio.realizado = ejercicio.realizado === realizado ? null : realizado;
  }

  enviarFeedback(): void {
    console.log('Feedback enviado:', this.feedback);
    this.resetFeedback();
  }

  cancelarFeedback(): void {
    this.resetFeedback();
  }

  private resetFeedback(): void {
    this.feedback = {
      ejerciciosDificiles: '',
      masPeso: '',
    };
  }
}
