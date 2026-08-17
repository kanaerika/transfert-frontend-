import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PasswordResetService } from './password-reset.service';
import { TraductionService } from '../../core/traduction/traduction.service';

/**
 * Composant "Mot de passe oublié" en 3 étapes :
 *  1. Saisie du téléphone  → envoi de l'OTP par SMS
 *  2. Saisie du code OTP   → vérification
 *  3. Nouveau mot de passe + confirmation → réinitialisation
 *
 * Route à ajouter dans app.routes.ts :
 *   { path: 'forgot-password', component: ForgotPasswordComponent }
 *
 * Et sur la page de login, un lien :
 *   <a routerLink="/forgot-password">Mot de passe oublié ?</a>
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  readonly tr = inject(TraductionService);

  etape: 1 | 2 | 3 = 1;

  telephone = '';
  code = '';
  nouveauMotDePasse = '';
  confirmationMotDePasse = '';

  chargement = false;
  erreur = '';
  info = '';

  constructor(private resetService: PasswordResetService,
              private router: Router) {}

  /** Étape 1 : envoyer l'OTP */
  envoyerCode(): void {
    this.erreur = '';
    if (!this.telephone.trim()) {
      this.erreur = this.tr.t('forgot.erreurTelephone');
      return;
    }
    this.chargement = true;
    this.resetService.forgotPassword(this.telephone.trim()).subscribe({
      next: (res) => {
        this.chargement = false;
        this.info = res.message;
        this.etape = 2;
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = err.error?.message || this.tr.t('forgot.erreurEnvoi');
      }
    });
  }

  /** Étape 2 : vérifier l'OTP */
  verifierCode(): void {
    this.erreur = '';
    if (!/^\d{6}$/.test(this.code.trim())) {
      this.erreur = this.tr.t('forgot.erreurCode6');
      return;
    }
    this.chargement = true;
    this.resetService.verifyOtp(this.telephone.trim(), this.code.trim()).subscribe({
      next: (res) => {
        this.chargement = false;
        this.info = res.message;
        this.etape = 3;
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = err.error?.message || this.tr.t('forgot.erreurCodeInvalide');
      }
    });
  }

  /** Étape 3 : réinitialiser le mot de passe */
  reinitialiser(): void {
    this.erreur = '';
    if (this.nouveauMotDePasse.length < 6) {
      this.erreur = this.tr.t('forgot.erreurMdpCourt');
      return;
    }
    if (this.nouveauMotDePasse !== this.confirmationMotDePasse) {
      this.erreur = this.tr.t('commun.erreurMdpDiff');
      return;
    }
    this.chargement = true;
    this.resetService.resetPassword(
      this.telephone.trim(), this.code.trim(),
      this.nouveauMotDePasse, this.confirmationMotDePasse
    ).subscribe({
      next: (res) => {
        this.chargement = false;
        alert(res.message);
        this.router.navigate(['/connexion']);
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = err.error?.message || this.tr.t('forgot.erreurReinit');
      }
    });
  }

  renvoyerCode(): void {
    this.code = '';
    this.etape = 1;
    this.info = '';
    this.erreur = '';
  }
}
