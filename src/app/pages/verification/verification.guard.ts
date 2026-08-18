import { CanDeactivateFn } from '@angular/router';
import { VerificationComponent } from './verification.component';

/** Empêche de quitter la page tant qu'un transfert autorisé n'est pas exécuté ou explicitement abandonné. */
export const verificationGuard: CanDeactivateFn<VerificationComponent> = (component) => component.peutQuitter();
