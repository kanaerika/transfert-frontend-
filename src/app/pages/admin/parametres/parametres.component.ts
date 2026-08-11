import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ProfilService } from '../../../services/profil.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../core/ui/toast.service';
import { ConfirmService } from '../../../core/ui/confirm.service';
import { ProfilResponse, ConfigurationResponse } from '../../../models/models';

type Onglet = 'profil' | 'securite' | 'plafond';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.css']
})
export class ParametresComponent implements OnInit {

  private readonly profilService = inject(ProfilService);
  private readonly configService = inject(ConfigurationService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  readonly onglet = signal<Onglet>('profil');
  readonly estAdmin = computed(() => this.auth.role() === 'ADMIN');
  /** Le plafond est partagé par tous les partenaires : seul l'admin Afriland le configure. */
  readonly estAdminAfriland = computed(() => this.auth.estAdminAfriland());

  // ---- Profil ----
  readonly profil = signal<ProfilResponse | null>(null);
  formProfil = { nomComplet: '', email: '', agence: '' };
  readonly sauvProfil = signal(false);

  // ---- Sécurité ----
  mdp = { ancien: '', nouveau: '', confirmation: '' };
  readonly changementMdp = signal(false);
  readonly correspondance = computed(() =>
    this.mdp.confirmation ? this.mdp.nouveau === this.mdp.confirmation : null);
  readonly mdpValide = computed(() =>
    !!this.mdp.ancien && this.mdp.nouveau.length >= 8 &&
    /[a-zA-Z]/.test(this.mdp.nouveau) && /\d/.test(this.mdp.nouveau) &&
    this.correspondance() === true);

  // ---- Plafond ----
  readonly config = signal<ConfigurationResponse | null>(null);
  plafondSaisi = signal<number>(0);
  readonly sauvPlafond = signal(false);

  ngOnInit(): void {
    this.profilService.consulter().subscribe({
      next: p => {
        this.profil.set(p);
        this.formProfil = { nomComplet: p.nomComplet, email: p.email, agence: p.agence ?? '' };
      },
      error: () => this.toast.erreur('Impossible de charger le profil.')
    });

    if (this.estAdminAfriland()) {
      this.configService.lire().subscribe({
        next: c => { this.config.set(c); this.plafondSaisi.set(c.plafondMensuel); },
        error: () => this.toast.erreur('Impossible de charger la configuration.')
      });
    }
  }

  // ---- Profil ----
  enregistrerProfil(): void {
    if (this.sauvProfil() || !this.formProfil.nomComplet.trim() || !this.formProfil.email.trim()) return;
    this.sauvProfil.set(true);
    this.profilService.modifier(this.formProfil).subscribe({
      next: p => { this.profil.set(p); this.sauvProfil.set(false); this.toast.succes('Profil mis à jour.'); },
      error: (e: HttpErrorResponse) => { this.sauvProfil.set(false); this.toast.erreur(this.msg(e)); }
    });
  }

  // ---- Sécurité ----
  changerMotDePasse(): void {
    if (!this.mdpValide() || this.changementMdp()) return;
    this.changementMdp.set(true);
    this.auth.changerMotDePasse({
      ancienMotDePasse: this.mdp.ancien,
      nouveauMotDePasse: this.mdp.nouveau,
      confirmationMotDePasse: this.mdp.confirmation
    }).subscribe({
      next: () => {
        this.changementMdp.set(false);
        this.mdp = { ancien: '', nouveau: '', confirmation: '' };
        this.toast.succes('Mot de passe modifié.');
      },
      error: (e: HttpErrorResponse) => { this.changementMdp.set(false); this.toast.erreur(this.msg(e)); }
    });
  }

  // ---- Plafond ----
  async enregistrerPlafond(): Promise<void> {
    const valeur = Number(this.plafondSaisi());
    if (!valeur || valeur <= 0) {
      this.toast.erreur('Le plafond doit être un montant positif.');
      return;
    }
    const actuel = this.config()?.plafondMensuel ?? 0;
    if (valeur === actuel) {
      this.toast.info('Aucune modification : le plafond est identique.');
      return;
    }

    const ok = await this.confirm.demander({
      titre: 'Modifier le plafond mensuel',
      message: `Le plafond passera de ${this.format(actuel)} à ${this.format(valeur)} FCFA. Ce changement s'applique immédiatement à tous les contrôles de transfert. Continuer ?`,
      texteConfirmer: 'Modifier le plafond',
      danger: true
    });
    if (!ok) return;

    this.sauvPlafond.set(true);
    this.configService.modifierPlafond(valeur).subscribe({
      next: c => {
        this.config.set(c);
        this.plafondSaisi.set(c.plafondMensuel);
        this.sauvPlafond.set(false);
        this.toast.succes('Plafond mensuel mis à jour.');
      },
      error: (e: HttpErrorResponse) => { this.sauvPlafond.set(false); this.toast.erreur(this.msg(e)); }
    });
  }

  format(m: number): string {
    return new Intl.NumberFormat('fr-FR').format(m);
  }

  initiales(nom?: string | null): string {
    return (nom || '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(mot => mot.charAt(0).toUpperCase())
      .join('') || '?';
  }

  private msg(e: HttpErrorResponse): string {
    if (e.status === 0) return 'Serveur injoignable.';
    return e.error?.message ?? e.error?.error ?? 'Une erreur est survenue.';
  }
}