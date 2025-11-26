import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService)
    .checkAuth()
    .pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          router.navigateByUrl('/auth/login');
          return false;
        }
        return true;
      }),
      catchError((error) => {
        console.log(error);
        router.navigateByUrl('/auth/login');
        return of(false);
      })
    );
};
