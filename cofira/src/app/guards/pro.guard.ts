import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { AuthService } from "../services/auth.service";
import { SuscripcionService } from "../services/suscripcion.service";

export const proGuard: CanActivateFn = function() {
  const servicioAutenticacion = inject(AuthService);
  const servicioSuscripcion = inject(SuscripcionService);
  const enrutador = inject(Router);

  const usuarioActual = servicioAutenticacion.currentUser();

  if (!usuarioActual) {
    const rutaDeRedireccionLogin = enrutador.createUrlTree(["/login"]);
    return rutaDeRedireccionLogin;
  }

  const estadoSuscripcion = servicioSuscripcion.verificarEstadoSuscripcion();

  const suscripcionEstaActiva = estadoSuscripcion === "activa";
  const estaEnPeriodoGracia = estadoSuscripcion === "periodo_gracia";
  const tieneAccesoPro = suscripcionEstaActiva || estaEnPeriodoGracia;

  if (tieneAccesoPro) {
    return true;
  }

  const rutaDeRedireccionAccesoPro = enrutador.createUrlTree(["/acceso-pro"]);
  return rutaDeRedireccionAccesoPro;
};
