import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {AlimentacionService} from '../../services/alimentacion.service';
import {GimnasioService} from '../../services/gimnasio.service';
import {OnboardingService} from '../../services/onboarding.service';
import {AguaService} from '../../services/agua.service';
import {HistorialEntrenamiento} from '../../models/gimnasio.model';

interface PuntoGrafico {
  x: number;
  y: number;
  fecha: string;
  peso: number;
}

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './seguimiento.html',
  styleUrl: './seguimiento.scss',
})
export class Seguimiento implements OnInit {
  private readonly alimentacionService = inject(AlimentacionService);
  private readonly gimnasioService = inject(GimnasioService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly aguaService = inject(AguaService);

  readonly caloriasDiarias = signal(2000);
  readonly proteinasObjetivo = signal(120);
  readonly carbohidratosObjetivo = signal(250);
  readonly grasasObjetivo = signal(65);
  readonly fibraObjetivo = signal(25);

  readonly aguaConsumida = this.aguaService.aguaConsumida;
  readonly aguaObjetivo = signal(3);

  readonly ejerciciosDisponibles = signal<string[]>([]);
  readonly ejercicioSeleccionado = signal<string>("");
  readonly historialEjercicio = signal<HistorialEntrenamiento[]>([]);
  readonly cargandoGrafico = signal(false);

  readonly tieneMenuSemanal = this.alimentacionService.tieneMenu;

  readonly consumoSemanal = computed(() => {
    return this.alimentacionService.obtenerResumenSemanal();
  });

  readonly macrosConsumo = computed(() => {
    const consumo = this.consumoSemanal();
    const diasSemana = 7;

    const objetivosSemana = {
      calorias: this.caloriasDiarias() * diasSemana,
      proteinas: this.proteinasObjetivo() * diasSemana,
      carbohidratos: this.carbohidratosObjetivo() * diasSemana,
      grasas: this.grasasObjetivo() * diasSemana
    };

    const totalGramosConsumidos = consumo.proteinasTotal + consumo.carbohidratosTotal + consumo.grasasTotal;

    return {
      diasConDatos: consumo.diasConDatos,
      calorias: {
        consumido: consumo.caloriasTotal,
        objetivo: objetivosSemana.calorias,
        porcentaje: objetivosSemana.calorias > 0 ? Math.round((consumo.caloriasTotal / objetivosSemana.calorias) * 100) : 0
      },
      proteinas: {
        consumido: consumo.proteinasTotal,
        objetivo: objetivosSemana.proteinas,
        porcentaje: objetivosSemana.proteinas > 0 ? Math.round((consumo.proteinasTotal / objetivosSemana.proteinas) * 100) : 0,
        porcentajeGrafica: totalGramosConsumidos > 0 ? Math.round((consumo.proteinasTotal / totalGramosConsumidos) * 100) : 0
      },
      carbohidratos: {
        consumido: consumo.carbohidratosTotal,
        objetivo: objetivosSemana.carbohidratos,
        porcentaje: objetivosSemana.carbohidratos > 0 ? Math.round((consumo.carbohidratosTotal / objetivosSemana.carbohidratos) * 100) : 0,
        porcentajeGrafica: totalGramosConsumidos > 0 ? Math.round((consumo.carbohidratosTotal / totalGramosConsumidos) * 100) : 0
      },
      grasas: {
        consumido: consumo.grasasTotal,
        objetivo: objetivosSemana.grasas,
        porcentaje: objetivosSemana.grasas > 0 ? Math.round((consumo.grasasTotal / objetivosSemana.grasas) * 100) : 0,
        porcentajeGrafica: totalGramosConsumidos > 0 ? Math.round((consumo.grasasTotal / totalGramosConsumidos) * 100) : 0
      }
    };
  });

  readonly puntosGrafico = computed(() => {
    const historial = this.historialEjercicio();
    if (historial.length === 0) {
      return [];
    }

    const anchoGrafico = 510;
    const altoGrafico = 215;
    const margenIzquierdo = 50;
    const margenSuperior = 20;

    const pesos = historial.map(h => h.pesoKg || 0);
    const pesoMaximo = Math.max(...pesos, 100);

    const puntos: PuntoGrafico[] = historial.map((registro, indice) => {
      const x = margenIzquierdo + (indice / Math.max(historial.length - 1, 1)) * anchoGrafico;
      const y = margenSuperior + altoGrafico - ((registro.pesoKg || 0) / pesoMaximo) * altoGrafico;

      return {
        x,
        y,
        fecha: this.formatearFechaCorta(registro.fechaEntrenamiento),
        peso: registro.pesoKg || 0
      };
    });

    return puntos;
  });

  readonly polylinePoints = computed(() => {
    const puntos = this.puntosGrafico();
    return puntos.map(p => `${p.x},${p.y}`).join(' ');
  });

  readonly fechasEjeX = computed(() => {
    const puntos = this.puntosGrafico();
    if (puntos.length <= 7) {
      return puntos;
    }

    const paso = Math.ceil(puntos.length / 7);
    const fechasFiltradas: PuntoGrafico[] = [];

    for (let i = 0; i < puntos.length; i += paso) {
      fechasFiltradas.push(puntos[i]);
    }

    if (fechasFiltradas[fechasFiltradas.length - 1] !== puntos[puntos.length - 1]) {
      fechasFiltradas.push(puntos[puntos.length - 1]);
    }

    return fechasFiltradas;
  });

  readonly pesoMaximoGrafico = computed(() => {
    const historial = this.historialEjercicio();
    if (historial.length === 0) {
      return 100;
    }

    const pesos = historial.map(h => h.pesoKg || 0);
    return Math.ceil(Math.max(...pesos) / 25) * 25;
  });

  private readonly circunferencia = 2 * Math.PI * 80;

  ngOnInit(): void {
    this.cargarObjetivosNutricionales();
    this.cargarEjerciciosDisponibles();
    this.aguaService.obtenerConsumoHoy().subscribe();
  }

  calcularDashArray(porcentaje: number): string {
    const longitud = (porcentaje / 100) * this.circunferencia;
    return `${longitud} ${this.circunferencia}`;
  }

  calcularDashOffset(porcentajeAcumulado: number): number {
    return -(porcentajeAcumulado / 100) * this.circunferencia;
  }

  cambiarEjercicio(): void {
    const nombreEjercicio = this.ejercicioSeleccionado();
    if (nombreEjercicio) {
      this.cargarProgresoEjercicio(nombreEjercicio);
    }
  }

  private cargarObjetivosNutricionales(): void {
    this.onboardingService.getNutritionTargets().subscribe({
      next: (objetivos) => {
        this.caloriasDiarias.set(objetivos.dailyCalories || 2000);
        this.proteinasObjetivo.set(objetivos.proteinGrams || 120);
        this.carbohidratosObjetivo.set(objetivos.carbsGrams || 250);
        this.grasasObjetivo.set(objetivos.fatGrams || 65);
        this.fibraObjetivo.set(objetivos.fiberGrams || 25);
      },
      error: () => {
        console.error("No se pudieron cargar los objetivos nutricionales");
      }
    });
  }

  private cargarEjerciciosDisponibles(): void {
    this.gimnasioService.obtenerEjerciciosUnicos().subscribe({
      next: (ejercicios) => {
        this.ejerciciosDisponibles.set(ejercicios);

        if (ejercicios.length > 0) {
          this.ejercicioSeleccionado.set(ejercicios[0]);
          this.cargarProgresoEjercicio(ejercicios[0]);
        }
      },
      error: () => {
        console.error("No se pudieron cargar los ejercicios");
      }
    });
  }

  private cargarProgresoEjercicio(nombreEjercicio: string): void {
    this.cargandoGrafico.set(true);

    this.gimnasioService.obtenerProgresoPorEjercicio(nombreEjercicio).subscribe({
      next: (historial) => {
        this.historialEjercicio.set(historial);
        this.cargandoGrafico.set(false);
      },
      error: () => {
        this.historialEjercicio.set([]);
        this.cargandoGrafico.set(false);
      }
    });
  }

  private formatearFechaCorta(fecha: string): string {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1;
    return `${dia}/${mes}`;
  }
}
