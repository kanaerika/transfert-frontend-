import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Accès aux zones protégées.
 * Bloque également le dashboard tant que le mot de passe temporaire n'a pas été remplacé.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.estConnecte()) {
    return router.createUrlTree(['/connexion']);
  }
  if (auth.doitChangerMotDePasse()) {
    return router.createUrlTree(['/change-password']);
  }
  return true;
};

/**
 * Réservé à la page de changement obligatoire.
 * Empêche d'y accéder quand ce n'est plus nécessaire.
 */
export const firstLoginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.estConnecte()) {
    return router.createUrlTree(['/connexion']);
  }
  if (!auth.doitChangerMotDePasse()) {
    return router.createUrlTree([auth.routeAccueil()]);
  }
  return true;
};

/** Restreint une route à certains rôles. */
export const roleGuard = (...rolesAutorises: string[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.estConnecte()) {
    return router.createUrlTree(['/connexion']);
  }
  if (auth.doitChangerMotDePasse()) {
    return router.createUrlTree(['/change-password']);
  }
  const role = auth.role();
  if (!role || !rolesAutorises.includes(role)) {
    return router.createUrlTree([auth.routeAccueil()]);
  }
  return true;
};

/**
 * Réservé à l'admin du partenaire Afriland First Bank : lui seul onboarde les
 * autres partenaires. Tous les admins partagent le même rôle "ADMIN", donc ce
 * n'est pas une distinction de rôle mais de partenaire (voir AuthService.estAdminAfriland).
 */
export const afrilandGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.estConnecte()) {
    return router.createUrlTree(['/connexion']);
  }
  if (auth.doitChangerMotDePasse()) {
    return router.createUrlTree(['/change-password']);
  }
  if (!auth.estAdminAfriland()) {
    return router.createUrlTree([auth.routeAccueil()]);
  }
  return true;
};