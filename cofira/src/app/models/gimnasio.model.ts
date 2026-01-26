export interface GenerarRutinaRequest {
  objetivoPrincipal: string;
  nivelFitness: string;
  diasEntrenamientoPorSemana: number;
  equipamientoDisponible: string[];
  genero: string;
  edad: number;
  duracionSesionMinutos?: number;
}

export interface EjercicioGenerado {
  nombre: string;
  series: number;
  repeticiones: string;
  descansoSegundos: number;
  descripcion: string;
  grupoMuscular: string;
}

export interface DiaEjercicioGenerado {
  diaSemana: string;
  grupoMuscular: string;
  ejercicios: EjercicioGenerado[];
}

export interface RutinaGenerada {
  diasEjercicio: DiaEjercicioGenerado[];
}

export interface Ejercicio {
  id: number;
  nombre: string;
  repeticiones: string;
  descanso: string;
  series: number;
  realizado: boolean | null;
  expandido: boolean;
  descripcion?: string;
  grupoMuscular?: string;
}

export interface EstadoOllama {
  conectado: boolean;
  mensaje: string;
}

export type EjerciciosPorDia = Record<string, Ejercicio[]>;
