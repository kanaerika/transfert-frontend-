import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Sur un 401, le token en localStorage est mort (expiré, ou compte/agent
 * supprimé côté serveur depuis) : on déconnecte et on renvoie vers /connexion
 * au lieu de laisser l'utilisateur bloqué sur des erreurs 401 répétées.
 */
export const authExpirationInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(err => {
      if (err?.status === 401 && auth.estConnecte()) {
        auth.deconnexion();
        router.navigate(['/connexion'], { queryParams: { sessionExpiree: 1 } });
      }
      return throwError(() => err);
    })
  );
};
