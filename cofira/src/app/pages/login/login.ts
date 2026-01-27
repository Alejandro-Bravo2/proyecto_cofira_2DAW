import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {NotificacionService} from '../../services/notificacion.service';
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
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required])
  });
  readonly estaCargando = signal(false);
  readonly mostrarContrasena = signal(false);
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly router = inject(Router);

  alternarContrasena(): void {
    this.mostrarContrasena.update(v => !v);
  }

  alEnviar(): void {
    if (this.formularioLogin.invalid || this.estaCargando()) {
      return;
    }

    this.estaCargando.set(true);

    const valorFormulario = this.formularioLogin.value;

    this.authService.login({
      username: valorFormulario.email!,
      password: valorFormulario.password!
    }).subscribe({
      next: () => {
        this.estaCargando.set(false);
        this.notificacionService.exito("¡Sesión iniciada correctamente!");
        this.router.navigate(["/"]);
      },
      error: () => {
        this.estaCargando.set(false);
        this.notificacionService.error("No se pudo iniciar sesión. Verifica tus credenciales.");
      }
    });
  }
}
