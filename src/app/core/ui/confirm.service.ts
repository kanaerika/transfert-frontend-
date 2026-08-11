import { Injectable, signal } from '@angular/core';

export interface OptionsConfirmation {
  titre: string;
  message: string;
  texteConfirmer?: string;
  texteAnnuler?: string;
  danger?: boolean;
}

interface DemandeConfirmation extends OptionsConfirmation {
  resoudre: (confirme: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  readonly demande = signal<DemandeConfirmation | null>(null);

  /** Ouvre le dialogue et résout à true (confirmer) ou false (annuler). */
  demander(options: OptionsConfirmation): Promise<boolean> {
    return new Promise<boolean>(resoudre => {
      this.demande.set({
        texteConfirmer: 'Confirmer',
        texteAnnuler: 'Annuler',
        danger: false,
        ...options,
        resoudre
      });
    });
  }

  repondre(confirme: boolean): void {
    const d = this.demande();
    if (d) {
      d.resoudre(confirme);
      this.demande.set(null);
    }
  }
}