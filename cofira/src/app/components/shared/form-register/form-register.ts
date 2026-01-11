import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormCheckbox } from '../form-checkbox/form-checkbox';
import { Button } from '../button/button';
import { NotificacionService } from '../../../services/notificacion.service';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPONENTE: FormRegister
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Formulario de registro de usuario con validaciones.
 * Incluye validación de contraseñas coincidentes.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */
@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormCheckbox, Button],
  templateUrl: './form-register.html',
  styleUrl: './form-register.scss',
})
export class FormRegister implements OnInit {
  // ─────────────────────────────────────────────────────────────────────────
  // INYECCIÓN DE DEPENDENCIAS
  // ─────────────────────────────────────────────────────────────────────────

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);

  // ─────────────────────────────────────────────────────────────────────────
  // PROPIEDADES
  // ─────────────────────────────────────────────────────────────────────────

  registerForm!: FormGroup;

  // ─────────────────────────────────────────────────────────────────────────
  // CICLO DE VIDA
  // ─────────────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        terminos: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VALIDADORES
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Valida que las contraseñas coincidan
   */
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MÉTODOS
  // ─────────────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulario de registro enviado:', this.registerForm.value);
      this.notificacion.exito('¡Registro completado correctamente!');
      this.registerForm.reset();
    } else {
      this.registerForm.markAllAsTouched();
      this.notificacion.advertencia('Por favor, completa todos los campos correctamente');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────────────────

  /** Acceso rápido a los controles del formulario */
  get f() {
    return this.registerForm.controls;
  }

  /** Control de términos como FormControl */
  get terminosControl(): FormControl {
    return this.registerForm.get('terminos') as FormControl;
  }
}
