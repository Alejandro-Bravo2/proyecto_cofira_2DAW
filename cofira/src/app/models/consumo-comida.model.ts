import {TipoComida} from './alimentacion.model';

export interface RegistroComida {
  id: number;
  fecha: string;
  tipoComida: TipoComida;
  comidaMenuId: number | null;
  consumioMenu: boolean;
  comidaAlternativa: ComidaAlternativa | null;
  imagenUrl: string | null;
  caloriasReales: number | null;
  proteinasReales: number | null;
  carbohidratosReales: number | null;
  grasasReales: number | null;
  creadoEn: string;
}

export interface ComidaAlternativa {
  nombre: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  fecha?: string;
  tipoComida?: string;
}

export interface AnalisisImagen {
  nombreComida: string;
  caloriasEstimadas: number;
  proteinasGramos: number;
  carbohidratosGramos: number;
  grasasGramos: number;
  ingredientesDetectados: string[];
  confianza: "alta" | "media" | "baja";
}

export interface ResumenNutricionalReal {
  caloriasConsumidas: number;
  proteinasConsumidas: number;
  carbohidratosConsumidos: number;
  grasasConsumidas: number;
  comidasRegistradas: number;
  totalComidas: number;
}

export interface MarcarComidaConsumidaRequest {
  fecha: string;
  tipoComida: string;
  comidaMenuId: number;
  consumioMenu: boolean;
  caloriasReales: number;
  proteinasReales: number;
  carbohidratosReales: number;
  grasasReales: number;
}

export interface AnalizarImagenRequest {
  imagenBase64: string;
  fecha: string;
  tipoComida: string;
}

export type RegistrosPorTipoComida = Record<string, RegistroComida>;
