export interface GenerarMenuRequest {
  tipoDieta: string;
  alergias: string[];
  comidasPorDia: number;
  caloriasDiarias: number;
  proteinasGramos: number;
  carbohidratosGramos: number;
  grasasGramos: number;
  objetivoPrincipal: string;
  genero: string;
  edad: number;
}

export interface AlimentoGenerado {
  nombre: string;
  cantidad: string;
  gramos: number;
  icono: string;
}

export interface ComidaGenerada {
  tipoComida: string;
  nombre: string;
  caloriasEstimadas: number;
  proteinasGramos: number;
  carbohidratosGramos: number;
  grasasGramos: number;
  alimentos: AlimentoGenerado[];
  preparacion: string;
}

export interface ResumenNutricional {
  caloriasTotal: number;
  proteinasTotal: number;
  carbohidratosTotal: number;
  grasasTotal: number;
}

export interface MenuGenerado {
  comidas: ComidaGenerada[];
  resumenNutricional: ResumenNutricional;
}

export interface MenuDia {
  fecha: string;
  numeroDia: number;
  comidas: ComidaGenerada[];
  resumenNutricional: ResumenNutricional;
}

export interface MenuSemanalGenerado {
  menusPorDia: MenuDia[];
  fechaInicio: string;
  fechaFin: string;
}

export interface EstadoIA {
  conectado: boolean;
  mensaje: string;
}

export type TipoIconoAlimento = "pizza" | "bebida" | "plato" | "pan" | "fruta" | "verdura" | "proteina" | "lacteo" | "cereal" | "legumbre" | "fruto-seco";

export interface Alimento {
  id: number;
  descripcion: string;
  icono: TipoIconoAlimento;
  ingredientes?: string[];
  cantidad?: string;
  gramos?: number;
}

export type TipoComida = "desayuno" | "almuerzo" | "comida" | "merienda" | "cena";

export interface Comida {
  id: number;
  tipo: TipoComida;
  nombre: string;
  caloriasEstimadas: number;
  proteinasGramos: number;
  carbohidratosGramos: number;
  grasasGramos: number;
  alimentos: Alimento[];
  preparacion?: string;
}

export interface DatosDelDia {
  comidas: Comida[];
  resumenNutricional: ResumenNutricional | null;
}

export type ComidasPorFecha = Record<string, DatosDelDia>;

export interface EventoInicioStream {
  tipo: 'inicio';
  totalDias: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface EventoFinStream {
  tipo: 'completado';
}

export interface EventoErrorStream {
  tipo: 'error';
  mensaje: string;
}

export interface ProgresoGeneracion {
  diasGenerados: number;
  totalDias: number;
  porcentaje: number;
}
