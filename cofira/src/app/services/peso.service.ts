import {inject, Injectable, signal} from "@angular/core";
import {Observable, tap} from "rxjs";

import {ApiService} from "./api.service";
import {RegistroPeso, ActualizarPeso} from "../models/peso.model";

@Injectable({providedIn: "root"})
export class PesoService {
  private readonly apiService = inject(ApiService);

  readonly registroHoy = signal<RegistroPeso | null>(null);
  readonly historialPeso = signal<RegistroPeso[]>([]);

  obtenerPesoHoy(): Observable<RegistroPeso> {
    return this.apiService.get<RegistroPeso>("/api/registro-peso/hoy").pipe(
      tap(registro => this.registroHoy.set(registro))
    );
  }

  registrarPeso(datos: ActualizarPeso): Observable<RegistroPeso> {
    return this.apiService.put<RegistroPeso>("/api/registro-peso", datos).pipe(
      tap(registro => this.registroHoy.set(registro))
    );
  }

  obtenerHistorial(fechaInicio: string, fechaFin: string): Observable<RegistroPeso[]> {
    return this.apiService.get<RegistroPeso[]>("/api/registro-peso/historial", {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin
    }).pipe(
      tap(historial => this.historialPeso.set(historial))
    );
  }
}
