import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {OnboardingService} from '../../../../services/onboarding.service';
import {OptionCard} from '../../../../components/shared/option-card/option-card';
import {Button} from '../../../../components/shared/button/button';
import {Gender, GENDER_OPTIONS} from '../../../../models/onboarding.model';

@Component({
  selector: 'app-step-gender',
  standalone: true,
  imports: [OptionCard, Button],
  templateUrl: './step-gender.html',
  styleUrl: './step-gender.scss'
})
export class StepGender {
  @Output() continuar = new EventEmitter<void>();
  readonly genders = GENDER_OPTIONS;
  readonly selectedGender = signal<Gender | null>(null);
  private readonly onboardingService = inject(OnboardingService);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.gender) {
      this.selectedGender.set(data.gender);
    }
  }

  selectGender(value: string): void {
    this.selectedGender.set(value as Gender);
  }

  onContinue(): void {
    const gender = this.selectedGender();
    if (gender) {
      this.onboardingService.setField('gender', gender);
      this.continuar.emit();
    }
  }

  canContinue(): boolean {
    return this.selectedGender() !== null;
  }
}
