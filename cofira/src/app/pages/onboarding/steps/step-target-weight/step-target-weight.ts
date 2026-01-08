import {Component, computed, EventEmitter, inject, Output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';

@Component({
  selector: 'app-step-target-weight',
  standalone: true,
  imports: [FormsModule, Button],
  templateUrl: './step-target-weight.html',
  styleUrl: './step-target-weight.scss'
})
export class StepTargetWeight {
  @Output() continuar = new EventEmitter<void>();
  readonly targetWeightKg = signal<number | null>(null);
  readonly weightDifference = computed(() => {
    const target = this.targetWeightKg();
    const current = this.currentWeight();
    if (target === null || current === 0) return 0;
    return target - current;
  });
  readonly differenceText = computed(() => {
    const diff = this.weightDifference();
    if (diff === 0) return 'Mantener peso';
    if (diff > 0) return `+${diff.toFixed(1)} kg`;
    return `${diff.toFixed(1)} kg`;
  });
  private readonly onboardingService = inject(OnboardingService);
  readonly currentWeight = computed(() => {
    return this.onboardingService.formData().currentWeightKg || 0;
  });

  constructor() {
    const data = this.onboardingService.formData();
    if (data.targetWeightKg) {
      this.targetWeightKg.set(data.targetWeightKg);
    } else if (data.currentWeightKg) {
      this.targetWeightKg.set(data.currentWeightKg);
    }
  }

  onWeightChange(value: string): void {
    const num = parseFloat(value);
    this.targetWeightKg.set(isNaN(num) ? null : num);
  }

  onContinue(): void {
    const weight = this.targetWeightKg();
    if (weight) {
      this.onboardingService.setField('targetWeightKg', weight);
      this.continuar.emit();
    }
  }

  canContinue(): boolean {
    const weight = this.targetWeightKg();
    return weight !== null && weight >= 30 && weight <= 300;
  }
}
