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

  constructor() {
    this.loadSession();
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.api.post<AuthResponse>('/auth/register', data).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
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
        this.handleAuthSuccess(response);
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
    return !!this.getToken();
  }

  private handleAuthSuccess(response: AuthResponse): void {
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

      if (token && savedUser) {
        const user: User = JSON.parse(savedUser);
        this.currentUser.set(user);
      }
    } catch (e) {
      console.error("Error cargando sesion:", e);
      this.logout();
    }
  }
}
