import {Injectable, inject, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap, catchError, of} from "rxjs";
import {environment} from "../../environments/environment";

export interface ConsumoAguaDTO {
  id?: number;
  fecha: string;
  litros: number;
}

export interface ActualizarAguaDTO {
  fecha: string;
  litros: number;
}

@Injectable({
  providedIn: "root"
})
export class AguaService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/consumo-agua`;

  readonly aguaConsumida = signal(0);
  readonly cargando = signal(false);

  obtenerConsumoHoy(): Observable<ConsumoAguaDTO> {
    this.cargando.set(true);

    return this.httpClient.get<ConsumoAguaDTO>(`${this.apiUrl}/hoy`).pipe(
      tap((consumo) => {
        this.aguaConsumida.set(consumo.litros);
        this.cargando.set(false);
      }),
      catchError((error) => {
        console.error("Error obteniendo consumo de agua:", error);
        this.cargando.set(false);
        return of({ fecha: new Date().toISOString().split("T")[0], litros: 0 });
      })
    );
  }

  obtenerConsumoPorFecha(fecha: string): Observable<ConsumoAguaDTO> {
    return this.httpClient.get<ConsumoAguaDTO>(`${this.apiUrl}/${fecha}`);
  }

  actualizarConsumo(litros: number): Observable<ConsumoAguaDTO> {
    const hoy = new Date().toISOString().split("T")[0];
    const dto: ActualizarAguaDTO = { fecha: hoy, litros };

    return this.httpClient.put<ConsumoAguaDTO>(this.apiUrl, dto).pipe(
      tap((consumo) => {
        this.aguaConsumida.set(consumo.litros);
      }),
      catchError((error) => {
        console.error("Error actualizando consumo de agua:", error);
        throw error;
      })
    );
  }

  agregarAgua(): void {
    const nuevoValor = this.aguaConsumida() + 0.25;
    this.actualizarConsumo(nuevoValor).subscribe();
  }

  quitarAgua(): void {
    const nuevoValor = Math.max(0, this.aguaConsumida() - 0.25);
    this.actualizarConsumo(nuevoValor).subscribe();
  }

  obtenerHistorial(fechaInicio: string, fechaFin: string): Observable<ConsumoAguaDTO[]> {
    return this.httpClient.get<ConsumoAguaDTO[]>(
      `${this.apiUrl}/historial?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }
}
