





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





export interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  rol: string;
  isOnboarded: boolean;
}
