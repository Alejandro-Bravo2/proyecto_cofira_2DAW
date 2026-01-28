import {computed, inject, Injectable, signal} from '@angular/core';
import {catchError, Observable, tap, throwError} from 'rxjs';

import {ApiService} from './api.service';
import {
  AnalisisImagen,
  AnalizarImagenRequest,
  ComidaAlternativa,
  MarcarComidaConsumidaRequest,
  RegistroComida,
  RegistrosPorTipoComida,
  ResumenNutricionalReal
} from '../models/consumo-comida.model';
import {TipoComida} from '../models/alimentacion.model';

@Injectable({providedIn: "root"})
export class ConsumoComidaService {
  readonly registrosDelDia = signal<RegistroComida[]>([]);
  readonly registrosPorTipo = signal<RegistrosPorTipoComida>({});
  readonly resumenReal = signal<ResumenNutricionalReal | null>(null);
  readonly resumenSemanal = signal<ResumenNutricionalReal | null>(null);
  readonly fechaActual = signal<string>(this.obtenerFechaHoyString());
  readonly isLoading = signal(false);
  readonly analizandoImagen = signal(false);
  readonly error = signal<string | null>(null);

  readonly comidasRegistradas = computed(() => {
    return this.registrosDelDia().length;
  });

  private readonly api = inject(ApiService);

  obtenerRegistrosHoy(): Observable<RegistroComida[]> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.api.get<RegistroComida[]>('/consumo-comida/hoy').pipe(
      tap(registros => {
        this.registrosDelDia.set(registros);
        this.actualizarRegistrosPorTipo(registros);
        this.isLoading.set(false);
      }),
      catchError(errorCapturado => {
        console.error("Error obteniendo registros de hoy:", errorCapturado);
        this.isLoading.set(false);
        this.error.set("No se pudieron cargar los registros de comidas");
        return throwError(() => errorCapturado);
      })
    );
  }

  obtenerRegistrosPorFecha(fecha: string): Observable<RegistroComida[]> {
    this.isLoading.set(true);
    this.error.set(null);
    this.fechaActual.set(fecha);

    return this.api.get<RegistroComida[]>(`/consumo-comida/${fecha}`).pipe(
      tap(registros => {
        this.registrosDelDia.set(registros);
        this.actualizarRegistrosPorTipo(registros);
        this.isLoading.set(false);
      }),
      catchError(errorCapturado => {
        console.error("Error obteniendo registros:", errorCapturado);
        this.isLoading.set(false);
        this.error.set("No se pudieron cargar los registros de comidas");
        return throwError(() => errorCapturado);
      })
    );
  }

  marcarComidaConsumida(solicitud: MarcarComidaConsumidaRequest): Observable<RegistroComida> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.api.post<RegistroComida>('/consumo-comida/marcar', solicitud).pipe(
      tap(registroNuevo => {
        this.agregarOActualizarRegistro(registroNuevo);
        this.isLoading.set(false);
      }),
      catchError(errorCapturado => {
        console.error("Error marcando comida como consumida:", errorCapturado);
        this.isLoading.set(false);
        this.error.set("No se pudo registrar la comida");
        return throwError(() => errorCapturado);
      })
    );
  }

  registrarComidaAlternativa(comidaAlternativa: ComidaAlternativa): Observable<RegistroComida> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.api.post<RegistroComida>('/consumo-comida/alternativa', comidaAlternativa).pipe(
      tap(registroNuevo => {
        this.agregarOActualizarRegistro(registroNuevo);
        this.isLoading.set(false);
      }),
      catchError(errorCapturado => {
        console.error("Error registrando comida alternativa:", errorCapturado);
        this.isLoading.set(false);
        this.error.set("No se pudo registrar la comida alternativa");
        return throwError(() => errorCapturado);
      })
    );
  }

  desmarcarComida(fecha: string, tipoComida: string): Observable<{ mensaje: string }> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.api.delete<{ mensaje: string }>(`/consumo-comida/${fecha}/${tipoComida}`).pipe(
      tap(() => {
        this.eliminarRegistroPorTipo(tipoComida);
        this.isLoading.set(false);
      }),
      catchError(errorCapturado => {
        console.error("Error desmarcando comida:", errorCapturado);
        this.isLoading.set(false);
        this.error.set("No se pudo desmarcar la comida");
        return throwError(() => errorCapturado);
      })
    );
  }

  obtenerResumenReal(fecha: string): Observable<ResumenNutricionalReal> {
    return this.api.get<ResumenNutricionalReal>(`/consumo-comida/resumen/${fecha}`).pipe(
      tap(resumen => {
        this.resumenReal.set(resumen);
      }),
      catchError(errorCapturado => {
        console.error("Error obteniendo resumen nutricional:", errorCapturado);
        return throwError(() => errorCapturado);
      })
    );
  }

  obtenerResumenSemanal(): Observable<ResumenNutricionalReal> {
    return this.api.get<ResumenNutricionalReal>("/consumo-comida/resumen-semanal").pipe(
      tap(resumen => {
        this.resumenSemanal.set(resumen);
      }),
      catchError(errorCapturado => {
        console.error("Error obteniendo resumen semanal:", errorCapturado);
        return throwError(() => errorCapturado);
      })
    );
  }

  estaComidaConsumida(tipoComida: string): boolean {
    const registros = this.registrosPorTipo();
    return registros[tipoComida] !== undefined;
  }

  obtenerRegistroPorTipo(tipoComida: string): RegistroComida | null {
    const registros = this.registrosPorTipo();
    return registros[tipoComida] ?? null;
  }

  limpiarRegistros(): void {
    this.registrosDelDia.set([]);
    this.registrosPorTipo.set({});
    this.resumenReal.set(null);
    this.error.set(null);
  }

  analizarImagen(imagenBase64: string, fecha: string, tipoComida: string): Observable<AnalisisImagen> {
    this.analizandoImagen.set(true);
    this.error.set(null);

    const solicitud: AnalizarImagenRequest = {
      imagenBase64: imagenBase64,
      fecha: fecha,
      tipoComida: tipoComida
    };

    return this.api.post<AnalisisImagen>('/consumo-comida/analizar-imagen', solicitud).pipe(
      tap(() => {
        this.analizandoImagen.set(false);
      }),
      catchError(errorCapturado => {
        console.error("Error analizando imagen:", errorCapturado);
        this.analizandoImagen.set(false);
        this.error.set("No se pudo analizar la imagen");
        return throwError(() => errorCapturado);
      })
    );
  }

  guardarAnalisisImagen(imagenBase64: string, fecha: string, tipoComida: string): Observable<RegistroComida> {
    this.isLoading.set(true);
    this.error.set(null);

    const solicitud: AnalizarImagenRequest = {
      imagenBase64: imagenBase64,
      fecha: fecha,
      tipoComida: tipoComida
    };

    return this.api.post<RegistroComida>('/consumo-comida/guardar-analisis', solicitud).pipe(
      tap(registroNuevo => {
        this.agregarOActualizarRegistro(registroNuevo);
        this.isLoading.set(false);
      }),
      catchError(errorCapturado => {
        console.error("Error guardando análisis:", errorCapturado);
        this.isLoading.set(false);
        this.error.set("No se pudo guardar el análisis");
        return throwError(() => errorCapturado);
      })
    );
  }

  private actualizarRegistrosPorTipo(registros: RegistroComida[]): void {
    const nuevoMapaRegistros: RegistrosPorTipoComida = {};

    registros.forEach(registro => {
      nuevoMapaRegistros[registro.tipoComida] = registro;
    });

    this.registrosPorTipo.set(nuevoMapaRegistros);
  }

  private agregarOActualizarRegistro(registroNuevo: RegistroComida): void {
    const registrosActuales = this.registrosDelDia();
    const indiceExistente = registrosActuales.findIndex(
      registro => registro.tipoComida === registroNuevo.tipoComida
    );

    let registrosActualizados: RegistroComida[];

    if (indiceExistente >= 0) {
      registrosActualizados = [...registrosActuales];
      registrosActualizados[indiceExistente] = registroNuevo;
    } else {
      registrosActualizados = [...registrosActuales, registroNuevo];
    }

    this.registrosDelDia.set(registrosActualizados);
    this.actualizarRegistrosPorTipo(registrosActualizados);
  }

  private eliminarRegistroPorTipo(tipoComida: string): void {
    const registrosActuales = this.registrosDelDia();
    const registrosFiltrados = registrosActuales.filter(
      registro => registro.tipoComida !== tipoComida
    );

    this.registrosDelDia.set(registrosFiltrados);
    this.actualizarRegistrosPorTipo(registrosFiltrados);
  }

  private obtenerFechaHoyString(): string {
    const hoy = new Date();
    const ano = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }
}
