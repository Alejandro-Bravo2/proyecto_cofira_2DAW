import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of, timer} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';

export function emailAvailableValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.hasError('email')) {
      return of(null);
    }

    return timer(500).pipe(
      switchMap(() => authService.checkEmailAvailable(control.value)),
      map(result => result.available ? null : {emailTaken: true}),
      catchError(() => of(null))
    );
  };
}
