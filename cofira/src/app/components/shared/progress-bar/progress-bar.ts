import {Component, computed, input} from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss'
})
export class ProgressBar {
  readonly currentStep = input<number>(0);
  readonly totalSteps = input<number>(1);
  readonly showLabel = input<boolean>(true);

  readonly progress = computed(() => {
    const total = this.totalSteps();
    const current = this.currentStep();
    if (total <= 0) return 0;
    return Math.round((current / total) * 100);
  });

  readonly stepText = computed(() => {
    return `Paso ${this.currentStep() + 1} de ${this.totalSteps()}`;
  });
}
