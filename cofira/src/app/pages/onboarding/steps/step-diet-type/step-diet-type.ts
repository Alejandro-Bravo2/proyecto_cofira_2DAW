import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';
import {OptionCard} from '../../../../components/shared/option-card/option-card';
import type {DietType} from '../../../../models/onboarding.model';
import {DIET_TYPE_OPTIONS} from '../../../../models/onboarding.model';

@Component({
  selector: 'app-step-diet-type',
  standalone: true,
  imports: [Button, OptionCard],
  templateUrl: './step-diet-type.html',
  styleUrl: './step-diet-type.scss'
})
export class StepDietType {
  @Output() continuar = new EventEmitter<void>();
  readonly options = DIET_TYPE_OPTIONS;
  readonly selectedDiet = signal<DietType | null>(null);
  private readonly onboardingService = inject(OnboardingService);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.dietType) {
      this.selectedDiet.set(data.dietType);
    }
  }

  onSelect(diet: DietType): void {
    this.selectedDiet.set(diet);
  }

  onContinue(): void {
    const diet = this.selectedDiet();
    if (diet) {
      this.onboardingService.setField('dietType', diet);
      this.continuar.emit();
    }
  }

  canContinue(): boolean {
    return this.selectedDiet() !== null;
  }
}
