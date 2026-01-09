import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import {AuthService} from '../../../../services/auth.service';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';
import {checkPasswordRequirements, passwordStrengthValidator} from '../../../../validators/password-strength.validator';
import {emailAvailableValidator} from '../../../../validators/email.validator';

@Component({
  selector: 'app-step-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './step-register.html',
  styleUrl: './step-register.scss'
})
export class StepRegister {
  @Output() continuar = new EventEmitter<void>();
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  private readonly authService = inject(AuthService);
  readonly registerForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('',
      [Validators.required, Validators.email],
      [emailAvailableValidator(this.authService)]
    ),
    password: new FormControl('', [Validators.required, passwordStrengthValidator()]),
    confirmPassword: new FormControl('', [Validators.required])
  });
  private readonly onboardingService = inject(OnboardingService);
  private readonly router = inject(Router);

  // Obtiene el valor actual de la contraseña
  get passwordValue(): string {
    return this.registerForm.get('password')?.value || '';
  }

  // Requisitos de contraseña (calculados directamente)
  get passwordRequirements() {
    return checkPasswordRequirements(this.passwordValue);
  }

  get allRequirementsMet(): boolean {
    const req = this.passwordRequirements;
    return req.hasUpperCase && req.hasLowerCase && req.hasNumeric && req.hasSpecial && req.isLongEnough;
  }

  // Estado de validacion del email
  get emailStatus(): 'valid' | 'invalid-format' | 'taken' | 'checking' | null {
    const emailControl = this.registerForm.get('email');
    if (!emailControl?.value) return null;
    if (emailControl.pending) return 'checking';
    if (emailControl.hasError('email')) return 'invalid-format';
    if (emailControl.hasError('emailTaken')) return 'taken';
    if (emailControl.valid) return 'valid';
    return null;
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirm = this.registerForm.get('confirmPassword')?.value;
    return password === confirm;
  }

  canSubmit(): boolean {
    // El validador passwordStrengthValidator ya verifica los requisitos
    return this.registerForm.valid && this.passwordsMatch() && !this.isLoading();
  }

  onSubmit(): void {
    if (!this.canSubmit()) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const formValue = this.registerForm.value;

    this.authService.register({
      nombre: formValue.nombre!,
      username: formValue.email!,
      email: formValue.email!,
      password: formValue.password!
    }).subscribe({
      next: () => {
        this.completeOnboarding();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.error?.message || 'Error al crear la cuenta');
      }
    });
  }

  private completeOnboarding(): void {
    // Verificar si hay datos de onboarding validos antes de intentar completar
    const onboardingData = this.onboardingService.formData();
    const hasRequiredData = this.hasMinimumOnboardingData(onboardingData);

    if (!hasRequiredData) {
      // Si no hay datos de onboarding, solo redirigir sin intentar completar
      this.isLoading.set(false);
      this.onboardingService.clearProgress();
      this.router.navigate(['/']);
      return;
    }

    this.onboardingService.completeOnboarding().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.onboardingService.clearProgress();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.error?.message || 'Error al guardar los datos');
      }
    });
  }

  private hasMinimumOnboardingData(data: Partial<import('../../../../models/onboarding.model').OnboardingData>): boolean {
    // Campos minimos requeridos para el calculo nutricional
    return !!(
      data.gender &&
      data.currentWeightKg &&
      data.heightCm &&
      data.birthDate &&
      data.activityLevel &&
      data.primaryGoal
    );
  }
}
