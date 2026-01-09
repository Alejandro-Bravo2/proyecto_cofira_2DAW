/**
 * AUTH MODELS
 * Interfaces y tipos para el sistema de autenticación
 */

// ================================================================
// INTERFACES - Peticiones de autenticación
// ================================================================

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

// ================================================================
// INTERFACES - Respuestas de autenticación
// ================================================================

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  rol: string;
  isOnboarded: boolean;
}

// ================================================================
// INTERFACES - Usuario
// ================================================================

export interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  rol: string;
  isOnboarded: boolean;
}
