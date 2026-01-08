/**
 * ONBOARDING MODELS
 * Interfaces y tipos para el sistema de onboarding
 */

// ================================================================
// ENUMS - Tipos de datos del onboarding
// ================================================================

export type PrimaryGoal = 'LOSE_WEIGHT' | 'GAIN_MUSCLE' | 'MAINTAIN' | 'IMPROVE_HEALTH';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type ActivityLevel =
  | 'SEDENTARY'
  | 'LIGHTLY_ACTIVE'
  | 'MODERATELY_ACTIVE'
  | 'VERY_ACTIVE'
  | 'EXTRA_ACTIVE';

export type WorkType =
  | 'SEDENTARY'
  | 'LIGHTLY_ACTIVE'
  | 'MODERATELY_ACTIVE'
  | 'VERY_ACTIVE';

export type FitnessLevel =
  | 'SEDENTARY'
  | 'NOVICE'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'ATHLETE';

export type DietType =
  | 'OMNIVORE'
  | 'VEGETARIAN'
  | 'VEGAN'
  | 'PESCATARIAN'
  | 'KETO'
  | 'PALEO'
  | 'MEDITERRANEAN';

export type TrainingLocation = 'HOME' | 'GYM' | 'OUTDOOR' | 'MIXED';

// ================================================================
// INTERFACES - Datos del onboarding
// ================================================================

export interface OnboardingData {
  // Paso 1: Objetivo principal
  primaryGoal: PrimaryGoal | null;

  // Paso 2-3: Datos fisicos basicos
  gender: Gender | null;
  birthDate: string | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  targetWeightKg: number | null;

  // Paso 4-5: Actividad y estilo de vida
  activityLevel: ActivityLevel | null;
  workType: WorkType | null;
  sleepHoursAverage: number | null;

  // Paso 6-8: Entrenamiento
  fitnessLevel: FitnessLevel | null;
  trainingDaysPerWeek: number | null;
  sessionDurationMinutes: number | null;
  preferredTrainingTime: string | null;
  trainingLocation: TrainingLocation | null;

  // Paso 9-11: Nutricion
  dietType: DietType | null;
  mealsPerDay: number | null;
  favoriteAlimentos: number[];

  // Paso 12-14: Alergias y salud
  allergies: string[];
  medicalConditions: string[];
  injuries: string[];
  medications: string | null;
  isPregnant: boolean;
  isBreastfeeding: boolean;

  // Paso 15: Equipamiento
  equipment: string[];
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  data: Partial<OnboardingData>;
  lastUpdated: string;
}

// ================================================================
// INTERFACES - Respuestas del API
// ================================================================

export interface NutritionTargets {
  calculatedBMR: number;
  calculatedTDEE: number;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
}

export interface OnboardingResponse {
  userId: number;
  message: string;
  isOnboarded: boolean;
  onboardingCompletedAt: string;
  nutritionTargets: NutritionTargets;
}

// ================================================================
// INTERFACES - Alimentos
// ================================================================

export interface Alimento {
  id: number;
  nombre: string;
  ingredientes?: string[];
}

// ================================================================
// CONSTANTES - Opciones para seleccion
// ================================================================

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export const GOAL_OPTIONS: SelectOption[] = [
  {
    value: 'LOSE_WEIGHT',
    label: 'Perder peso',
    description: 'Reducir grasa corporal manteniendo masa muscular',
    icon: 'scale-down'
  },
  {
    value: 'GAIN_MUSCLE',
    label: 'Ganar musculo',
    description: 'Aumentar masa muscular y fuerza',
    icon: 'muscle'
  },
  {
    value: 'MAINTAIN',
    label: 'Mantener peso',
    description: 'Mantener tu peso y composicion corporal actual',
    icon: 'balance'
  },
  {
    value: 'IMPROVE_HEALTH',
    label: 'Mejorar salud',
    description: 'Mejorar habitos alimenticios y bienestar general',
    icon: 'heart'
  }
];

export const GENDER_OPTIONS: SelectOption[] = [
  {value: 'MALE', label: 'Masculino', icon: 'male'},
  {value: 'FEMALE', label: 'Femenino', icon: 'female'},
  {value: 'OTHER', label: 'Otro', icon: 'other'}
];

export const ACTIVITY_LEVEL_OPTIONS: SelectOption[] = [
  {
    value: 'SEDENTARY',
    label: 'Sedentario',
    description: 'Trabajo de escritorio, poco o nada de ejercicio'
  },
  {
    value: 'LIGHTLY_ACTIVE',
    label: 'Ligeramente activo',
    description: 'Ejercicio ligero 1-3 dias/semana'
  },
  {
    value: 'MODERATELY_ACTIVE',
    label: 'Moderadamente activo',
    description: 'Ejercicio moderado 3-5 dias/semana'
  },
  {
    value: 'VERY_ACTIVE',
    label: 'Muy activo',
    description: 'Ejercicio intenso 6-7 dias/semana'
  },
  {
    value: 'EXTRA_ACTIVE',
    label: 'Extremadamente activo',
    description: 'Atleta profesional o trabajo muy fisico'
  }
];

export const FITNESS_LEVEL_OPTIONS: SelectOption[] = [
  {
    value: 'SEDENTARY',
    label: 'Sedentario',
    description: 'Sin experiencia en ejercicio fisico'
  },
  {
    value: 'NOVICE',
    label: 'Principiante',
    description: 'Menos de 6 meses de experiencia'
  },
  {
    value: 'INTERMEDIATE',
    label: 'Intermedio',
    description: '6 meses a 2 anos de experiencia'
  },
  {
    value: 'ADVANCED',
    label: 'Avanzado',
    description: '2 a 5 anos de experiencia constante'
  },
  {
    value: 'ATHLETE',
    label: 'Atleta',
    description: 'Mas de 5 anos o nivel competitivo'
  }
];

export const DIET_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'OMNIVORE',
    label: 'Omnivoro',
    description: 'Como todo tipo de alimentos'
  },
  {
    value: 'VEGETARIAN',
    label: 'Vegetariano',
    description: 'No como carne ni pescado'
  },
  {
    value: 'VEGAN',
    label: 'Vegano',
    description: 'No consumo productos de origen animal'
  },
  {
    value: 'PESCATARIAN',
    label: 'Pescetariano',
    description: 'Vegetariano que come pescado'
  },
  {
    value: 'MEDITERRANEAN',
    label: 'Mediterranea',
    description: 'Rica en aceite de oliva, pescado y verduras'
  }
];

export const TRAINING_LOCATION_OPTIONS: SelectOption[] = [
  {
    value: 'HOME',
    label: 'Casa',
    description: 'Entreno en casa con equipamiento basico'
  },
  {
    value: 'GYM',
    label: 'Gimnasio',
    description: 'Entreno en gimnasio con equipamiento completo'
  },
  {
    value: 'OUTDOOR',
    label: 'Aire libre',
    description: 'Entreno al aire libre (parques, calle)'
  },
  {
    value: 'MIXED',
    label: 'Mixto',
    description: 'Combino diferentes lugares de entrenamiento'
  }
];

// ================================================================
// VALORES POR DEFECTO
// ================================================================

export const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  primaryGoal: null,
  gender: null,
  birthDate: null,
  heightCm: null,
  currentWeightKg: null,
  targetWeightKg: null,
  activityLevel: null,
  workType: null,
  sleepHoursAverage: null,
  fitnessLevel: null,
  trainingDaysPerWeek: null,
  sessionDurationMinutes: null,
  preferredTrainingTime: null,
  trainingLocation: null,
  dietType: null,
  mealsPerDay: null,
  favoriteAlimentos: [],
  allergies: [],
  medicalConditions: [],
  injuries: [],
  medications: null,
  isPregnant: false,
  isBreastfeeding: false,
  equipment: []
};
