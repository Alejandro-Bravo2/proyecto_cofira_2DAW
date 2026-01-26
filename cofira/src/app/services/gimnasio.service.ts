import {computed, inject, Injectable, signal} from '@angular/core';
import {catchError, map, Observable, of, tap} from 'rxjs';

import {ApiService} from './api.service';
import {OnboardingService} from './onboarding.service';
import {
  Ejercicio,
  EjerciciosPorDia,
  EstadoOllama,
  GenerarRutinaRequest,
  RutinaGenerada
} from '../models/gimnasio.model';


@Injectable({providedIn: 'root'})
export class GimnasioService {
  readonly rutinaGenerada = signal<RutinaGenerada | null>(null);
  readonly ejerciciosPorDia = signal<EjerciciosPorDia>({});
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly estadoOllama = signal<EstadoOllama | null>(null);

  readonly tieneRutina = computed(() => {
    const rutina = this.rutinaGenerada();
    return rutina !== null && rutina.diasEjercicio.length > 0;
  });

  private readonly api = inject(ApiService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly STORAGE_KEY = 'cofira_rutina_gimnasio';

  constructor() {
    this.cargarRutinaGuardada();
  }

  generarRutina(): Observable<RutinaGenerada> {
    this.isLoading.set(true);
    this.error.set(null);

    const datosOnboarding = this.onboardingService.formData();
    const solicitudRutina = this.construirSolicitudRutina(datosOnboarding);

    return this.api.post<RutinaGenerada>('/rutinas-ejercicio/generar', solicitudRutina).pipe(
      tap(rutina => {
        this.rutinaGenerada.set(rutina);
        this.ejerciciosPorDia.set(this.transformarRutinaAEjerciciosPorDia(rutina));
        this.guardarRutinaEnStorage(rutina);
        this.isLoading.set(false);
      }),
      catchError(errorCapturado => {
        this.isLoading.set(false);
        this.error.set(errorCapturado.message || 'Error al generar la rutina');
        throw errorCapturado;
      })
    );
  }

  verificarConexionOllama(): Observable<EstadoOllama> {
    return this.api.get<EstadoOllama>('/rutinas-ejercicio/ollama/estado').pipe(
      tap(estado => {
        this.estadoOllama.set(estado);
      }),
      catchError(() => {
        const estadoError: EstadoOllama = {
          conectado: false,
          mensaje: 'No se puede conectar con el servidor'
        };
        this.estadoOllama.set(estadoError);
        return of(estadoError);
      })
    );
  }

  obtenerEjerciciosDelDia(diaSemana: string): Ejercicio[] {
    const ejerciciosActuales = this.ejerciciosPorDia();
    return ejerciciosActuales[diaSemana] ?? [];
  }

  marcarEjercicioRealizado(diaSemana: string, ejercicioId: number, realizado: boolean | null): void {
    this.ejerciciosPorDia.update(ejercicios => {
      const ejerciciosDelDia = ejercicios[diaSemana];
      if (!ejerciciosDelDia) {
        return ejercicios;
      }

      const ejerciciosActualizados = ejerciciosDelDia.map(ejercicio => {
        if (ejercicio.id === ejercicioId) {
          return {...ejercicio, realizado};
        }
        return ejercicio;
      });

      return {...ejercicios, [diaSemana]: ejerciciosActualizados};
    });
  }

  toggleExpandirEjercicio(diaSemana: string, ejercicioId: number): void {
    this.ejerciciosPorDia.update(ejercicios => {
      const ejerciciosDelDia = ejercicios[diaSemana];
      if (!ejerciciosDelDia) {
        return ejercicios;
      }

      const ejerciciosActualizados = ejerciciosDelDia.map(ejercicio => {
        if (ejercicio.id === ejercicioId) {
          return {...ejercicio, expandido: !ejercicio.expandido};
        }
        return ejercicio;
      });

      return {...ejercicios, [diaSemana]: ejerciciosActualizados};
    });
  }

  limpiarRutina(): void {
    this.rutinaGenerada.set(null);
    this.ejerciciosPorDia.set({});
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private construirSolicitudRutina(datosOnboarding: any): GenerarRutinaRequest {
    const edadCalculada = this.calcularEdad(datosOnboarding.birthDate);

    const objetivoMapeado = this.mapearObjetivo(datosOnboarding.primaryGoal);
    const nivelMapeado = this.mapearNivelFitness(datosOnboarding.fitnessLevel);
    const generoMapeado = this.mapearGenero(datosOnboarding.gender);

    const solicitud: GenerarRutinaRequest = {
      objetivoPrincipal: objetivoMapeado,
      nivelFitness: nivelMapeado,
      diasEntrenamientoPorSemana: datosOnboarding.trainingDaysPerWeek || 3,
      equipamientoDisponible: datosOnboarding.equipment || [],
      genero: generoMapeado,
      edad: edadCalculada,
      duracionSesionMinutos: datosOnboarding.sessionDurationMinutes || 60
    };

    return solicitud;
  }

  private calcularEdad(fechaNacimiento: string | null): number {
    if (!fechaNacimiento) {
      return 25;
    }

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edadCalculada = hoy.getFullYear() - nacimiento.getFullYear();

    const mesActual = hoy.getMonth();
    const mesNacimiento = nacimiento.getMonth();
    const diaActual = hoy.getDate();
    const diaNacimiento = nacimiento.getDate();

    const noHaCumplidoAnosEsteAno = mesActual < mesNacimiento ||
      (mesActual === mesNacimiento && diaActual < diaNacimiento);

    if (noHaCumplidoAnosEsteAno) {
      edadCalculada--;
    }

    return edadCalculada;
  }

  private mapearObjetivo(objetivo: string | null): string {
    const mapaObjetivos: Record<string, string> = {
      'LOSE_WEIGHT': 'Perder grasa',
      'GAIN_MUSCLE': 'Ganar musculo',
      'MAINTAIN': 'Mantener peso',
      'IMPROVE_HEALTH': 'Mejorar salud general'
    };

    return mapaObjetivos[objetivo || ''] || 'Mejorar forma fisica';
  }

  private mapearNivelFitness(nivel: string | null): string {
    const mapaNiveles: Record<string, string> = {
      'SEDENTARY': 'Sedentario',
      'NOVICE': 'Principiante',
      'INTERMEDIATE': 'Intermedio',
      'ADVANCED': 'Avanzado',
      'ATHLETE': 'Atleta'
    };

    return mapaNiveles[nivel || ''] || 'Principiante';
  }

  private mapearGenero(genero: string | null): string {
    const mapaGeneros: Record<string, string> = {
      'MALE': 'Masculino',
      'FEMALE': 'Femenino',
      'OTHER': 'Otro'
    };

    return mapaGeneros[genero || ''] || 'Masculino';
  }

  private transformarRutinaAEjerciciosPorDia(rutina: RutinaGenerada): EjerciciosPorDia {
    const ejerciciosPorDiaTransformados: EjerciciosPorDia = {
      'Lunes': [],
      'Martes': [],
      'Miércoles': [],
      'Jueves': [],
      'Viernes': [],
      'Sábado': [],
      'Domingo': []
    };

    let contadorIdGlobal = 1;

    rutina.diasEjercicio.forEach(dia => {
      const diaSemanaCorregido = this.corregirDiaSemana(dia.diaSemana);

      const ejerciciosTransformados: Ejercicio[] = dia.ejercicios.map(ejercicioGenerado => {
        const ejercicioTransformado: Ejercicio = {
          id: contadorIdGlobal++,
          nombre: ejercicioGenerado.nombre,
          repeticiones: ejercicioGenerado.repeticiones,
          descanso: this.formatearDescanso(ejercicioGenerado.descansoSegundos),
          series: ejercicioGenerado.series,
          realizado: null,
          expandido: false,
          descripcion: ejercicioGenerado.descripcion,
          grupoMuscular: ejercicioGenerado.grupoMuscular
        };

        return ejercicioTransformado;
      });

      ejerciciosPorDiaTransformados[diaSemanaCorregido] = ejerciciosTransformados;
    });

    return ejerciciosPorDiaTransformados;
  }

  private corregirDiaSemana(diaSemana: string): string {
    const mapaDias: Record<string, string> = {
      'Lunes': 'Lunes',
      'Martes': 'Martes',
      'Miercoles': 'Miércoles',
      'Miércoles': 'Miércoles',
      'Jueves': 'Jueves',
      'Viernes': 'Viernes',
      'Sabado': 'Sábado',
      'Sábado': 'Sábado',
      'Domingo': 'Domingo'
    };

    return mapaDias[diaSemana] || diaSemana;
  }

  private formatearDescanso(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    if (minutos === 0) {
      return `${segundos}"`;
    }

    if (segundosRestantes === 0) {
      return `${minutos}'`;
    }

    return `${minutos}' ${segundosRestantes}"`;
  }

  private guardarRutinaEnStorage(rutina: RutinaGenerada): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rutina));
    } catch (error) {
      console.error('Error guardando rutina en localStorage:', error);
    }
  }

  private cargarRutinaGuardada(): void {
    try {
      const rutinaGuardada = localStorage.getItem(this.STORAGE_KEY);

      if (rutinaGuardada) {
        const rutinaParsesada: RutinaGenerada = JSON.parse(rutinaGuardada);
        this.rutinaGenerada.set(rutinaParsesada);
        this.ejerciciosPorDia.set(this.transformarRutinaAEjerciciosPorDia(rutinaParsesada));
      }
    } catch (error) {
      console.error('Error cargando rutina desde localStorage:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
