export interface GenerarRutinaRequest {
  objetivoPrincipal: string;
  nivelFitness: string;
  diasEntrenamientoPorSemana: number;
  equipamientoDisponible: string[];
  genero: string;
  edad: number;
  duracionSesionMinutos?: number;
  pesoKg?: number;
  alturaCm?: number;
  imc?: number;
  ubicacionEntrenamiento?: string;
  lesiones?: string[];
  condicionesMedicas?: string[];
  semanaActual?: number;
  feedbackPositivo?: boolean;
  ejerciciosDificiles?: string;
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

export interface FeedbackEjercicio {
  id?: number;
  fechaFeedback?: string;
  semanaNumero: number;
  ejerciciosDificiles: string;
  puedeMasPeso: boolean;
  comentarios?: string;
  nivelFatiga?: number;
}

export interface HistorialEntrenamiento {
  id?: number;
  fechaEntrenamiento: string;
  diaSemana: string;
  nombreEjercicio: string;
  grupoMuscular?: string;
  seriesCompletadas: number;
  seriesObjetivo: number;
  repeticiones: string;
  completado: boolean;
  semanaNumero: number;
}

export interface EjercicioProgreso {
  nombreEjercicio: string;
  grupoMuscular?: string;
  seriesCompletadas: number;
  seriesObjetivo: number;
  repeticiones: string;
  completado: boolean;
}

export interface GuardarProgresoRequest {
  diaSemana: string;
  ejercicios: EjercicioProgreso[];
}

export interface EstadisticasGimnasio {
  semanaActual: number;
  ejerciciosCompletadosEstaSemana: number;
}
