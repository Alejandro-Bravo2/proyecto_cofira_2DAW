import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of, timer} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';

/**
 * Validador asincrono para verificar si el email ya esta en uso
 * Incluye debounce de 500ms para evitar demasiadas peticiones
 */
export function emailAvailableValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // No validar si esta vacio o tiene formato invalido
    if (!control.value || control.hasError('email')) {
      return of(null);
    }

    // Debounce de 500ms antes de hacer la peticion
    return timer(500).pipe(
      switchMap(() => authService.checkEmailAvailable(control.value)),
      map(result => result.available ? null : {emailTaken: true}),
      catchError(() => of(null)) // En caso de error, no bloquear el formulario
    );
  };
}
