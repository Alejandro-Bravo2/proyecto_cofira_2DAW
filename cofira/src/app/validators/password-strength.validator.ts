import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Interface para los requisitos de contraseña
 */
export interface PasswordRequirements {
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumeric: boolean;
  hasSpecial: boolean;
  isLongEnough: boolean;
}

/**
 * Verifica los requisitos individuales de la contraseña
 */
export function checkPasswordRequirements(value: string): PasswordRequirements {
  return {
    hasUpperCase: /[A-Z]/.test(value),
    hasLowerCase: /[a-z]/.test(value),
    hasNumeric: /[0-9]/.test(value),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
    isLongEnough: value.length >= 8
  };
}

/**
 * Validador de fortaleza de contraseña
 * Requiere:
 * - Al menos 8 caracteres
 * - Al menos 1 mayuscula
 * - Al menos 1 minuscula
 * - Al menos 1 numero
 * - Al menos 1 caracter especial
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const requirements = checkPasswordRequirements(value);
    const passwordValid =
      requirements.hasUpperCase &&
      requirements.hasLowerCase &&
      requirements.hasNumeric &&
      requirements.hasSpecial &&
      requirements.isLongEnough;

    return !passwordValid ? {passwordStrength: requirements} : null;
  };
}
