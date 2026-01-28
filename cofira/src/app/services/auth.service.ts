import {computed, inject, Injectable, signal} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {ApiService} from './api.service';
import {AuthResponse, LoginRequest, RegisterRequest, User} from '../models/auth.model';

@Injectable({providedIn: "root"})
export class AuthService {
  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly userNombre = computed(() => this.currentUser()?.nombre ?? "");
  private readonly api = inject(ApiService);

  private readonly TOKEN_KEY = "cofira_token";
  private readonly USER_KEY = "cofira_user";

  private esUsuarioValido(data: unknown): data is User {
    return (
      typeof data === "object" &&
      data !== null &&
      "id" in data &&
      "email" in data &&
      "username" in data
    );
  }

  private decodificarPayloadJWT(token: string): Record<string, unknown> | null {
    try {
      const partes = token.split(".");
      if (partes.length !== 3) return null;

      const payloadBase64 = partes[1];
      const payloadDecodificado = atob(payloadBase64);
      return JSON.parse(payloadDecodificado);
    } catch {
      return null;
    }
  }

  tokenEstaExpirado(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const payload = this.decodificarPayloadJWT(token);
    if (!payload || typeof payload["exp"] !== "number") return true;

    const ahora = Math.floor(Date.now() / 1000);
    return payload["exp"] < ahora;
  }

  constructor() {
    this.loadSession();
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.api.post<AuthResponse>('/auth/register', data).pipe(
      tap(response => {
        this.manejarExitoAutenticacion(response);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        const message = error.error?.message || "Error al crear la cuenta";
        this.error.set(message);
        throw error;
      })
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.api.post<AuthResponse>('/auth/login', data).pipe(
      tap(response => {
        this.manejarExitoAutenticacion(response);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        const message = error.error?.message || "Credenciales incorrectas";
        this.error.set(message);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  checkEmailAvailable(email: string): Observable<{ available: boolean }> {
    return this.api.get<{ available: boolean }>('/auth/check-email', {email});
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    if (this.tokenEstaExpirado()) {
      this.logout();
      return false;
    }

    return true;
  }

  private manejarExitoAutenticacion(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);

    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email,
      nombre: response.username,
      rol: response.rol,
      isOnboarded: response.isOnboarded
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadSession(): void {
    try {
      const token = this.getToken();
      const savedUser = localStorage.getItem(this.USER_KEY);

      if (!token || !savedUser) return;

      if (this.tokenEstaExpirado()) {
        this.logout();
        return;
      }

      const usuarioParseado: unknown = JSON.parse(savedUser);

      if (!this.esUsuarioValido(usuarioParseado)) {
        this.logout();
        return;
      }

      this.currentUser.set(usuarioParseado);
    } catch {
      this.logout();
    }
  }
}
