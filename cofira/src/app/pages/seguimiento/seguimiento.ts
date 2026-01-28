import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {GimnasioService} from '../../services/gimnasio.service';
import {OnboardingService} from '../../services/onboarding.service';
import {AguaService} from '../../services/agua.service';
import {ConsumoComidaService} from '../../services/consumo-comida.service';
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
  private readonly gimnasioService = inject(GimnasioService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly aguaService = inject(AguaService);
  private readonly consumoComidaService = inject(ConsumoComidaService);

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

  readonly macrosConsumo = computed(() => {
    const resumen = this.consumoComidaService.resumenSemanal();
    const diasSemana = 7;

    const objetivosSemana = {
      calorias: this.caloriasDiarias() * diasSemana,
      proteinas: this.proteinasObjetivo() * diasSemana,
      carbohidratos: this.carbohidratosObjetivo() * diasSemana,
      grasas: this.grasasObjetivo() * diasSemana
    };

    if (!resumen) {
      return {
        diasConDatos: 0,
        calorias: { consumido: 0, objetivo: objetivosSemana.calorias, porcentaje: 0 },
        proteinas: { consumido: 0, objetivo: objetivosSemana.proteinas, porcentaje: 0, porcentajeGrafica: 0 },
        carbohidratos: { consumido: 0, objetivo: objetivosSemana.carbohidratos, porcentaje: 0, porcentajeGrafica: 0 },
        grasas: { consumido: 0, objetivo: objetivosSemana.grasas, porcentaje: 0, porcentajeGrafica: 0 }
      };
    }

    const totalGramosConsumidos = resumen.proteinasConsumidas + resumen.carbohidratosConsumidos + resumen.grasasConsumidas;

    return {
      diasConDatos: resumen.comidasRegistradas,
      calorias: {
        consumido: resumen.caloriasConsumidas,
        objetivo: objetivosSemana.calorias,
        porcentaje: objetivosSemana.calorias > 0 ? Math.round((resumen.caloriasConsumidas / objetivosSemana.calorias) * 100) : 0
      },
      proteinas: {
        consumido: resumen.proteinasConsumidas,
        objetivo: objetivosSemana.proteinas,
        porcentaje: objetivosSemana.proteinas > 0 ? Math.round((resumen.proteinasConsumidas / objetivosSemana.proteinas) * 100) : 0,
        porcentajeGrafica: totalGramosConsumidos > 0 ? Math.round((resumen.proteinasConsumidas / totalGramosConsumidos) * 100) : 0
      },
      carbohidratos: {
        consumido: resumen.carbohidratosConsumidos,
        objetivo: objetivosSemana.carbohidratos,
        porcentaje: objetivosSemana.carbohidratos > 0 ? Math.round((resumen.carbohidratosConsumidos / objetivosSemana.carbohidratos) * 100) : 0,
        porcentajeGrafica: totalGramosConsumidos > 0 ? Math.round((resumen.carbohidratosConsumidos / totalGramosConsumidos) * 100) : 0
      },
      grasas: {
        consumido: resumen.grasasConsumidas,
        objetivo: objetivosSemana.grasas,
        porcentaje: objetivosSemana.grasas > 0 ? Math.round((resumen.grasasConsumidas / objetivosSemana.grasas) * 100) : 0,
        porcentajeGrafica: totalGramosConsumidos > 0 ? Math.round((resumen.grasasConsumidas / totalGramosConsumidos) * 100) : 0
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

  constructor() {
    effect(() => {
      const actualizacion = this.gimnasioService.progresoActualizado();

      if (actualizacion > 0) {
        this.recargarDatosGrafico();
      }
    });
  }

  ngOnInit(): void {
    this.cargarObjetivosNutricionales();
    this.cargarEjerciciosDisponibles();
    this.aguaService.obtenerConsumoHoy().subscribe();
    this.consumoComidaService.obtenerResumenSemanal().subscribe();
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

  private recargarDatosGrafico(): void {
    this.gimnasioService.obtenerEjerciciosUnicos().subscribe({
      next: (ejercicios) => {
        this.ejerciciosDisponibles.set(ejercicios);

        const ejercicioActual = this.ejercicioSeleccionado();
        if (ejercicioActual) {
          this.recargarGraficoEjercicio(ejercicioActual);
        }
      }
    });
  }

  private recargarGraficoEjercicio(nombreEjercicio: string): void {
    this.gimnasioService.obtenerProgresoPorEjercicio(nombreEjercicio).subscribe({
      next: (historial) => {
        this.historialEjercicio.set(historial);
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
