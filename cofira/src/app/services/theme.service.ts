import {Injectable, signal} from '@angular/core';

/**
 * THEME SERVICE
 * Gestiona el tema claro/oscuro de la aplicacion
 *
 * Caracteristicas:
 * - Detecta automaticamente preferencia del sistema (prefers-color-scheme)
 * - Persiste preferencia del usuario en localStorage
 * - Escucha cambios en la preferencia del sistema en tiempo real
 */
@Injectable({providedIn: 'root'})
export class ThemeService {
  private readonly STORAGE_KEY = 'cofira_theme';

  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
    this.watchSystemPreference();
  }

  /**
   * Inicializa el tema al cargar la aplicacion
   * Prioridad: 1. Preferencia guardada, 2. Preferencia del sistema
   */
  private initTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved) {
      // Usuario tiene preferencia guardada
      this.setTheme(saved === 'dark');
    } else {
      // Usar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark);
    }
  }

  /**
   * Escucha cambios en la preferencia del sistema
   * Solo aplica si el usuario no ha guardado una preferencia manual
   */
  private watchSystemPreference(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
      // Solo cambiar si el usuario no tiene preferencia guardada
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.setTheme(e.matches);
      }
    });
  }

  /**
   * Alterna entre tema claro y oscuro
   * Guarda la preferencia del usuario
   */
  toggle(): void {
    const newValue = !this.isDarkMode();
    this.setTheme(newValue);
    localStorage.setItem(this.STORAGE_KEY, newValue ? 'dark' : 'light');
  }

  /**
   * Establece el tema y actualiza la clase del body
   */
  private setTheme(dark: boolean): void {
    this.isDarkMode.set(dark);
    document.body.classList.toggle('modo-oscuro', dark);
  }

  /**
   * Resetea a la preferencia del sistema
   * Elimina la preferencia guardada del usuario
   */
  resetToSystemPreference(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(prefersDark);
  }
}
