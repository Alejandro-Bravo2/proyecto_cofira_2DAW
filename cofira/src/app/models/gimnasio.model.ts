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
  pesoSugeridoKg?: number;
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
  pesoKg?: number;
}

export interface EstadoIA {
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
  pesoKg?: number;
  semanaNumero: number;
}

export interface EjercicioProgreso {
  nombreEjercicio: string;
  grupoMuscular?: string;
  seriesCompletadas: number;
  seriesObjetivo: number;
  repeticiones: string;
  completado: boolean;
  pesoKg?: number;
}

export interface ObjetivosNutricionales {
  calculatedBMR: number;
  calculatedTDEE: number;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
}

export interface PuntoGraficoFuerza {
  fecha: string;
  pesoKg: number;
}

export interface GuardarProgresoRequest {
  diaSemana: string;
  ejercicios: EjercicioProgreso[];
}

export interface EstadisticasGimnasio {
  semanaActual: number;
  ejerciciosCompletadosEstaSemana: number;
}
