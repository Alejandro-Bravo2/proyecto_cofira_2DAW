import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Guard de autenticacion para proteger rutas privadas.
 *
 * Este guard verifica si el usuario tiene una sesion activa.
 * Si no esta autenticado, redirige automaticamente a la pagina de login.
 *
 * Uso en app.routes.ts:
 *   { path: 'perfil', component: Perfil, canActivate: [authGuard] }
 */
export const authGuard: CanActivateFn = () => {
  const servicioAutenticacion = inject(AuthService);
  const enrutador = inject(Router);

  const usuarioEstaAutenticado = servicioAutenticacion.isLoggedIn();

  if (usuarioEstaAutenticado) {
    return true;
  }

  const rutaDeRedireccion = enrutador.createUrlTree(['/login']);
  return rutaDeRedireccion;
};


/**
 * Guard inverso para rutas de invitados (login, registro).
 *
 * Este guard evita que usuarios ya autenticados accedan a paginas
 * como login u onboarding. Los redirige al inicio.
 *
 * Uso en app.routes.ts:
 *   { path: 'login', component: Login, canActivate: [guestGuard] }
 */
export const guestGuard: CanActivateFn = () => {
  const servicioAutenticacion = inject(AuthService);
  const enrutador = inject(Router);

  const usuarioEstaAutenticado = servicioAutenticacion.isLoggedIn();

  if (usuarioEstaAutenticado) {
    const rutaDeRedireccion = enrutador.createUrlTree(['/']);
    return rutaDeRedireccion;
  }

  return true;
};
