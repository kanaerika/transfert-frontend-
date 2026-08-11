import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token;

  const requete = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(requete).pipe(
    catchError((err: HttpErrorResponse) => {
      // Session expirée ou invalide : on nettoie et on renvoie vers la connexion.
      if (err.status === 401 && !req.url.includes('/auth/login')) {
        localStorage.clear();
        router.navigate(['/connexion'], { queryParams: { expire: '1' } });
      }
      return throwError(() => err);
    })
  );
};