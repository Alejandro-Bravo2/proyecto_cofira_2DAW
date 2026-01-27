import {Component, computed, effect, EventEmitter, inject, Output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {OnboardingService} from '../../../../services/onboarding.service';
import {Button} from '../../../../components/shared/button/button';
import {Notification} from '../../../../components/shared/notification/notification';

@Component({
  selector: 'app-step-target-weight',
  standalone: true,
  imports: [FormsModule, Button, Notification],
  templateUrl: './step-target-weight.html',
  styleUrl: './step-target-weight.scss'
})
export class StepTargetWeight {
  @Output() continuar = new EventEmitter<void>();
  readonly pesoObjetivoKg = signal<number | null>(null);
  readonly mostrarNotificacion = signal(false);
  readonly mensajeNotificacion = signal("");
  private readonly onboardingService = inject(OnboardingService);
  private ultimoErrorMostrado = "";

  readonly errorPeso = computed(() => {
    const peso = this.pesoObjetivoKg();
    if (peso === null) return null;
    if (peso < 10) return "El peso mínimo es 10 kg";
    if (peso > 300) return "El peso máximo es 300 kg";
    return null;
  });

  readonly diferenciaPeso = computed(() => {
    const objetivo = this.pesoObjetivoKg();
    const actual = this.pesoActual();
    if (objetivo === null || actual === 0) return 0;
    return objetivo - actual;
  });

  readonly textoDiferencia = computed(() => {
    const diferencia = this.diferenciaPeso();
    if (diferencia === 0) return "Mantener peso";
    if (diferencia > 0) return `+${diferencia.toFixed(1)} kg`;
    return `${diferencia.toFixed(1)} kg`;
  });

  readonly pesoActual = computed(() => {
    return this.onboardingService.formData().currentWeightKg || 0;
  });

  constructor() {
    const datosFormulario = this.onboardingService.formData();
    if (datosFormulario.targetWeightKg) {
      this.pesoObjetivoKg.set(datosFormulario.targetWeightKg);
    } else if (datosFormulario.currentWeightKg) {
      this.pesoObjetivoKg.set(datosFormulario.currentWeightKg);
    }

    effect(() => {
      const errorActual = this.errorPeso();

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

  alCambiarPeso(valor: string): void {
    const numero = parseFloat(valor);
    this.pesoObjetivoKg.set(isNaN(numero) ? null : numero);
  }

  alContinuar(): void {
    const peso = this.pesoObjetivoKg();
    if (peso) {
      this.onboardingService.setField("targetWeightKg", peso);
      this.continuar.emit();
    }
  }

  puedeContinuar(): boolean {
    const peso = this.pesoObjetivoKg();
    return peso !== null && peso >= 10 && peso <= 300;
  }
}
