import {computed, inject, Injectable, signal} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {ApiService} from './api.service';
import {
  Alimento,
  DEFAULT_ONBOARDING_DATA,
  NutritionTargets,
  OnboardingData,
  OnboardingProgress,
  OnboardingResponse
} from '../models/onboarding.model';


@Injectable({providedIn: "root"})
export class OnboardingService {
  readonly currentStep = signal(0);
  readonly formData = signal<Partial<OnboardingData>>(DEFAULT_ONBOARDING_DATA);
  readonly completedSteps = signal<number[]>([]);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly canGoBack = computed(() => {
    return this.currentStep() > 0;
  });
  private readonly api = inject(ApiService);
  private readonly STORAGE_KEY = "cofira_onboarding_progress";

  private esProgresoValido(data: unknown): data is OnboardingProgress {
    if (typeof data !== "object" || data === null) return false;

    const obj = data as Record<string, unknown>;
    return (
      "currentStep" in obj &&
      "completedSteps" in obj &&
      typeof obj["currentStep"] === "number" &&
      Array.isArray(obj["completedSteps"])
    );
  }

  private readonly TOTAL_STEPS = 16;
  readonly progress = computed(() => {
    return Math.round((this.completedSteps().length / this.TOTAL_STEPS) * 100);
  });
  readonly isComplete = computed(() => {
    return this.completedSteps().length === this.TOTAL_STEPS;
  });
  readonly canGoForward = computed(() => {
    return this.currentStep() < this.TOTAL_STEPS - 1;
  });

  constructor() {
    this.loadProgress();
  }

  goToStep(step: number): void {
    if (step >= 0 && step < this.TOTAL_STEPS) {
      this.currentStep.set(step);
      this.saveProgress();
    }
  }

  nextStep(): void {
    if (this.canGoForward()) {
      this.markStepComplete(this.currentStep());
      this.currentStep.update(s => s + 1);
      this.saveProgress();
    }
  }

  previousStep(): void {
    if (this.canGoBack()) {
      this.currentStep.update(s => s - 1);
      this.saveProgress();
    }
  }

  markStepComplete(step: number): void {
    this.completedSteps.update(steps => {
      if (!steps.includes(step)) {
        return [...steps, step];
      }
      return steps;
    });
  }

  updateData(data: Partial<OnboardingData>): void {
    this.formData.update(current => ({
      ...current,
      ...data
    }));
    this.saveProgress();
  }

  setField<K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K]
  ): void {
    this.formData.update(current => ({
      ...current,
      [field]: value
    }));
    this.saveProgress();
  }

  saveProgress(): void {
    const progress: OnboardingProgress = {
      currentStep: this.currentStep(),
      completedSteps: this.completedSteps(),
      data: this.formData(),
      lastUpdated: new Date().toISOString()
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error("Error guardando progreso de onboarding:", e);
    }
  }

  loadProgress(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return;

      const parsed: unknown = JSON.parse(saved);

      if (!this.esProgresoValido(parsed)) {
        this.clearProgress();
        return;
      }

      this.currentStep.set(parsed.currentStep);
      this.completedSteps.set(parsed.completedSteps);
      this.formData.set({...DEFAULT_ONBOARDING_DATA, ...parsed.data});
    } catch {
      this.clearProgress();
    }
  }

  clearProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentStep.set(0);
    this.completedSteps.set([]);
    this.formData.set(DEFAULT_ONBOARDING_DATA);
  }

  searchAlimentos(query: string): Observable<Alimento[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    return this.api.get<Alimento[]>("/alimentos", {nombre: query}).pipe(
      catchError(error => {
        console.error("Error buscando alimentos:", error);
        return of([]);
      })
    );
  }

  completeOnboarding(): Observable<OnboardingResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    const data = this.formData();

    return this.api.post<OnboardingResponse>("/onboarding/complete", data).pipe(
      tap(response => {
        this.isLoading.set(false);
        if (response.isOnboarded) {
          this.clearProgress();
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        this.error.set(error.message || "Error al completar el onboarding");
        throw error;
      })
    );
  }

  getNutritionTargets(): Observable<NutritionTargets> {
    return this.api.get<NutritionTargets>("/onboarding/nutrition-targets");
  }

  checkOnboardingStatus(): Observable<boolean> {
    return this.api.get<boolean>("/onboarding/status");
  }

  getTotalSteps(): number {
    return this.TOTAL_STEPS;
  }

  getStepTitle(step: number): string {
    const titles: Record<number, string> = {
      0: "Bienvenida",
      1: "Objetivo",
      2: "Genero",
      3: "Fecha de nacimiento",
      4: "Medidas corporales",
      5: "Peso objetivo",
      6: "Nivel de actividad",
      7: "Nivel de experiencia",
      8: "Dias de entrenamiento",
      9: "Tipo de dieta",
      10: "Comidas al dia",
      11: "Alergias",
      12: "Equipamiento",
      13: "Resultados",
      14: "Registro",
      15: "Suscripcion PRO"
    };

    return titles[step] || "";
  }
}
