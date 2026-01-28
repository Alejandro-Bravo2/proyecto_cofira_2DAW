import {computed, inject, Injectable, NgZone, signal} from '@angular/core';
import {catchError, Observable, of, tap} from 'rxjs';

import {ApiService} from './api.service';
import {OnboardingService} from './onboarding.service';
import {environment} from '../../environments/environment';
import {
  Alimento,
  Comida,
  ComidasPorFecha,
  DatosDelDia,
  EstadoIA,
  EventoErrorStream,
  EventoInicioStream,
  GenerarMenuRequest,
  MenuDia,
  MenuGenerado,
  MenuGuardado,
  MenuSemanalGenerado,
  ProgresoGeneracion,
  ResumenNutricional,
  TipoComida,
  TipoIconoAlimento
} from '../models/alimentacion.model';


@Injectable({providedIn: "root"})
export class AlimentacionService {
  readonly menuGenerado = signal<MenuGenerado | null>(null);
  readonly comidasPorFecha = signal<ComidasPorFecha>({});
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly estadoIA = signal<EstadoIA | null>(null);
  readonly fechaInicio = signal<string | null>(null);
  readonly fechaFin = signal<string | null>(null);
  readonly estaGenerando = signal(false);
  readonly progresoGeneracion = signal<ProgresoGeneracion | null>(null);
  readonly cargaInicialCompletada = signal(false);

  readonly tieneMenu = computed(() => {
    const fechaInicioActual = this.fechaInicio();
    const fechaFinActual = this.fechaFin();
    return fechaInicioActual !== null && fechaFinActual !== null;
  });

  private readonly api = inject(ApiService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly ngZone = inject(NgZone);
  private readonly STORAGE_KEY = "cofira_menu_alimentacion";
  private readonly SSE_TIMEOUT_MS = 120000;
  private eventoStreamActivo: EventSource | null = null;
  private timeoutSSE: ReturnType<typeof setTimeout> | null = null;

  private esMenuSemanalValido(data: unknown): data is MenuGuardado {
    if (typeof data !== "object" || data === null) return false;

    const obj = data as Record<string, unknown>;
    return (
      "fechaInicio" in obj &&
      "fechaFin" in obj &&
      "comidasPorFecha" in obj &&
      typeof obj["fechaInicio"] === "string" &&
      typeof obj["fechaFin"] === "string"
    );
  }

  private esMenuDiarioValido(data: unknown): boolean {
    return (
      typeof data === "object" &&
      data !== null &&
      "menu" in data &&
      "fecha" in data
    );
  }

  constructor() {
    this.cargarMenuGuardado();
  }

  generarMenu(): Observable<MenuGenerado> {
    this.isLoading.set(true);
    this.error.set(null);

    const datosOnboarding = this.onboardingService.formData();
    const solicitudMenu = this.construirSolicitudMenu(datosOnboarding);

    return this.api.post<MenuGenerado>('/rutinas-alimentacion/generar-menu', solicitudMenu).pipe(
      tap(menu => {
        this.menuGenerado.set(menu);
        const fechaActual = this.obtenerFechaActualString();
        const comidasTransformadas = this.transformarMenuAComidas(menu);
        this.comidasPorFecha.update(comidas => ({
          ...comidas,
          [fechaActual]: {
            comidas: comidasTransformadas,
            resumenNutricional: menu.resumenNutricional
          }
        }));
        this.guardarMenuEnStorage(menu);
        this.isLoading.set(false);
      }),
      catchError(errorCapturado => {
        console.error("Error generando menú:", errorCapturado);
        this.isLoading.set(false);
        this.error.set("No hemos podido generar tu menú. Inténtalo de nuevo en unos minutos.");
        throw errorCapturado;
      })
    );
  }

  generarMenuSemanal(): Observable<MenuSemanalGenerado> {
    if (this.estaGenerando()) {
      return of({} as MenuSemanalGenerado);
    }

    this.isLoading.set(true);
    this.estaGenerando.set(true);
    this.error.set(null);

    const datosOnboarding = this.onboardingService.formData();
    const solicitudMenu = this.construirSolicitudMenu(datosOnboarding);

    return this.api.post<MenuSemanalGenerado>('/rutinas-alimentacion/generar-menu-semanal', solicitudMenu).pipe(
      tap(menuSemanal => {
        this.procesarMenuSemanal(menuSemanal);
        this.guardarMenuSemanalEnStorage(menuSemanal);
        this.isLoading.set(false);
        this.estaGenerando.set(false);
      }),
      catchError(errorCapturado => {
        console.error("Error generando menú semanal:", errorCapturado);
        this.isLoading.set(false);
        this.estaGenerando.set(false);
        this.error.set("No hemos podido generar tu menú. Inténtalo de nuevo en unos minutos.");
        throw errorCapturado;
      })
    );
  }

  generarMenuSemanalConStreaming(): void {
    if (this.estaGenerando()) {
      return;
    }

    this.isLoading.set(true);
    this.estaGenerando.set(true);
    this.error.set(null);
    this.progresoGeneracion.set(null);
    this.comidasPorFecha.set({});

    const datosOnboarding = this.onboardingService.formData();
    const solicitudMenu = this.construirSolicitudMenu(datosOnboarding);

    const token = localStorage.getItem("cofira_token");
    const urlEndpoint = `${environment.apiUrl}/rutinas-alimentacion/generar-menu-semanal-stream`;

    if (this.eventoStreamActivo) {
      this.eventoStreamActivo.close();
    }

    this.ngZone.runOutsideAngular(() => {
      this.iniciarConexionSSE(urlEndpoint, solicitudMenu, token);
    });
  }

  private async iniciarConexionSSE(urlEndpoint: string, solicitudMenu: GenerarMenuRequest, token: string | null): Promise<void> {
    const controladorAbort = new AbortController();

    this.timeoutSSE = setTimeout(() => {
      controladorAbort.abort();
      this.ngZone.run(() => {
        this.error.set("La generación del menú tardó demasiado. Inténtalo de nuevo.");
        this.isLoading.set(false);
        this.estaGenerando.set(false);
      });
    }, this.SSE_TIMEOUT_MS);

    try {
      const respuesta = await fetch(urlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(solicitudMenu),
        signal: controladorAbort.signal
      });

      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }

      const lectorStream = respuesta.body?.getReader();
      if (!lectorStream) {
        throw new Error("No se pudo obtener el lector del stream");
      }

      const decodificador = new TextDecoder();
      let bufferDatos = "";
      let lecturaActiva = true;

      while (lecturaActiva) {
        const resultado = await lectorStream.read();

        if (resultado.done) {
          this.limpiarTimeoutSSE();
          this.ngZone.run(() => {
            this.finalizarGeneracion();
          });
          lecturaActiva = false;
          break;
        }

        bufferDatos += decodificador.decode(resultado.value, {stream: true});
        const lineas = bufferDatos.split("\n");
        bufferDatos = lineas.pop() || "";

        for (const linea of lineas) {
          this.procesarLineaSSE(linea);
        }
      }
    } catch (errorCapturado) {
      this.limpiarTimeoutSSE();
      if ((errorCapturado as Error).name === "AbortError") {
        return;
      }
      this.ngZone.run(() => {
        this.error.set("No hemos podido generar tu menú. Inténtalo de nuevo en unos minutos.");
        this.isLoading.set(false);
        this.estaGenerando.set(false);
      });
    }
  }

  private limpiarTimeoutSSE(): void {
    if (this.timeoutSSE) {
      clearTimeout(this.timeoutSSE);
      this.timeoutSSE = null;
    }
  }

  private procesarLineaSSE(linea: string): void {
    if (linea.startsWith("data:")) {
      const datosJson = linea.substring(5).trim();
      if (!datosJson) {
        return;
      }

      try {
        const datosParseados = JSON.parse(datosJson);
        this.ngZone.run(() => {
          this.procesarEventoSSE(datosParseados);
        });
      } catch (errorParseo) {
        console.error("Error parseando evento SSE:", errorParseo);
      }
    }
  }

  private procesarEventoSSE(datos: unknown): void {
    const datosConTipo = datos as { tipo?: string; fecha?: string; numeroDia?: number };

    if (datosConTipo.tipo === "inicio") {
      const eventoInicio = datos as EventoInicioStream;
      this.fechaInicio.set(eventoInicio.fechaInicio);
      this.fechaFin.set(eventoInicio.fechaFin);
      const totalDias = parseInt(eventoInicio.totalDias, 10);
      this.progresoGeneracion.set({
        diasGenerados: 0,
        totalDias: totalDias,
        porcentaje: 0
      });
      return;
    }

    if (datosConTipo.tipo === "completado") {
      this.finalizarGeneracion();
      return;
    }

    if (datosConTipo.tipo === "error") {
      const eventoError = datos as EventoErrorStream;
      console.error("Error del servidor:", eventoError.mensaje);
      this.error.set("No hemos podido generar tu menú. Inténtalo de nuevo en unos minutos.");
      this.isLoading.set(false);
      this.estaGenerando.set(false);
      return;
    }

    if (datosConTipo.fecha && datosConTipo.numeroDia !== undefined) {
      const menuDia = datos as MenuDia;
      this.procesarMenuDiaRecibido(menuDia);
    }
  }

  private procesarMenuDiaRecibido(menuDia: MenuDia): void {
    const menuParaTransformar: MenuGenerado = {
      comidas: menuDia.comidas,
      resumenNutricional: menuDia.resumenNutricional
    };
    const comidasTransformadas = this.transformarMenuAComidas(menuParaTransformar);

    this.comidasPorFecha.update(comidasActuales => ({
      ...comidasActuales,
      [menuDia.fecha]: {
        comidas: comidasTransformadas,
        resumenNutricional: menuDia.resumenNutricional
      }
    }));

    const progresoActual = this.progresoGeneracion();
    if (progresoActual) {
      const diasGenerados = menuDia.numeroDia;
      const porcentajeCalculado = Math.round((diasGenerados / progresoActual.totalDias) * 100);
      this.progresoGeneracion.set({
        diasGenerados: diasGenerados,
        totalDias: progresoActual.totalDias,
        porcentaje: porcentajeCalculado
      });
    }
  }

  private finalizarGeneracion(): void {
    this.isLoading.set(false);
    this.estaGenerando.set(false);
    this.progresoGeneracion.set(null);
    this.guardarMenuStreamEnStorage();
    this.guardarMenuEnBaseDeDatos();
  }

  private guardarMenuStreamEnStorage(): void {
    try {
      const menuSemanalParaGuardar = {
        fechaInicio: this.fechaInicio(),
        fechaFin: this.fechaFin(),
        comidasPorFecha: this.comidasPorFecha()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(menuSemanalParaGuardar));
    } catch (error) {
      console.error("Error guardando menú en localStorage:", error);
    }
  }

  private guardarMenuEnBaseDeDatos(): void {
    const fechaInicioActual = this.fechaInicio();
    const fechaFinActual = this.fechaFin();
    const comidasActuales = this.comidasPorFecha();

    console.log("[DB] Intentando guardar menú en base de datos...");
    console.log("[DB] fechaInicio:", fechaInicioActual);
    console.log("[DB] fechaFin:", fechaFinActual);
    console.log("[DB] Tiene comidas:", Object.keys(comidasActuales).length > 0);

    if (!fechaInicioActual || !fechaFinActual) {
      console.warn("[DB] ABORTANDO: No hay fechas disponibles para guardar");
      return;
    }

    const menuParaGuardar = {
      fechaInicio: fechaInicioActual,
      fechaFin: fechaFinActual,
      comidasPorFecha: comidasActuales
    };
    const menuJson = JSON.stringify(menuParaGuardar);

    const solicitud = {
      menuJson: menuJson,
      fechaInicio: fechaInicioActual,
      fechaFin: fechaFinActual
    };

    console.log("[DB] Enviando POST /guardar-menu con solicitud:", {
      fechaInicio: fechaInicioActual,
      fechaFin: fechaFinActual,
      menuJsonLength: menuJson.length
    });

    this.api.post<{ mensaje: string }>("/rutinas-alimentacion/guardar-menu", solicitud).subscribe({
      next: () => console.log("[DB] SUCCESS: Menú guardado en base de datos correctamente"),
      error: (errorCapturado) => {
        console.error("[DB] ERROR guardando menú en base de datos:", errorCapturado);
        console.error("[DB] Status:", errorCapturado.status);
        console.error("[DB] Message:", errorCapturado.message);
      }
    });
  }

  cargarMenuDesdeBaseDeDatos(): void {
    console.log("[DB] Intentando cargar menú desde base de datos...");

    this.api.get<{ tieneMenu: boolean; menuJson?: string }>("/rutinas-alimentacion/mi-menu").subscribe({
      next: (respuesta) => {
        console.log("[DB] Respuesta del servidor:", respuesta);

        if (respuesta.tieneMenu && respuesta.menuJson) {
          try {
            const menuParseado: MenuGuardado = JSON.parse(respuesta.menuJson);
            this.fechaInicio.set(menuParseado.fechaInicio);
            this.fechaFin.set(menuParseado.fechaFin);
            this.comidasPorFecha.set(menuParseado.comidasPorFecha);
            localStorage.setItem(this.STORAGE_KEY, respuesta.menuJson);
            console.log("[DB] SUCCESS: Menú cargado desde base de datos");
            console.log("[DB] Días cargados:", Object.keys(menuParseado.comidasPorFecha).length);
            this.cargaInicialCompletada.set(true);
          } catch (errorParseo) {
            console.error("[DB] ERROR parseando menú:", errorParseo);
            this.cargarMenuDesdeLocalStorage();
            this.cargaInicialCompletada.set(true);
          }
        } else {
          console.log("[DB] No hay menú en base de datos, usando localStorage");
          this.cargarMenuDesdeLocalStorage();
          this.cargaInicialCompletada.set(true);
        }
      },
      error: (errorCapturado) => {
        console.error("[DB] ERROR cargando menú:", errorCapturado);
        console.error("[DB] Status:", errorCapturado.status);
        this.cargarMenuDesdeLocalStorage();
        this.cargaInicialCompletada.set(true);
      }
    });
  }

  private cargarMenuDesdeLocalStorage(): void {
    try {
      const menuGuardado = localStorage.getItem(this.STORAGE_KEY);

      if (!menuGuardado) return;

      const menuParseado: unknown = JSON.parse(menuGuardado);

      if (this.esMenuSemanalValido(menuParseado)) {
        this.cargarMenuSemanalDesdeStorage(menuParseado);
      } else if (this.esMenuDiarioValido(menuParseado)) {
        this.cargarMenuDiarioDesdeStorage(menuParseado);
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  cancelarGeneracion(): void {
    if (this.eventoStreamActivo) {
      this.eventoStreamActivo.close();
      this.eventoStreamActivo = null;
    }
    this.isLoading.set(false);
    this.estaGenerando.set(false);
    this.progresoGeneracion.set(null);
  }

  private procesarMenuSemanal(menuSemanal: MenuSemanalGenerado): void {
    const nuevasComidasPorFecha: ComidasPorFecha = {};

    menuSemanal.menusPorDia.forEach(menuDia => {
      const menuParaTransformar: MenuGenerado = {
        comidas: menuDia.comidas,
        resumenNutricional: menuDia.resumenNutricional
      };
      const comidasTransformadas = this.transformarMenuAComidas(menuParaTransformar);

      nuevasComidasPorFecha[menuDia.fecha] = {
        comidas: comidasTransformadas,
        resumenNutricional: menuDia.resumenNutricional
      };
    });

    this.comidasPorFecha.set(nuevasComidasPorFecha);
    this.fechaInicio.set(menuSemanal.fechaInicio);
    this.fechaFin.set(menuSemanal.fechaFin);
  }

  verificarYRegenerarSiNecesario(): void {
    const fechaFinActual = this.fechaFin();
    if (!fechaFinActual || this.estaGenerando()) {
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fin = new Date(fechaFinActual);

    const diferenciaEnMilisegundos = fin.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

    if (diasRestantes <= 5) {
      this.generarMenuSemanal().subscribe({
        next: () => console.log("Menu semanal regenerado automaticamente por dias restantes"),
        error: (errorCapturado) => console.error("Error regenerando menu:", errorCapturado)
      });
    }
  }

  verificarConexionIA(): Observable<EstadoIA> {
    return this.api.get<EstadoIA>('/rutinas-alimentacion/ia/estado').pipe(
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

  obtenerComidasDelDia(fecha: Date): Comida[] {
    const datosDelDia = this.obtenerDatosDelDia(fecha);
    return datosDelDia?.comidas ?? [];
  }

  obtenerDatosDelDia(fecha: Date): DatosDelDia | null {
    const fechaString = this.formatearFecha(fecha);
    const datosActuales = this.comidasPorFecha();
    return datosActuales[fechaString] ?? null;
  }

  obtenerResumenDelDia(fecha: Date): ResumenNutricional | null {
    const datosDelDia = this.obtenerDatosDelDia(fecha);
    return datosDelDia?.resumenNutricional ?? null;
  }

  obtenerResumenSemanal(): ResumenNutricional & { diasConDatos: number } {
    const comidas = this.comidasPorFecha();
    let totalCalorias = 0;
    let totalProteinas = 0;
    let totalCarbohidratos = 0;
    let totalGrasas = 0;
    let diasConDatos = 0;

    Object.values(comidas).forEach(dia => {
      if (dia.resumenNutricional) {
        totalCalorias += dia.resumenNutricional.caloriasTotal;
        totalProteinas += dia.resumenNutricional.proteinasTotal;
        totalCarbohidratos += dia.resumenNutricional.carbohidratosTotal;
        totalGrasas += dia.resumenNutricional.grasasTotal;
        diasConDatos++;
      }
    });

    return {
      caloriasTotal: totalCalorias,
      proteinasTotal: totalProteinas,
      carbohidratosTotal: totalCarbohidratos,
      grasasTotal: totalGrasas,
      diasConDatos: diasConDatos
    };
  }

  limpiarMenu(): void {
    this.menuGenerado.set(null);
    this.comidasPorFecha.set({});
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private construirSolicitudMenu(datosOnboarding: any): GenerarMenuRequest {
    const edadCalculada = this.calcularEdad(datosOnboarding.birthDate);
    const tipoDietaMapeado = this.mapearTipoDieta(datosOnboarding.dietType);
    const objetivoMapeado = this.mapearObjetivo(datosOnboarding.primaryGoal);
    const generoMapeado = this.mapearGenero(datosOnboarding.gender);
    const nutritionTargets = this.obtenerNutritionTargets();

    const solicitud: GenerarMenuRequest = {
      tipoDieta: tipoDietaMapeado,
      alergias: datosOnboarding.allergies || [],
      comidasPorDia: datosOnboarding.mealsPerDay || 4,
      caloriasDiarias: nutritionTargets?.dailyCalories || 2000,
      proteinasGramos: nutritionTargets?.proteinGrams || 120,
      carbohidratosGramos: nutritionTargets?.carbsGrams || 250,
      grasasGramos: nutritionTargets?.fatGrams || 65,
      objetivoPrincipal: objetivoMapeado,
      genero: generoMapeado,
      edad: edadCalculada
    };

    return solicitud;
  }

  private obtenerNutritionTargets(): any {
    try {
      const saved = localStorage.getItem("cofira_nutrition_targets");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error obteniendo nutrition targets:", e);
    }
    return null;
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

  private mapearTipoDieta(tipoDieta: string | null): string {
    const mapaTipos: Record<string, string> = {
      "OMNIVORE": "Omnivoro",
      "VEGETARIAN": "Vegetariano",
      "VEGAN": "Vegano",
      "PESCATARIAN": "Pescetariano",
      "KETO": "Cetogenica",
      "PALEO": "Paleo",
      "MEDITERRANEAN": "Mediterranea"
    };

    return mapaTipos[tipoDieta || ""] || "Omnivoro";
  }

  private mapearObjetivo(objetivo: string | null): string {
    const mapaObjetivos: Record<string, string> = {
      "LOSE_WEIGHT": "Perder grasa",
      "GAIN_MUSCLE": "Ganar musculo",
      "MAINTAIN": "Mantener peso",
      "IMPROVE_HEALTH": "Mejorar salud general"
    };

    return mapaObjetivos[objetivo || ""] || "Mejorar salud general";
  }

  private mapearGenero(genero: string | null): string {
    const mapaGeneros: Record<string, string> = {
      "MALE": "Masculino",
      "FEMALE": "Femenino",
      "OTHER": "Otro"
    };

    return mapaGeneros[genero || ""] || "Masculino";
  }

  private transformarMenuAComidas(menu: MenuGenerado): Comida[] {
    let contadorIdGlobal = 1;
    let contadorIdAlimento = 1;

    const comidasTransformadas: Comida[] = menu.comidas.map(comidaGenerada => {
      const alimentosTransformados: Alimento[] = comidaGenerada.alimentos.map(alimentoGenerado => {
        const alimentoTransformado: Alimento = {
          id: contadorIdAlimento++,
          descripcion: `${alimentoGenerado.cantidad} de ${alimentoGenerado.nombre}`,
          icono: this.mapearIcono(alimentoGenerado.icono),
          cantidad: alimentoGenerado.cantidad,
          gramos: alimentoGenerado.gramos
        };

        return alimentoTransformado;
      });

      const comidaTransformada: Comida = {
        id: contadorIdGlobal++,
        tipo: this.mapearTipoComida(comidaGenerada.tipoComida),
        nombre: comidaGenerada.nombre,
        caloriasEstimadas: comidaGenerada.caloriasEstimadas,
        proteinasGramos: comidaGenerada.proteinasGramos,
        carbohidratosGramos: comidaGenerada.carbohidratosGramos,
        grasasGramos: comidaGenerada.grasasGramos,
        alimentos: alimentosTransformados,
        preparacion: comidaGenerada.preparacion
      };

      return comidaTransformada;
    });

    return comidasTransformadas;
  }

  private mapearIcono(icono: string): TipoIconoAlimento {
    const mapaIconos: Record<string, TipoIconoAlimento> = {
      "pan": "pan",
      "fruta": "fruta",
      "verdura": "verdura",
      "proteina": "proteina",
      "lacteo": "lacteo",
      "bebida": "bebida",
      "cereal": "cereal",
      "legumbre": "legumbre",
      "fruto-seco": "fruto-seco"
    };

    return mapaIconos[icono] || "plato";
  }

  private mapearTipoComida(tipo: string): TipoComida {
    const mapaTipos: Record<string, TipoComida> = {
      "DESAYUNO": "desayuno",
      "ALMUERZO": "almuerzo",
      "COMIDA": "comida",
      "MERIENDA": "merienda",
      "CENA": "cena"
    };

    return mapaTipos[tipo] || "comida";
  }

  private formatearFecha(fecha: Date): string {
    const ano = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  private obtenerFechaActualString(): string {
    return this.formatearFecha(new Date());
  }

  private guardarMenuEnStorage(menu: MenuGenerado): void {
    try {
      const fechaActual = this.obtenerFechaActualString();
      const menuConFecha = {
        menu: menu,
        fecha: fechaActual
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(menuConFecha));
    } catch (error) {
      console.error("Error guardando menu en localStorage:", error);
    }
  }

  private guardarMenuSemanalEnStorage(menuSemanal: MenuSemanalGenerado): void {
    try {
      const menuSemanalParaGuardar = {
        menusPorDia: menuSemanal.menusPorDia,
        fechaInicio: menuSemanal.fechaInicio,
        fechaFin: menuSemanal.fechaFin,
        comidasPorFecha: this.comidasPorFecha()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(menuSemanalParaGuardar));
    } catch (error) {
      console.error("Error guardando menu semanal en localStorage:", error);
    }
  }

  private cargarMenuGuardado(): void {
    const token = localStorage.getItem("cofira_token");
    const estaAutenticado = token !== null && token !== "";

    if (estaAutenticado) {
      this.cargarMenuDesdeBaseDeDatos();
    } else {
      this.cargarMenuDesdeLocalStorage();
      this.cargaInicialCompletada.set(true);
    }
  }

  private cargarMenuSemanalDesdeStorage(menuParseado: MenuGuardado): void {
    const fechaFinGuardada = new Date(menuParseado.fechaFin);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const menuSigueVigente = fechaFinGuardada >= hoy;

    if (menuSigueVigente && menuParseado.comidasPorFecha) {
      this.fechaInicio.set(menuParseado.fechaInicio);
      this.fechaFin.set(menuParseado.fechaFin);
      this.comidasPorFecha.set(menuParseado.comidasPorFecha);
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private cargarMenuDiarioDesdeStorage(menuParseado: any): void {
    const fechaActual = this.obtenerFechaActualString();

    if (menuParseado.fecha === fechaActual) {
      this.menuGenerado.set(menuParseado.menu);
      const comidasTransformadas = this.transformarMenuAComidas(menuParseado.menu);
      this.comidasPorFecha.set({
        [fechaActual]: {
          comidas: comidasTransformadas,
          resumenNutricional: menuParseado.menu.resumenNutricional
        }
      });
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
