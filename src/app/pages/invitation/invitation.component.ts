import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';

type Etat = 'chargement' | 'succes' | 'erreur';

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css'
})
export class InvitationComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly etat = signal<Etat>('chargement');
  readonly message = signal<string>('');
  readonly compteARebours = signal<number>(5);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.echouer("Lien d'invitation invalide : aucun jeton fourni.");
      return;
    }

    this.auth.validerInvitation(token).subscribe({
      next: res => {
        this.etat.set('succes');
        this.message.set(res.message);
        this.demarrerRedirection();
      },
      error: (err: HttpErrorResponse) => {
        this.echouer(this.extraireMessage(err));
      }
    });
  }

  allerAConnexion(): void {
    this.router.navigate(['/connexion']);
  }

  private demarrerRedirection(): void {
    const timer = setInterval(() => {
      const restant = this.compteARebours() - 1;
      this.compteARebours.set(restant);
      if (restant <= 0) {
        clearInterval(timer);
        this.allerAConnexion();
      }
    }, 1000);
  }

  private echouer(msg: string): void {
    this.etat.set('erreur');
    this.message.set(msg);
  }

  private extraireMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Serveur injoignable. Vérifiez votre connexion.';
    }
    if (err.status === 410) {
      return err.error?.message
        ?? "Ce lien d'invitation a expiré. Demandez une nouvelle invitation à votre administrateur.";
    }
    return err.error?.message
      ?? err.error?.error
      ?? "Ce lien d'invitation est invalide ou a déjà été utilisé.";
  }
}