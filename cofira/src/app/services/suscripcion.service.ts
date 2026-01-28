import { computed, inject, Injectable, signal } from "@angular/core";
import { Observable, of, delay, tap } from "rxjs";

import { AuthService } from "./auth.service";
import { DatosPagoSimulado, EstadoSuscripcion, Suscripcion } from "../models/suscripcion.model";

@Injectable({ providedIn: "root" })
export class SuscripcionService {
  private readonly SUSCRIPCION_KEY = "cofira_suscripcion";
  private readonly DIAS_PERIODO_GRACIA = 3;
  private readonly DIAS_SUSCRIPCION = 30;

  private readonly authService = inject(AuthService);

  readonly suscripcionActual = signal<Suscripcion | null>(null);
  readonly estaCargando = signal(false);

  readonly esPro = computed(function(this: SuscripcionService) {
    const suscripcion = this.suscripcionActual();
    if (!suscripcion) return false;

    const estadoActual = suscripcion.estadoSuscripcion;
    const esEstadoValido = estadoActual === "activa" || estadoActual === "periodo_gracia";
    return esEstadoValido;
  }.bind(this));

  readonly estadoSuscripcion = computed(function(this: SuscripcionService) {
    const suscripcion = this.suscripcionActual();
    if (!suscripcion) return "sin_suscripcion";
    return suscripcion.estadoSuscripcion;
  }.bind(this));

  constructor() {
    this.cargarSuscripcionDesdeStorage();
  }

  private cargarSuscripcionDesdeStorage(): void {
    const suscripcionGuardada = localStorage.getItem(this.SUSCRIPCION_KEY);
    if (!suscripcionGuardada) return;

    try {
      const suscripcionParseada: Suscripcion = JSON.parse(suscripcionGuardada);
      const suscripcionActualizada = this.actualizarEstadoSuscripcion(suscripcionParseada);
      this.suscripcionActual.set(suscripcionActualizada);
      this.guardarEnStorage(suscripcionActualizada);
    } catch {
      localStorage.removeItem(this.SUSCRIPCION_KEY);
    }
  }

  private actualizarEstadoSuscripcion(suscripcion: Suscripcion): Suscripcion {
    const fechaExpiracion = new Date(suscripcion.fechaExpiracion);
    const fechaActual = new Date();

    const diferenciaEnMilisegundos = fechaExpiracion.getTime() - fechaActual.getTime();
    const diferenciaEnDias = Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

    const suscripcionNoEstaCancelada = suscripcion.estadoSuscripcion !== "cancelada";

    if (diferenciaEnDias > 0) {
      return {
        ...suscripcion,
        diasRestantes: diferenciaEnDias,
        estadoSuscripcion: suscripcionNoEstaCancelada ? "activa" : "cancelada",
        enPeriodoGracia: false
      };
    }

    const diasDesdeExpiracion = Math.abs(diferenciaEnDias);
    const estaEnPeriodoGracia = diasDesdeExpiracion <= this.DIAS_PERIODO_GRACIA;

    if (estaEnPeriodoGracia && suscripcionNoEstaCancelada) {
      return {
        ...suscripcion,
        diasRestantes: 0,
        estadoSuscripcion: "periodo_gracia",
        enPeriodoGracia: true
      };
    }

    return {
      ...suscripcion,
      diasRestantes: 0,
      estadoSuscripcion: "expirada",
      enPeriodoGracia: false
    };
  }

  private guardarEnStorage(suscripcion: Suscripcion): void {
    localStorage.setItem(this.SUSCRIPCION_KEY, JSON.stringify(suscripcion));
  }

  private generarIdSuscripcion(): number {
    return Date.now();
  }

  private calcularFechaExpiracion(): string {
    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() + this.DIAS_SUSCRIPCION);
    return fechaActual.toISOString();
  }

  activarSuscripcionPro(datosPago: DatosPagoSimulado): Observable<Suscripcion> {
    this.estaCargando.set(true);

    const fechaActual = new Date().toISOString();
    const fechaExpiracion = this.calcularFechaExpiracion();

    const nuevaSuscripcion: Suscripcion = {
      idSuscripcion: this.generarIdSuscripcion(),
      fechaInicio: fechaActual,
      fechaExpiracion: fechaExpiracion,
      renovacionAutomatica: datosPago.renovacionAutomatica,
      estadoSuscripcion: "activa",
      diasRestantes: this.DIAS_SUSCRIPCION,
      enPeriodoGracia: false
    };

    return of(nuevaSuscripcion).pipe(
      delay(1500),
      tap(function(this: SuscripcionService, suscripcion: Suscripcion) {
        this.suscripcionActual.set(suscripcion);
        this.guardarEnStorage(suscripcion);
        this.actualizarUsuarioConPro(true);
        this.estaCargando.set(false);
      }.bind(this))
    );
  }

  cancelarSuscripcion(): Observable<boolean> {
    this.estaCargando.set(true);

    const suscripcionActual = this.suscripcionActual();
    if (!suscripcionActual) {
      this.estaCargando.set(false);
      return of(false);
    }

    const suscripcionCancelada: Suscripcion = {
      ...suscripcionActual,
      estadoSuscripcion: "cancelada",
      renovacionAutomatica: false
    };

    return of(true).pipe(
      delay(800),
      tap(function(this: SuscripcionService) {
        this.suscripcionActual.set(suscripcionCancelada);
        this.guardarEnStorage(suscripcionCancelada);
        this.estaCargando.set(false);
      }.bind(this))
    );
  }

  reactivarSuscripcion(datosPago: DatosPagoSimulado): Observable<Suscripcion> {
    return this.activarSuscripcionPro(datosPago);
  }

  toggleRenovacionAutomatica(): Observable<boolean> {
    const suscripcionActual = this.suscripcionActual();
    if (!suscripcionActual) return of(false);

    const nuevoValorRenovacion = !suscripcionActual.renovacionAutomatica;

    const suscripcionActualizada: Suscripcion = {
      ...suscripcionActual,
      renovacionAutomatica: nuevoValorRenovacion
    };

    return of(true).pipe(
      delay(300),
      tap(function(this: SuscripcionService) {
        this.suscripcionActual.set(suscripcionActualizada);
        this.guardarEnStorage(suscripcionActualizada);
      }.bind(this))
    );
  }

  verificarEstadoSuscripcion(): EstadoSuscripcion | "sin_suscripcion" {
    const suscripcion = this.suscripcionActual();
    if (!suscripcion) return "sin_suscripcion";

    const suscripcionActualizada = this.actualizarEstadoSuscripcion(suscripcion);

    const estadoCambio = suscripcionActualizada.estadoSuscripcion !== suscripcion.estadoSuscripcion;
    if (estadoCambio) {
      this.suscripcionActual.set(suscripcionActualizada);
      this.guardarEnStorage(suscripcionActualizada);
    }

    return suscripcionActualizada.estadoSuscripcion;
  }

  obtenerDiasRestantes(): number {
    const suscripcion = this.suscripcionActual();
    if (!suscripcion) return 0;
    return suscripcion.diasRestantes;
  }

  estaEnPeriodoGracia(): boolean {
    const suscripcion = this.suscripcionActual();
    if (!suscripcion) return false;
    return suscripcion.enPeriodoGracia;
  }

  private actualizarUsuarioConPro(esPro: boolean): void {
    const usuarioActual = this.authService.currentUser();
    if (!usuarioActual) return;

    const usuarioActualizado = {
      ...usuarioActual,
      esPro: esPro,
      suscripcion: esPro ? this.suscripcionActual() : null
    };

    this.authService.currentUser.set(usuarioActualizado);

    const usuarioEnStorage = localStorage.getItem("cofira_user");
    if (usuarioEnStorage) {
      localStorage.setItem("cofira_user", JSON.stringify(usuarioActualizado));
    }
  }

  limpiarSuscripcion(): void {
    localStorage.removeItem(this.SUSCRIPCION_KEY);
    this.suscripcionActual.set(null);
    this.actualizarUsuarioConPro(false);
  }
}
