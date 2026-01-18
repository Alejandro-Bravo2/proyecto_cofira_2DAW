import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export interface PasswordRequirements {
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumeric: boolean;
  hasSpecial: boolean;
  isLongEnough: boolean;
}

export function checkPasswordRequirements(value: string): PasswordRequirements {
  return {
    hasUpperCase: /[A-Z]/.test(value),
    hasLowerCase: /[a-z]/.test(value),
    hasNumeric: /[0-9]/.test(value),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
    isLongEnough: value.length >= 8
  };
}

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
