import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import {AuthService} from '../../../../services/auth.service';
import {OnboardingService} from '../../../../services/onboarding.service';
import {NotificacionService} from '../../../../services/notificacion.service';
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
  readonly estaCargando = signal(false);
  readonly mostrarContrasena = signal(false);
  readonly mostrarConfirmacionContrasena = signal(false);
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);
  readonly formularioRegistro = new FormGroup({
    nombre: new FormControl("", [Validators.required, Validators.minLength(2)]),
    email: new FormControl("",
      [Validators.required, Validators.email],
      [emailAvailableValidator(this.authService)]
    ),
    password: new FormControl("", [Validators.required, passwordStrengthValidator()]),
    confirmPassword: new FormControl("", [Validators.required])
  });
  private readonly onboardingService = inject(OnboardingService);
  private readonly router = inject(Router);

  get valorContrasena(): string {
    return this.formularioRegistro.get("password")?.value || "";
  }

  get requisitosContrasena() {
    return checkPasswordRequirements(this.valorContrasena);
  }

  get todosRequisitosCompletados(): boolean {
    const req = this.requisitosContrasena;
    return req.hasUpperCase && req.hasLowerCase && req.hasNumeric && req.hasSpecial && req.isLongEnough;
  }

  get estadoEmail(): "valid" | "invalid-format" | "taken" | "checking" | null {
    const emailControl = this.formularioRegistro.get("email");
    if (!emailControl?.value) return null;
    if (emailControl.pending) return "checking";
    if (emailControl.hasError("email")) return "invalid-format";
    if (emailControl.hasError("emailTaken")) return "taken";
    if (emailControl.valid) return "valid";
    return null;
  }

  alternarContrasena(): void {
    this.mostrarContrasena.update(v => !v);
  }

  alternarConfirmacionContrasena(): void {
    this.mostrarConfirmacionContrasena.update(v => !v);
  }

  contrasenasCoinciden(): boolean {
    const password = this.formularioRegistro.get("password")?.value;
    const confirm = this.formularioRegistro.get("confirmPassword")?.value;
    return password === confirm;
  }

  puedeEnviar(): boolean {
    return this.formularioRegistro.valid && this.contrasenasCoinciden() && !this.estaCargando();
  }

  alEnviar(): void {
    if (!this.puedeEnviar()) {
      return;
    }

    this.estaCargando.set(true);

    const valorFormulario = this.formularioRegistro.value;

    this.authService.register({
      nombre: valorFormulario.nombre!,
      username: valorFormulario.email!,
      email: valorFormulario.email!,
      password: valorFormulario.password!
    }).subscribe({
      next: () => {
        this.notificacionService.exito("¡Cuenta creada con éxito!");
        this.completarOnboarding();
      },
      error: () => {
        this.estaCargando.set(false);
        this.notificacionService.error("No se pudo crear la cuenta. Inténtalo de nuevo.");
      }
    });
  }

  private completarOnboarding(): void {
    const datosOnboarding = this.onboardingService.formData();
    const tieneDataRequerida = this.tieneDataMinimaOnboarding(datosOnboarding);

    if (!tieneDataRequerida) {
      this.estaCargando.set(false);
      this.continuar.emit();
      return;
    }

    this.onboardingService.completeOnboarding().subscribe({
      next: function(this: StepRegister) {
        this.estaCargando.set(false);
        this.continuar.emit();
      }.bind(this),
      error: function(this: StepRegister, error: unknown) {
        this.estaCargando.set(false);
        console.error("Error al completar onboarding:", error);
        const errorObj = error as { error?: { message?: string; errors?: string } };
        const mensajeError = errorObj?.error?.message || errorObj?.error?.errors || "Error desconocido";
        console.error("Detalles del error:", mensajeError);
        this.notificacionService.error("No se pudieron guardar todos los datos, pero tu cuenta ha sido creada.");
        this.continuar.emit();
      }.bind(this)
    });
  }

  private tieneDataMinimaOnboarding(data: Partial<import('../../../../models/onboarding.model').OnboardingData>): boolean {
    const tieneDataBasica = !!(
      data.gender &&
      data.currentWeightKg &&
      data.heightCm &&
      data.birthDate &&
      data.activityLevel &&
      data.primaryGoal
    );

    const tieneDataEntrenamiento = !!(
      data.workType &&
      data.fitnessLevel &&
      data.trainingDaysPerWeek !== null &&
      data.trainingDaysPerWeek !== undefined &&
      data.dietType
    );

    return tieneDataBasica && tieneDataEntrenamiento;
  }
}
