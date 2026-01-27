import {Component, computed, effect, EventEmitter, inject, Output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';
import {Notification} from '../../../../components/shared/notification/notification';

@Component({
  selector: 'app-step-measurements',
  standalone: true,
  imports: [FormsModule, Button, Notification],
  templateUrl: './step-measurements.html',
  styleUrl: './step-measurements.scss'
})
export class StepMeasurements {
  @Output() continuar = new EventEmitter<void>();
  readonly alturaCm = signal<number | null>(null);
  readonly pesoActualKg = signal<number | null>(null);
  readonly mostrarNotificacion = signal(false);
  readonly mensajeNotificacion = signal("");
  private readonly onboardingService = inject(OnboardingService);
  private ultimoErrorMostrado = "";

  readonly errorAltura = computed(() => {
    const altura = this.alturaCm();
    if (altura === null) return null;
    if (altura < 100) return "La altura mínima es 100 cm";
    if (altura > 250) return "La altura máxima es 250 cm";
    return null;
  });

  readonly errorPeso = computed(() => {
    const peso = this.pesoActualKg();
    if (peso === null) return null;
    if (peso < 10) return "El peso mínimo es 10 kg";
    if (peso > 300) return "El peso máximo es 300 kg";
    return null;
  });

  constructor() {
    const datosFormulario = this.onboardingService.formData();
    if (datosFormulario.heightCm) {
      this.alturaCm.set(datosFormulario.heightCm);
    }
    if (datosFormulario.currentWeightKg) {
      this.pesoActualKg.set(datosFormulario.currentWeightKg);
    }

    effect(() => {
      const errorAltura = this.errorAltura();
      const errorPeso = this.errorPeso();
      const errorActual = errorAltura || errorPeso;

      if (errorActual && errorActual !== this.ultimoErrorMostrado) {
        this.ultimoErrorMostrado = errorActual;
        this.mensajeNotificacion.set(errorActual);
        this.mostrarNotificacion.set(true);
      } else if (!errorActual) {
        this.ultimoErrorMostrado = "";
      }
    });
  }

  cerrarNotificacion(): void {
    this.mostrarNotificacion.set(false);
  }

  alCambiarAltura(valor: string): void {
    const numero = parseFloat(valor);
    this.alturaCm.set(isNaN(numero) ? null : numero);
  }

  alCambiarPeso(valor: string): void {
    const numero = parseFloat(valor);
    this.pesoActualKg.set(isNaN(numero) ? null : numero);
  }

  alContinuar(): void {
    const altura = this.alturaCm();
    const peso = this.pesoActualKg();
    if (altura && peso) {
      this.onboardingService.setField("heightCm", altura);
      this.onboardingService.setField("currentWeightKg", peso);
      this.continuar.emit();
    }
  }

  puedeContinuar(): boolean {
    const altura = this.alturaCm();
    const peso = this.pesoActualKg();
    return altura !== null && altura >= 100 && altura <= 250 &&
      peso !== null && peso >= 10 && peso <= 300;
  }
}
