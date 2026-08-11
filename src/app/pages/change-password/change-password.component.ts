import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';

interface Critere {
  libelle: string;
  valide: boolean;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly nouveau = signal('');
  readonly confirmation = signal('');
  readonly afficherNouveau = signal(false);
  readonly afficherConfirmation = signal(false);
  readonly enCours = signal(false);
  readonly erreur = signal<string | null>(null);
  readonly succes = signal(false);

  readonly nomUtilisateur = computed(() => this.auth.agent?.nomComplet ?? '');

  /** Critères de la politique backend : 8 caractères, une lettre, un chiffre. */
  readonly criteres = computed<Critere[]>(() => {
    const mdp = this.nouveau();
    return [
      { libelle: 'Au moins 8 caractères', valide: mdp.length >= 8 },
      { libelle: 'Au moins une lettre',   valide: /[a-zA-Z]/.test(mdp) },
      { libelle: 'Au moins un chiffre',   valide: /\d/.test(mdp) }
    ];
  });

  readonly criteresValides = computed(() => this.criteres().every(c => c.valide));

  readonly correspondance = computed(() => {
    const c = this.confirmation();
    return c.length === 0 ? null : this.nouveau() === c;
  });

  /** Force indicative : 0 à 4. */
  readonly force = computed(() => {
    const mdp = this.nouveau();
    if (!mdp) return 0;
    let score = 0;
    if (mdp.length >= 8) score++;
    if (mdp.length >= 12) score++;
    if (/[a-z]/.test(mdp) && /[A-Z]/.test(mdp)) score++;
    if (/\d/.test(mdp) && /[^a-zA-Z0-9]/.test(mdp)) score++;
    return score;
  });

  readonly libelleForce = computed(() => {
    switch (this.force()) {
      case 0:
      case 1: return 'Faible';
      case 2: return 'Moyen';
      case 3: return 'Bon';
      default: return 'Excellent';
    }
  });

  readonly formulaireValide = computed(() =>
    this.criteresValides() && this.correspondance() === true
  );

  soumettre(): void {
    if (!this.formulaireValide() || this.enCours()) return;

    this.enCours.set(true);
    this.erreur.set(null);

    this.auth.definirPremierMotDePasse({
      nouveauMotDePasse: this.nouveau(),
      confirmationMotDePasse: this.confirmation()
    }).subscribe({
      next: () => {
        this.succes.set(true);
        setTimeout(() => this.router.navigate([this.auth.routeAccueil()]), 1400);
      },
      error: (err: HttpErrorResponse) => {
        this.enCours.set(false);
        this.erreur.set(this.extraireMessage(err));
      }
    });
  }

  deconnexion(): void {
    this.auth.deconnexion();
  }

  private extraireMessage(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Serveur injoignable. Vérifiez votre connexion.';
    if (err.status === 409) {
      return 'Votre mot de passe a déjà été défini. Reconnectez-vous.';
    }
    return err.error?.message
      ?? err.error?.error
      ?? 'Une erreur est survenue. Réessayez.';
  }
}