





export interface RegisterRequest {
  nombre: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}





export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  rol: string;
  isOnboarded: boolean;
}





import { Suscripcion } from "./suscripcion.model";

export interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  rol: string;
  isOnboarded: boolean;
  fechaRegistro?: string;
  peso?: number | null;
  altura?: number | null;
  objetivo?: string;
  nivelActividad?: string;
  esPro: boolean;
  suscripcion?: Suscripcion | null;
}
