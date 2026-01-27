import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';
import {OptionCard} from '../../../../components/shared/option-card/option-card';
import type {ActivityLevel, WorkType} from '../../../../models/onboarding.model';
import {ACTIVITY_LEVEL_OPTIONS} from '../../../../models/onboarding.model';

@Component({
  selector: 'app-step-activity-level',
  standalone: true,
  imports: [Button, OptionCard],
  templateUrl: './step-activity-level.html',
  styleUrl: './step-activity-level.scss'
})
export class StepActivityLevel {
  @Output() continuar = new EventEmitter<void>();
  readonly options = ACTIVITY_LEVEL_OPTIONS;
  readonly selectedLevel = signal<ActivityLevel | null>(null);
  private readonly onboardingService = inject(OnboardingService);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.activityLevel) {
      this.selectedLevel.set(data.activityLevel);
    }
  }

  onSelect(level: ActivityLevel): void {
    this.selectedLevel.set(level);
  }

  onContinue(): void {
    const nivelActividad = this.selectedLevel();
    if (nivelActividad) {
      this.onboardingService.setField("activityLevel", nivelActividad);
      const tipoTrabajo = this.derivarTipoTrabajo(nivelActividad);
      this.onboardingService.setField("workType", tipoTrabajo);
      this.continuar.emit();
    }
  }

  private derivarTipoTrabajo(nivelActividad: ActivityLevel): WorkType {
    const mapeoNivelATrabajo: Record<ActivityLevel, WorkType> = {
      "SEDENTARY": "OFFICE_DESK",
      "LIGHTLY_ACTIVE": "OFFICE_DESK",
      "MODERATELY_ACTIVE": "STANDING",
      "VERY_ACTIVE": "PHYSICAL_LABOR",
      "EXTRA_ACTIVE": "PHYSICAL_LABOR"
    };
    return mapeoNivelATrabajo[nivelActividad];
  }

  canContinue(): boolean {
    return this.selectedLevel() !== null;
  }
}
