import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';

@Component({
  selector: 'app-step-measurements',
  standalone: true,
  imports: [FormsModule, Button],
  templateUrl: './step-measurements.html',
  styleUrl: './step-measurements.scss'
})
export class StepMeasurements {
  @Output() continuar = new EventEmitter<void>();
  readonly heightCm = signal<number | null>(null);
  readonly currentWeightKg = signal<number | null>(null);
  private readonly onboardingService = inject(OnboardingService);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.heightCm) {
      this.heightCm.set(data.heightCm);
    }
    if (data.currentWeightKg) {
      this.currentWeightKg.set(data.currentWeightKg);
    }
  }

  onHeightChange(value: string): void {
    const num = parseFloat(value);
    this.heightCm.set(isNaN(num) ? null : num);
  }

  onWeightChange(value: string): void {
    const num = parseFloat(value);
    this.currentWeightKg.set(isNaN(num) ? null : num);
  }

  onContinue(): void {
    const height = this.heightCm();
    const weight = this.currentWeightKg();
    if (height && weight) {
      this.onboardingService.setField('heightCm', height);
      this.onboardingService.setField('currentWeightKg', weight);
      this.continuar.emit();
    }
  }

  canContinue(): boolean {
    const height = this.heightCm();
    const weight = this.currentWeightKg();
    return height !== null && height >= 100 && height <= 250 &&
      weight !== null && weight >= 30 && weight <= 300;
  }
}
