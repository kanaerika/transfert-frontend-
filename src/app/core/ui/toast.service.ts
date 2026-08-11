import { Injectable, signal } from '@angular/core';

export type ToastType = 'succes' | 'erreur' | 'info' | 'avertissement';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  titre?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  private compteur = 0;
  readonly toasts = signal<Toast[]>([]);

  private readonly DUREE = 4000;

  succes(message: string, titre = 'Succès'): void {
    this.ajouter('succes', message, titre);
  }

  erreur(message: string, titre = 'Erreur'): void {
    this.ajouter('erreur', message, titre);
  }

  info(message: string, titre?: string): void {
    this.ajouter('info', message, titre);
  }

  avertissement(message: string, titre = 'Attention'): void {
    this.ajouter('avertissement', message, titre);
  }

  fermer(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private ajouter(type: ToastType, message: string, titre?: string): void {
    const toast: Toast = { id: ++this.compteur, type, message, titre };
    this.toasts.update(list => [...list, toast]);
    setTimeout(() => this.fermer(toast.id), this.DUREE);
  }
}