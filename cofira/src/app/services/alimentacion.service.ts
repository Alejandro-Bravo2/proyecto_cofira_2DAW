import {computed, inject, Injectable, signal} from '@angular/core';
import {catchError, Observable, of, tap} from 'rxjs';

import {ApiService} from './api.service';
import {OnboardingService} from './onboarding.service';
import {
  Alimento,
  Comida,
  ComidasPorFecha,
  DatosDelDia,
  EstadoOllamaAlimentacion,
  GenerarMenuRequest,
  MenuGenerado,
  MenuSemanalGenerado,
  ResumenNutricional,
  TipoComida,
  TipoIconoAlimento
} from '../models/alimentacion.model';


@Injectable({providedIn: 'root'})
export class AlimentacionService {
  readonly menuGenerado = signal<MenuGenerado | null>(null);
  readonly comidasPorFecha = signal<ComidasPorFecha>({});
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly estadoOllama = signal<EstadoOllamaAlimentacion | null>(null);
  readonly fechaInicio = signal<string | null>(null);
  readonly fechaFin = signal<string | null>(null);
  readonly estaGenerando = signal(false);

  readonly tieneMenu = computed(() => {
    const fechaInicioActual = this.fechaInicio();
    const fechaFinActual = this.fechaFin();
    return fechaInicioActual !== null && fechaFinActual !== null;
  });

  private readonly api = inject(ApiService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly STORAGE_KEY = 'cofira_menu_alimentacion';

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
        this.isLoading.set(false);
        this.error.set(errorCapturado.message || 'Error al generar el menu');
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
        this.isLoading.set(false);
        this.estaGenerando.set(false);
        this.error.set(errorCapturado.message || 'Error al generar el menu semanal');
        throw errorCapturado;
      })
    );
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
        next: () => console.log('Menu semanal regenerado automaticamente por dias restantes'),
        error: (errorCapturado) => console.error('Error regenerando menu:', errorCapturado)
      });
    }
  }

  verificarConexionOllama(): Observable<EstadoOllamaAlimentacion> {
    return this.api.get<EstadoOllamaAlimentacion>('/rutinas-alimentacion/ollama/estado').pipe(
      tap(estado => {
        this.estadoOllama.set(estado);
      }),
      catchError(() => {
        const estadoError: EstadoOllamaAlimentacion = {
          conectado: false,
          mensaje: 'No se puede conectar con el servidor'
        };
        this.estadoOllama.set(estadoError);
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
      const saved = localStorage.getItem('cofira_nutrition_targets');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error obteniendo nutrition targets:', e);
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
      'OMNIVORE': 'Omnivoro',
      'VEGETARIAN': 'Vegetariano',
      'VEGAN': 'Vegano',
      'PESCATARIAN': 'Pescetariano',
      'KETO': 'Cetogenica',
      'PALEO': 'Paleo',
      'MEDITERRANEAN': 'Mediterranea'
    };

    return mapaTipos[tipoDieta || ''] || 'Omnivoro';
  }

  private mapearObjetivo(objetivo: string | null): string {
    const mapaObjetivos: Record<string, string> = {
      'LOSE_WEIGHT': 'Perder grasa',
      'GAIN_MUSCLE': 'Ganar musculo',
      'MAINTAIN': 'Mantener peso',
      'IMPROVE_HEALTH': 'Mejorar salud general'
    };

    return mapaObjetivos[objetivo || ''] || 'Mejorar salud general';
  }

  private mapearGenero(genero: string | null): string {
    const mapaGeneros: Record<string, string> = {
      'MALE': 'Masculino',
      'FEMALE': 'Femenino',
      'OTHER': 'Otro'
    };

    return mapaGeneros[genero || ''] || 'Masculino';
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
      'pan': 'pan',
      'fruta': 'fruta',
      'verdura': 'verdura',
      'proteina': 'proteina',
      'lacteo': 'lacteo',
      'bebida': 'bebida',
      'cereal': 'cereal',
      'legumbre': 'legumbre',
      'fruto-seco': 'fruto-seco'
    };

    return mapaIconos[icono] || 'plato';
  }

  private mapearTipoComida(tipo: string): TipoComida {
    const mapaTipos: Record<string, TipoComida> = {
      'DESAYUNO': 'desayuno',
      'ALMUERZO': 'almuerzo',
      'COMIDA': 'comida',
      'MERIENDA': 'merienda',
      'CENA': 'cena'
    };

    return mapaTipos[tipo] || 'comida';
  }

  private formatearFecha(fecha: Date): string {
    const ano = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
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
      console.error('Error guardando menu en localStorage:', error);
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
      console.error('Error guardando menu semanal en localStorage:', error);
    }
  }

  private cargarMenuGuardado(): void {
    try {
      const menuGuardado = localStorage.getItem(this.STORAGE_KEY);

      if (menuGuardado) {
        const menuParseado = JSON.parse(menuGuardado);

        const tieneFormatoSemanal = menuParseado.fechaInicio && menuParseado.fechaFin;

        if (tieneFormatoSemanal) {
          this.cargarMenuSemanalDesdeStorage(menuParseado);
        } else {
          this.cargarMenuDiarioDesdeStorage(menuParseado);
        }
      }
    } catch (error) {
      console.error('Error cargando menu desde localStorage:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private cargarMenuSemanalDesdeStorage(menuParseado: any): void {
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
