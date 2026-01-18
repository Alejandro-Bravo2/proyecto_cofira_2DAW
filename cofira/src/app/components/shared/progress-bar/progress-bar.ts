import {Component, computed, input} from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss'
})
export class ProgressBar {
  readonly pasoActual = input<number>(0);
  readonly totalPasos = input<number>(1);
  readonly mostrarEtiqueta = input<boolean>(true);

  readonly progreso = computed(() => {
    const total = this.totalPasos();
    const actual = this.pasoActual();
    if (total <= 0) return 0;
    return Math.round((actual / total) * 100);
  });

  readonly textoDelPaso = computed(() => {
    return `Paso ${this.pasoActual() + 1} de ${this.totalPasos()}`;
  });
}
