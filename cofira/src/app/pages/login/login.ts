import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {Button} from '../../components/shared/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  readonly formularioLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  readonly estaCargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly mostrarContrasena = signal(false);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  alternarContrasena(): void {
    this.mostrarContrasena.update(v => !v);
  }

  alEnviar(): void {
    if (this.formularioLogin.invalid || this.estaCargando()) {
      return;
    }

    this.estaCargando.set(true);
    this.error.set(null);

    const valorFormulario = this.formularioLogin.value;

    this.authService.login({
      username: valorFormulario.email!,
      password: valorFormulario.password!
    }).subscribe({
      next: () => {
        this.estaCargando.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.estaCargando.set(false);
        this.error.set(err.error?.message || 'Credenciales incorrectas');
      }
    });
  }
}
