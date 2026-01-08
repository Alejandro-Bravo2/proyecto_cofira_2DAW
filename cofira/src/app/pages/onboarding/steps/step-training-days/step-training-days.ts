import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';
import {OptionCard} from '../../../../components/shared/option-card/option-card';

interface TrainingDayOption {
  value: number;
  label: string;
  description: string;
}

@Component({
  selector: 'app-step-training-days',
  standalone: true,
  imports: [Button, OptionCard],
  templateUrl: './step-training-days.html',
  styleUrl: './step-training-days.scss'
})
export class StepTrainingDays {
  @Output() continuar = new EventEmitter<void>();
  readonly options: TrainingDayOption[] = [
    {value: 1, label: '1-2 dias', description: 'Entrenamiento minimo semanal'},
    {value: 3, label: '3-4 dias', description: 'Entrenamiento moderado'},
    {value: 5, label: '5-6 dias', description: 'Entrenamiento frecuente'},
    {value: 7, label: 'Todos los dias', description: 'Entrenamiento diario'}
  ];
  readonly selectedDays = signal<number | null>(null);
  private readonly onboardingService = inject(OnboardingService);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.trainingDaysPerWeek) {
      this.selectedDays.set(data.trainingDaysPerWeek);
    }
  }

  onSelect(days: number): void {
    this.selectedDays.set(days);
  }

  onContinue(): void {
    const days = this.selectedDays();
    if (days !== null) {
      this.onboardingService.setField('trainingDaysPerWeek', days);
      this.continuar.emit();
    }
  }

  canContinue(): boolean {
    return this.selectedDays() !== null;
  }
}
