import {Component, computed, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {OnboardingService} from '../../services/onboarding.service';
import {ProgressBar} from '../../components/shared/progress-bar/progress-bar';

// Step components
import {StepWelcome} from './steps/step-welcome/step-welcome';
import {StepGoal} from './steps/step-goal/step-goal';
import {StepGender} from './steps/step-gender/step-gender';
import {StepBirthdate} from './steps/step-birthdate/step-birthdate';
import {StepMeasurements} from './steps/step-measurements/step-measurements';
import {StepTargetWeight} from './steps/step-target-weight/step-target-weight';
import {StepActivityLevel} from './steps/step-activity-level/step-activity-level';
import {StepFitnessLevel} from './steps/step-fitness-level/step-fitness-level';
import {StepTrainingDays} from './steps/step-training-days/step-training-days';
import {StepDietType} from './steps/step-diet-type/step-diet-type';
import {StepMeals} from './steps/step-meals/step-meals';
import {StepAllergies} from './steps/step-allergies/step-allergies';
import {StepEquipment} from './steps/step-equipment/step-equipment';
import {StepResults} from './steps/step-results/step-results';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    ProgressBar,
    StepWelcome,
    StepGoal,
    StepGender,
    StepBirthdate,
    StepMeasurements,
    StepTargetWeight,
    StepActivityLevel,
    StepFitnessLevel,
    StepTrainingDays,
    StepDietType,
    StepMeals,
    StepAllergies,
    StepEquipment,
    StepResults
  ],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss'
})
export class Onboarding implements OnInit {
  readonly onboardingService = inject(OnboardingService);
  readonly currentStep = computed(() => this.onboardingService.currentStep());
  readonly totalSteps = computed(() => this.onboardingService.getTotalSteps());
  readonly canGoBack = computed(() => this.onboardingService.canGoBack());
  readonly showProgress = computed(() => this.currentStep() > 0);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const step = parseInt(params['step'] || '0', 10);
      if (step !== this.currentStep()) {
        this.onboardingService.goToStep(step);
      }
    });
  }

  goToStep(step: number): void {
    this.onboardingService.goToStep(step);
    this.updateUrl(step);
  }

  nextStep(): void {
    this.onboardingService.nextStep();
    this.updateUrl(this.currentStep());
  }

  previousStep(): void {
    this.onboardingService.previousStep();
    this.updateUrl(this.currentStep());
  }

  private updateUrl(step: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {step},
      queryParamsHandling: 'merge'
    });
  }
}
