import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';
import {OptionCard} from '../../../../components/shared/option-card/option-card';
import type {FitnessLevel} from '../../../../models/onboarding.model';
import {FITNESS_LEVEL_OPTIONS} from '../../../../models/onboarding.model';

@Component({
  selector: 'app-step-fitness-level',
  standalone: true,
  imports: [Button, OptionCard],
  templateUrl: './step-fitness-level.html',
  styleUrl: './step-fitness-level.scss'
})
export class StepFitnessLevel {
  @Output() continuar = new EventEmitter<void>();
  readonly options = FITNESS_LEVEL_OPTIONS;
  readonly selectedLevel = signal<FitnessLevel | null>(null);
  private readonly onboardingService = inject(OnboardingService);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.fitnessLevel) {
      this.selectedLevel.set(data.fitnessLevel);
    }
  }

  onSelect(level: FitnessLevel): void {
    this.selectedLevel.set(level);
  }

  onContinue(): void {
    const level = this.selectedLevel();
    if (level) {
      this.onboardingService.setField("fitnessLevel", level);
      this.continuar.emit();
    }
  }

  canContinue(): boolean {
    return this.selectedLevel() !== null;
  }
}
