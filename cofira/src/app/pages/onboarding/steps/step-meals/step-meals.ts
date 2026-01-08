import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';
import {OptionCard} from '../../../../components/shared/option-card/option-card';

interface MealsOption {
  value: number;
  label: string;
  description: string;
}

@Component({
  selector: 'app-step-meals',
  standalone: true,
  imports: [Button, OptionCard],
  templateUrl: './step-meals.html',
  styleUrl: './step-meals.scss'
})
export class StepMeals {
  @Output() continuar = new EventEmitter<void>();
  readonly options: MealsOption[] = [
    {value: 2, label: '2 comidas', description: 'Ayuno intermitente o comidas grandes'},
    {value: 3, label: '3 comidas', description: 'Desayuno, almuerzo y cena'},
    {value: 4, label: '4 comidas', description: 'Tres comidas principales y un snack'},
    {value: 5, label: '5+ comidas', description: 'Multiples comidas pequenas al dia'}
  ];
  readonly selectedMeals = signal<number | null>(null);
  private readonly onboardingService = inject(OnboardingService);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.mealsPerDay) {
      this.selectedMeals.set(data.mealsPerDay);
    }
  }

  onSelect(meals: number): void {
    this.selectedMeals.set(meals);
  }

  onContinue(): void {
    const meals = this.selectedMeals();
    if (meals !== null) {
      this.onboardingService.setField('mealsPerDay', meals);
      this.continuar.emit();
    }
  }

  canContinue(): boolean {
    return this.selectedMeals() !== null;
  }
}
