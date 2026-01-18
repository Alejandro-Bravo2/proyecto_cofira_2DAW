import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormCheckbox } from '../form-checkbox/form-checkbox';
import { Button } from '../button/button';
import { NotificacionService } from '../../../services/notificacion.service';

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormCheckbox, Button],
  templateUrl: './form-register.html',
  styleUrl: './form-register.scss',
})
export class FormRegister implements OnInit {
  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);

  formularioRegistro!: FormGroup;

  ngOnInit(): void {
    this.formularioRegistro = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        terminos: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.validadorContrasenasCoinciden,
      }
    );
  }

  validadorContrasenasCoinciden(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  alEnviar(): void {
    if (this.formularioRegistro.valid) {
      console.log('Formulario de registro enviado:', this.formularioRegistro.value);
      this.notificacion.exito('¡Registro completado correctamente!');
      this.formularioRegistro.reset();
    } else {
      this.formularioRegistro.markAllAsTouched();
      this.notificacion.advertencia('Por favor, completa todos los campos correctamente');
    }
  }

  get controlesDelFormulario() {
    return this.formularioRegistro.controls;
  }

  get terminosControl(): FormControl {
    return this.formularioRegistro.get('terminos') as FormControl;
  }
}
