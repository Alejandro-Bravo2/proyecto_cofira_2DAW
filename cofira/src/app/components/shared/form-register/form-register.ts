import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormCheckbox } from '../form-checkbox/form-checkbox';

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormCheckbox],
  templateUrl: './form-register.html',
  styleUrl: './form-register.scss',
})
export class FormRegister implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

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

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulario de registro enviado:', this.registerForm.value);
      alert('¡Registro completado correctamente!');
      this.registerForm.reset();
    } else {
      this.registerForm.markAllAsTouched();
      alert('Por favor, completa todos los campos correctamente');
    }
  }

  // Getter para acceder fácilmente a los controles del formulario
  get f() {
    return this.registerForm.controls;
  }

  // Getter específico para el control de términos (como FormControl)
  get terminosControl(): FormControl {
    return this.registerForm.get('terminos') as FormControl;
  }
}
