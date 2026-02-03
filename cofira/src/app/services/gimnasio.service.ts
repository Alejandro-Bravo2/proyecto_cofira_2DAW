import {computed, inject, Injectable, signal} from '@angular/core';
import {catchError, map, Observable, of, switchMap, tap} from 'rxjs';

import {ApiService} from './api.service';
import {
  Ejercicio,
  EjercicioProgreso,
  EjerciciosPorDia,
  EstadisticasGimnasio,
  EstadoIA,
  FeedbackEjercicio,
  GuardarProgresoRequest,
  HistorialEntrenamiento,
  RutinaGenerada
} from '../models/gimnasio.model';


@Injectable({providedIn: "root"})
export class GimnasioService {
  readonly rutinaGenerada = signal<RutinaGenerada | null>(null);
  readonly ejerciciosPorDia = signal<EjerciciosPorDia>({});
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly estadoIA = signal<EstadoIA | null>(null);
  readonly semanaActual = signal<number>(1);
  readonly feedbackEnviado = signal<boolean>(false);
  readonly progresoActualizado = signal<number>(0);

  readonly tieneRutina = computed(() => {
    const rutina = this.rutinaGenerada();
    if (rutina === null) {
      return false;
    }

    const diasEjercicioExiste = rutina.diasEjercicio !== undefined && rutina.diasEjercicio !== null;
    if (!diasEjercicioExiste) {
      return false;
    }

    return rutina.diasEjercicio.length > 0;
  });

  private readonly api = inject(ApiService);
  private readonly STORAGE_KEY = "cofira_rutina_gimnasio";
  private readonly STORAGE_KEY_SEMANA = "cofira_gimnasio_semana";

  constructor() {
    this.cargarRutinaGuardada();
    this.cargarSemanaDeStorage();
  }

  generarRutina(): Observable<RutinaGenerada> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.api.post<RutinaGenerada>("/rutinas-ejercicio/generar", {}).pipe(
      tap(rutina => {
        const rutinaEsValida = this.validarFormatoRutina(rutina);
        if (!rutinaEsValida) {
          this.isLoading.set(false);
          this.error.set("La rutina generada no tiene el formato esperado");
          return;
        }

        this.rutinaGenerada.set(rutina);
        this.ejerciciosPorDia.set(this.transformarRutinaAEjerciciosPorDia(rutina));
        this.guardarRutinaEnStorage(rutina);
        this.isLoading.set(false);
      }),
      catchError(errorCapturado => {
        this.isLoading.set(false);
        this.error.set(errorCapturado.message || "Error al generar la rutina");
        throw errorCapturado;
      })
    );
  }

  verificarConexionIA(): Observable<EstadoIA> {
    return this.api.get<EstadoIA>("/rutinas-ejercicio/ia/estado").pipe(
      tap(estado => {
        this.estadoIA.set(estado);
      }),
      catchError(() => {
        const estadoError: EstadoIA = {
          conectado: false,
          mensaje: "No se puede conectar con el servidor"
        };
        this.estadoIA.set(estadoError);
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

  actualizarPesoEjercicio(diaSemana: string, ejercicioId: number, pesoKg: number | undefined): void {
    this.ejerciciosPorDia.update(ejercicios => {
      const ejerciciosDelDia = ejercicios[diaSemana];
      if (!ejerciciosDelDia) {
        return ejercicios;
      }

      const ejerciciosActualizados = ejerciciosDelDia.map(ejercicio => {
        if (ejercicio.id === ejercicioId) {
          return {...ejercicio, pesoKg};
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

  private transformarRutinaAEjerciciosPorDia(rutina: RutinaGenerada): EjerciciosPorDia {
    const ejerciciosPorDiaTransformados: EjerciciosPorDia = {
      "Lunes": [],
      "Martes": [],
      "Miércoles": [],
      "Jueves": [],
      "Viernes": [],
      "Sábado": [],
      "Domingo": []
    };

    const diasEjercicioExiste = rutina.diasEjercicio !== undefined && rutina.diasEjercicio !== null;
    if (!diasEjercicioExiste) {
      return ejerciciosPorDiaTransformados;
    }

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
          grupoMuscular: ejercicioGenerado.grupoMuscular,
          pesoKg: ejercicioGenerado.pesoSugeridoKg
        };

        return ejercicioTransformado;
      });

      ejerciciosPorDiaTransformados[diaSemanaCorregido] = ejerciciosTransformados;
    });

    return ejerciciosPorDiaTransformados;
  }

  private corregirDiaSemana(diaSemana: string): string {
    const mapaDias: Record<string, string> = {
      "Lunes": "Lunes",
      "Martes": "Martes",
      "Miercoles": "Miércoles",
      "Miércoles": "Miércoles",
      "Jueves": "Jueves",
      "Viernes": "Viernes",
      "Sabado": "Sábado",
      "Sábado": "Sábado",
      "Domingo": "Domingo"
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
      console.error("Error guardando rutina en localStorage:", error);
    }
  }

  private cargarRutinaGuardada(): void {
    try {
      const rutinaGuardada = localStorage.getItem(this.STORAGE_KEY);

      if (rutinaGuardada) {
        const rutinaParsesada: RutinaGenerada = JSON.parse(rutinaGuardada);

        const rutinaEsValida = this.validarFormatoRutina(rutinaParsesada);
        if (!rutinaEsValida) {
          localStorage.removeItem(this.STORAGE_KEY);
          return;
        }

        this.rutinaGenerada.set(rutinaParsesada);
        this.ejerciciosPorDia.set(this.transformarRutinaAEjerciciosPorDia(rutinaParsesada));
      }
    } catch (error) {
      console.error("Error cargando rutina desde localStorage:", error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private validarFormatoRutina(rutina: unknown): rutina is RutinaGenerada {
    if (rutina === null || rutina === undefined) {
      return false;
    }

    const rutinaComoObjeto = rutina as Record<string, unknown>;
    const tieneDiasEjercicio = "diasEjercicio" in rutinaComoObjeto;
    if (!tieneDiasEjercicio) {
      return false;
    }

    const diasEjercicioEsArray = Array.isArray(rutinaComoObjeto["diasEjercicio"]);
    return diasEjercicioEsArray;
  }

  guardarFeedback(feedback: FeedbackEjercicio): Observable<FeedbackEjercicio> {
    return this.api.post<FeedbackEjercicio>("/rutinas-ejercicio/feedback", feedback).pipe(
      tap(() => {
        this.feedbackEnviado.set(true);
        this.semanaActual.update(semana => semana + 1);
        this.guardarSemanaEnStorage();
      }),
      catchError(errorCapturado => {
        console.error("Error al guardar feedback:", errorCapturado);
        throw errorCapturado;
      })
    );
  }

  obtenerUltimoFeedback(): Observable<FeedbackEjercicio | null> {
    return this.api.get<FeedbackEjercicio>("/rutinas-ejercicio/feedback/ultimo").pipe(
      catchError(() => of(null))
    );
  }

  obtenerSemanaActual(): Observable<number> {
    return this.api.get<{semanaActual: number}>("/rutinas-ejercicio/semana-actual").pipe(
      map(respuesta => respuesta.semanaActual),
      tap(semana => {
        this.semanaActual.set(semana);
        this.guardarSemanaEnStorage();
      }),
      catchError(() => {
        return of(this.semanaActual());
      })
    );
  }

  guardarProgreso(diaSemana: string): Observable<HistorialEntrenamiento[]> {
    const ejerciciosDelDia = this.obtenerEjerciciosDelDia(diaSemana);

    const ejerciciosProgreso: EjercicioProgreso[] = ejerciciosDelDia.map(ejercicio => {
      const ejercicioProgresoMapeado: EjercicioProgreso = {
        nombreEjercicio: ejercicio.nombre,
        grupoMuscular: ejercicio.grupoMuscular,
        seriesCompletadas: ejercicio.realizado === true ? ejercicio.series : 0,
        seriesObjetivo: ejercicio.series,
        repeticiones: ejercicio.repeticiones,
        completado: ejercicio.realizado === true,
        pesoKg: ejercicio.pesoKg
      };

      return ejercicioProgresoMapeado;
    });

    const requestProgreso: GuardarProgresoRequest = {
      diaSemana: diaSemana,
      ejercicios: ejerciciosProgreso
    };

    return this.api.post<HistorialEntrenamiento[]>("/rutinas-ejercicio/progreso", requestProgreso).pipe(
      tap(() => {
        this.progresoActualizado.update(valor => valor + 1);
      }),
      catchError(errorCapturado => {
        console.error("Error al guardar progreso:", errorCapturado);
        throw errorCapturado;
      })
    );
  }

  obtenerEstadisticas(): Observable<EstadisticasGimnasio> {
    return this.api.get<EstadisticasGimnasio>("/rutinas-ejercicio/progreso/estadisticas").pipe(
      catchError(errorCapturado => {
        console.error("Error al obtener estadisticas:", errorCapturado);
        const estadisticasVacias: EstadisticasGimnasio = {
          semanaActual: this.semanaActual(),
          ejerciciosCompletadosEstaSemana: 0
        };
        return of(estadisticasVacias);
      })
    );
  }

  private guardarSemanaEnStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_SEMANA, this.semanaActual().toString());
    } catch (error) {
      console.error("Error guardando semana en localStorage:", error);
    }
  }

  cargarSemanaDeStorage(): void {
    try {
      const semanaGuardada = localStorage.getItem(this.STORAGE_KEY_SEMANA);

      if (semanaGuardada) {
        const semanaParsesada = parseInt(semanaGuardada, 10);
        this.semanaActual.set(semanaParsesada);
      }
    } catch (error) {
      console.error("Error cargando semana desde localStorage:", error);
    }
  }

  obtenerEjerciciosUnicos(): Observable<string[]> {
    return this.api.get<string[]>("/rutinas-ejercicio/ejercicios-unicos").pipe(
      catchError(() => of([]))
    );
  }

  obtenerProgresoPorEjercicio(nombreEjercicio: string): Observable<HistorialEntrenamiento[]> {
    const nombreCodificado = encodeURIComponent(nombreEjercicio);
    return this.api.get<HistorialEntrenamiento[]>(`/rutinas-ejercicio/progreso/ejercicio/${nombreCodificado}`).pipe(
      catchError(() => of([]))
    );
  }

  obtenerMiRutina(): Observable<RutinaGenerada | null> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.api.get<RutinaGenerada>("/rutinas-ejercicio/mi-rutina").pipe(
      switchMap(rutina => {
        const rutinaEsValida = this.validarFormatoRutina(rutina);
        if (!rutinaEsValida) {
          return this.generarRutina();
        }

        this.rutinaGenerada.set(rutina);
        this.ejerciciosPorDia.set(this.transformarRutinaAEjerciciosPorDia(rutina));
        this.guardarRutinaEnStorage(rutina);
        this.isLoading.set(false);
        return of(rutina);
      }),
      catchError(errorCapturado => {
        this.isLoading.set(false);
        this.error.set(errorCapturado.message || "Error al obtener la rutina");
        return of(null);
      })
    );
  }
}
