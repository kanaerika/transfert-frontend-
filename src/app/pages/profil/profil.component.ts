import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';

interface Critere {
  libelle: string;
  valide: boolean;
}

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {

  private readonly auth = inject(AuthService);

  readonly nomComplet = computed(() => this.auth.agent?.nomComplet ?? '');
  readonly codeAgent = computed(() => this.auth.agent?.codeAgent ?? '—');
  readonly role = computed(() => this.auth.agent?.role ?? '');
  readonly partenaireNom = computed(() => this.auth.agent?.partenaireNom ?? 'Afriland First Bank');

  readonly libelleRole = computed(() => {
    switch (this.role()) {
      case 'ADMIN': return 'Administrateur';
      case 'AGENT': return 'Agent';
      default: return this.role();
    }
  });

  readonly ancien = signal('');
  readonly nouveau = signal('');
  readonly confirmation = signal('');
  readonly afficherAncien = signal(false);
  readonly afficherNouveau = signal(false);
  readonly afficherConfirmation = signal(false);
  readonly enCours = signal(false);
  readonly erreur = signal<string | null>(null);
  readonly succes = signal(false);

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

  readonly formulaireValide = computed(() =>
    this.ancien().length > 0 && this.criteresValides() && this.correspondance() === true
  );

  soumettre(): void {
    if (!this.formulaireValide() || this.enCours()) return;

    this.enCours.set(true);
    this.erreur.set(null);
    this.succes.set(false);

    this.auth.changerMotDePasse({
      ancienMotDePasse: this.ancien(),
      nouveauMotDePasse: this.nouveau(),
      confirmationMotDePasse: this.confirmation()
    }).subscribe({
      next: () => {
        this.enCours.set(false);
        this.succes.set(true);
        this.ancien.set('');
        this.nouveau.set('');
        this.confirmation.set('');
      },
      error: (err: HttpErrorResponse) => {
        this.enCours.set(false);
        this.erreur.set(this.extraireMessage(err));
      }
    });
  }

  private extraireMessage(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Serveur injoignable. Vérifiez votre connexion.';
    return err.error?.message ?? err.error?.error ?? 'Une erreur est survenue. Réessayez.';
  }
}
