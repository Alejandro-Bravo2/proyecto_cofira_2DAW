export type EstadoSuscripcion =
  | "activa"
  | "expirada"
  | "cancelada"
  | "periodo_gracia";





export interface Suscripcion {
  idSuscripcion: number;
  fechaInicio: string;
  fechaExpiracion: string;
  renovacionAutomatica: boolean;
  estadoSuscripcion: EstadoSuscripcion;
  diasRestantes: number;
  enPeriodoGracia: boolean;
}





export interface DatosPagoSimulado {
  numeroTarjeta: string;
  nombreTitular: string;
  fechaExpiracion: string;
  cvv: string;
  renovacionAutomatica: boolean;
}
