import { Component, EventEmitter, inject, Output, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { SuscripcionService } from "../../../../services/suscripcion.service";
import { OnboardingService } from "../../../../services/onboarding.service";
import { NotificacionService } from "../../../../services/notificacion.service";
import { Button } from "../../../../components/shared/button/button";
import { DatosPagoSimulado } from "../../../../models/suscripcion.model";

@Component({
  selector: "app-step-payment",
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: "./step-payment.html",
  styleUrl: "./step-payment.scss"
})
export class StepPayment {
  @Output() continuar = new EventEmitter<void>();
  @Output() omitir = new EventEmitter<void>();

  readonly estaCargando = signal(false);
  readonly pagoExitoso = signal(false);

  private readonly suscripcionService = inject(SuscripcionService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly router = inject(Router);

  readonly formularioPago = new FormGroup({
    numeroTarjeta: new FormControl("", [
      Validators.required,
      Validators.pattern(/^\d{16}$/)
    ]),
    nombreTitular: new FormControl("", [
      Validators.required,
      Validators.minLength(3)
    ]),
    fechaExpiracion: new FormControl("", [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
    ]),
    cvv: new FormControl("", [
      Validators.required,
      Validators.pattern(/^\d{3,4}$/)
    ]),
    renovacionAutomatica: new FormControl(true)
  });

  readonly beneficiosPro = [
    {
      icono: "gimnasio",
      titulo: "Gimnasio personalizado",
      descripcion: "Rutinas adaptadas a tus objetivos"
    },
    {
      icono: "alimentacion",
      titulo: "Plan de alimentación",
      descripcion: "Dietas personalizadas para ti"
    },
    {
      icono: "seguimiento",
      titulo: "Seguimiento completo",
      descripcion: "Gráficos y estadísticas de progreso"
    }
  ];

  get numeroTarjetaFormateado(): string {
    const valorSinEspacios = this.formularioPago.get("numeroTarjeta")?.value || "";
    const valorLimpio = valorSinEspacios.replace(/\s/g, "");
    const grupos = valorLimpio.match(/.{1,4}/g);
    return grupos ? grupos.join(" ") : valorLimpio;
  }

  formatearNumeroTarjeta(evento: Event): void {
    const inputElement = evento.target as HTMLInputElement;
    const valorActual = inputElement.value;
    const valorSoloNumeros = valorActual.replace(/\D/g, "");
    const valorLimitado = valorSoloNumeros.slice(0, 16);
    this.formularioPago.get("numeroTarjeta")?.setValue(valorLimitado);
  }

  formatearFechaExpiracion(evento: Event): void {
    const inputElement = evento.target as HTMLInputElement;
    const valorActual = inputElement.value;
    const valorSoloNumeros = valorActual.replace(/\D/g, "");
    const valorLimitado = valorSoloNumeros.slice(0, 4);

    if (valorLimitado.length >= 2) {
      const mes = valorLimitado.slice(0, 2);
      const anio = valorLimitado.slice(2);
      const valorFormateado = anio ? `${mes}/${anio}` : mes;
      this.formularioPago.get("fechaExpiracion")?.setValue(valorFormateado);
    } else {
      this.formularioPago.get("fechaExpiracion")?.setValue(valorLimitado);
    }
  }

  formatearCvv(evento: Event): void {
    const inputElement = evento.target as HTMLInputElement;
    const valorActual = inputElement.value;
    const valorSoloNumeros = valorActual.replace(/\D/g, "");
    const valorLimitado = valorSoloNumeros.slice(0, 4);
    this.formularioPago.get("cvv")?.setValue(valorLimitado);
  }

  puedeEnviar(): boolean {
    const formularioEsValido = this.formularioPago.valid;
    const noEstaCargando = !this.estaCargando();
    return formularioEsValido && noEstaCargando;
  }

  alEnviar(): void {
    if (!this.puedeEnviar()) {
      return;
    }

    this.estaCargando.set(true);

    const valoresFormulario = this.formularioPago.value;

    const datosPago: DatosPagoSimulado = {
      numeroTarjeta: valoresFormulario.numeroTarjeta!,
      nombreTitular: valoresFormulario.nombreTitular!,
      fechaExpiracion: valoresFormulario.fechaExpiracion!,
      cvv: valoresFormulario.cvv!,
      renovacionAutomatica: valoresFormulario.renovacionAutomatica ?? true
    };

    this.suscripcionService.activarSuscripcionPro(datosPago).subscribe({
      next: function(this: StepPayment) {
        this.estaCargando.set(false);
        this.pagoExitoso.set(true);
        this.notificacionService.exito("¡Bienvenido a Cofira PRO!");

        setTimeout(function(this: StepPayment) {
          this.completarYRedirigir();
        }.bind(this), 2000);
      }.bind(this),
      error: function(this: StepPayment) {
        this.estaCargando.set(false);
        this.notificacionService.error("Error al procesar el pago. Inténtalo de nuevo.");
      }.bind(this)
    });
  }

  omitirPago(): void {
    this.completarYRedirigir();
  }

  private completarYRedirigir(): void {
    this.onboardingService.clearProgress();
    this.router.navigate([""]);
  }
}
