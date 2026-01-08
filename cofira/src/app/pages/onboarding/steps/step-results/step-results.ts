import {Component, computed, EventEmitter, inject, OnInit, Output, signal} from '@angular/core';
import {Router} from '@angular/router';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';
import type {NutritionTargets} from '../../../../models/onboarding.model';

@Component({
  selector: 'app-step-results',
  standalone: true,
  imports: [Button],
  templateUrl: './step-results.html',
  styleUrl: './step-results.scss'
})
export class StepResults implements OnInit {
  @Output() continuar = new EventEmitter<void>();
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly results = signal<NutritionTargets | null>(null);
  readonly goalText = computed(() => {
    const goal = this.formData().primaryGoal;
    switch (goal) {
      case 'LOSE_WEIGHT':
        return 'Perder peso';
      case 'GAIN_MUSCLE':
        return 'Ganar musculo';
      case 'MAINTAIN':
        return 'Mantener peso';
      case 'IMPROVE_HEALTH':
        return 'Mejorar salud';
      default:
        return '';
    }
  });
  private readonly onboardingService = inject(OnboardingService);
  readonly formData = computed(() => this.onboardingService.formData());
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.calculateResults();
  }

  onComplete(): void {
    // Aqui se enviaria al backend cuando este disponible
    this.onboardingService.clearProgress();
    this.router.navigate(['/']);
  }

  private calculateResults(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Calculos locales mientras no hay backend conectado
    const data = this.formData();

    // Calculo de edad
    const birthDate = data.birthDate ? new Date(data.birthDate) : new Date();
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // BMR usando Mifflin-St Jeor
    const weight = data.currentWeightKg || 70;
    const height = data.heightCm || 170;
    const isMale = data.gender === 'MALE';

    let bmr: number;
    if (isMale) {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Multiplicador de actividad
    const activityMultipliers: Record<string, number> = {
      'SEDENTARY': 1.2,
      'LIGHTLY_ACTIVE': 1.375,
      'MODERATELY_ACTIVE': 1.55,
      'VERY_ACTIVE': 1.725,
      'EXTRA_ACTIVE': 1.9
    };

    const activityLevel = data.activityLevel || 'SEDENTARY';
    const multiplier = activityMultipliers[activityLevel] || 1.2;

    // TDEE
    let tdee = Math.round(bmr * multiplier);

    // Ajuste segun objetivo
    const goal = data.primaryGoal;
    let dailyCalories = tdee;

    if (goal === 'LOSE_WEIGHT') {
      dailyCalories = Math.round(tdee * 0.80); // Deficit del 20%
    } else if (goal === 'GAIN_MUSCLE') {
      dailyCalories = Math.round(tdee * 1.10); // Superavit del 10%
    }

    // Macros basados en calorias
    const proteinGrams = Math.round((dailyCalories * 0.30) / 4); // 30% proteina
    const fatGrams = Math.round((dailyCalories * 0.25) / 9); // 25% grasa
    const carbsGrams = Math.round((dailyCalories * 0.45) / 4); // 45% carbos
    const fiberGrams = Math.round(dailyCalories / 100); // ~25-35g aproximado

    this.results.set({
      calculatedBMR: Math.round(bmr),
      calculatedTDEE: tdee,
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      fiberGrams
    });

    this.isLoading.set(false);
  }
}
