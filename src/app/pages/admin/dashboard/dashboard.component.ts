import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { StatistiquesService } from '../../../services/statistiques.service';
import { PartenaireService } from '../../../services/partenaire.service';
import { AuthService } from '../../../services/auth.service';
import { StatistiquesResponse, Partenaire } from '../../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private readonly service = inject(StatistiquesService);
  private readonly partenaireService = inject(PartenaireService);
  private readonly auth = inject(AuthService);

  today = new Date();

  readonly estAdminAfriland = computed(() => this.auth.estAdminAfriland());

  readonly data = signal<StatistiquesResponse | null>(null);
  readonly partenaires = signal<Partenaire[]>([]);
  readonly chargement = signal(true);
  readonly erreur = signal('');

  ngOnInit(): void {
    this.service.charger().subscribe({
      next: d => { this.data.set(d); this.chargement.set(false); },
      error: (e: HttpErrorResponse) => {
        this.chargement.set(false);
        this.erreur.set(
          e.status === 0 ? 'Serveur injoignable.' : (e.error?.message ?? 'Impossible de charger les statistiques.')
        );
      }
    });

    if (this.estAdminAfriland()) {
      this.partenaireService.getAll().subscribe({ next: liste => this.partenaires.set(liste) });
    }
  }

  private kpi(libelle: string): string {
    const trouve = this.data()?.kpis.find(k => k.libelle === libelle);
    return trouve ? String(trouve.valeur) : '—';
  }

  readonly nombreAgents = computed(() => this.kpi('Agents'));
  readonly nombreTransferts = computed(() => this.kpi('Transferts'));
  readonly nombrePartenaires = computed(() => String(this.partenaires().length));
  readonly derniersPartenaires = computed(() => this.partenaires().slice(-5).reverse());

  libelleStatut(s: string): string {
    switch (s) {
      case 'EXECUTE': return 'Exécuté';
      case 'ANNULE': return 'Annulé';
      case 'REJETE': return 'Rejeté';
      case 'EN_COURS': return 'En cours';
      default: return s;
    }
  }

  classeStatut(s: string): string {
    switch (s) {
      case 'REJETE': return 'danger';
      case 'ANNULE':
      case 'EN_COURS': return 'warning';
      default: return '';
    }
  }

  formatMontant(m: number): string {
    return new Intl.NumberFormat('fr-FR').format(m) + ' FCFA';
  }
}
