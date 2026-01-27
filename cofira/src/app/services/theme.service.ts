import {Injectable, signal} from '@angular/core';


@Injectable({providedIn: "root"})
export class ThemeService {
  private readonly STORAGE_KEY = "cofira_theme";

  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
    this.watchSystemPreference();
  }

  private initTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved) {
      this.setTheme(saved === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.setTheme(prefersDark);
    }
  }

  private watchSystemPreference(): void {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.setTheme(e.matches);
      }
    });
  }

  toggle(): void {
    const newValue = !this.isDarkMode();
    this.setTheme(newValue);
    localStorage.setItem(this.STORAGE_KEY, newValue ? "dark" : "light");
  }

  private setTheme(dark: boolean): void {
    this.isDarkMode.set(dark);
    const temaActual = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", temaActual);
  }

  resetToSystemPreference(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.setTheme(prefersDark);
  }
}
