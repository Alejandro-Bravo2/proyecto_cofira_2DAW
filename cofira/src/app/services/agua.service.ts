import {Injectable, inject, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap, catchError, of, finalize} from "rxjs";
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
  readonly actualizando = signal(false);

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
        return of({ fecha: this.obtenerFechaHoy(), litros: 0 });
      })
    );
  }

  obtenerConsumoPorFecha(fecha: string): Observable<ConsumoAguaDTO> {
    return this.httpClient.get<ConsumoAguaDTO>(`${this.apiUrl}/${fecha}`);
  }

  actualizarConsumo(litros: number): Observable<ConsumoAguaDTO> {
    const fechaHoy = this.obtenerFechaHoy();
    const dto: ActualizarAguaDTO = { fecha: fechaHoy, litros };

    this.actualizando.set(true);

    return this.httpClient.put<ConsumoAguaDTO>(this.apiUrl, dto).pipe(
      tap((consumo) => {
        this.aguaConsumida.set(consumo.litros);
      }),
      catchError((error) => {
        console.error("Error actualizando consumo de agua:", error);
        throw error;
      }),
      finalize(() => {
        this.actualizando.set(false);
      })
    );
  }

  agregarAgua(): void {
    if (this.actualizando()) {
      return;
    }

    const valorActual = this.aguaConsumida();
    const nuevoValor = Math.round((valorActual + 0.25) * 100) / 100;

    this.actualizarConsumo(nuevoValor).subscribe({
      error: () => {
        console.error("No se pudo guardar el agua consumida");
      }
    });
  }

  quitarAgua(): void {
    if (this.actualizando()) {
      return;
    }

    const valorActual = this.aguaConsumida();
    const nuevoValor = Math.max(0, Math.round((valorActual - 0.25) * 100) / 100);

    this.actualizarConsumo(nuevoValor).subscribe({
      error: () => {
        console.error("No se pudo guardar el agua consumida");
      }
    });
  }

  obtenerHistorial(fechaInicio: string, fechaFin: string): Observable<ConsumoAguaDTO[]> {
    return this.httpClient.get<ConsumoAguaDTO[]>(
      `${this.apiUrl}/historial?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }

  private obtenerFechaHoy(): string {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
  }
}
