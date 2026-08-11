import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { StatistiquesService } from '../../../services/statistiques.service';
import { ToastService } from '../../../core/ui/toast.service';
import { StatistiquesResponse } from '../../../models/models';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit {

  private readonly service = inject(StatistiquesService);
  private readonly toast = inject(ToastService);

  readonly data = signal<StatistiquesResponse | null>(null);
  readonly chargement = signal(true);

  /** Total d'opérations, pour afficher les pourcentages sous le donut. */
  readonly totalOperations = computed(() =>
    (this.data()?.repartitionOperations ?? []).reduce((s, p) => s + p.valeur, 0)
  );

  readonly partsAvecPourcentage = computed(() => {
    const total = this.totalOperations();
    return (this.data()?.repartitionOperations ?? []).map(p => ({
      ...p,
      pourcentage: total > 0 ? Math.round((p.valeur / total) * 1000) / 10 : 0
    }));
  });

  // ---- Donut (répartition des opérations) ----
  donutData = signal<ChartData<'doughnut'>>({ labels: [], datasets: [] });
  readonly donutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = this.totalOperations();
            const val = ctx.parsed;
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0';
            return ` ${ctx.label} : ${val} (${pct} %)`;
          }
        }
      }
    }
  };

  // ---- Ligne (évolution 12 mois) ----
  ligneData = signal<ChartData<'line'>>({ labels: [], datasets: [] });
  ligneOptions = signal<ChartConfiguration<'line'>['options']>({});

  constructor() {
    effect(() => {
      const d = this.data();
      if (d) this.construireGraphes(d);
    });
  }

  ngOnInit(): void {
    this.service.charger().subscribe({
      next: d => {
        this.data.set(d);
        this.chargement.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.chargement.set(false);
        this.toast.erreur(
          err.status === 0 ? 'Serveur injoignable.'
            : err.error?.message ?? 'Impossible de charger les statistiques.'
        );
      }
    });
  }

  private lireVar(nom: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(nom).trim();
  }

  private construireGraphes(d: StatistiquesResponse): void {
    // Donut
    this.donutData.set({
      labels: d.repartitionOperations.map(p => p.libelle),
      datasets: [{
        data: d.repartitionOperations.map(p => p.valeur),
        backgroundColor: d.repartitionOperations.map(p => p.couleur),
        borderColor: this.lireVar('--surface'),
        borderWidth: 3
      }]
    });

    // Ligne
    const rouge = this.lireVar('--rouge-afb') || '#C8102E';
    const texte = this.lireVar('--gris-texte') || '#5A6270';
    const grille = this.lireVar('--gris-bordure') || '#E2E5EA';

    this.ligneData.set({
      labels: d.evolution.map(p => p.periode),
      datasets: [{
        label: 'Transferts',
        data: d.evolution.map(p => p.valeur),
        borderColor: rouge,
        backgroundColor: 'rgba(200,16,46,.12)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: rouge,
        pointRadius: 3,
        pointHoverRadius: 5
      }]
    });

    this.ligneOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: texte }, grid: { color: grille } },
        y: { beginAtZero: true, ticks: { color: texte, precision: 0 }, grid: { color: grille } }
      }
    });
  }

  // ---- Helpers d'affichage ----

  varianteClasse(v: string): string {
    switch (v) {
      case 'succes': return 'kpi-succes';
      case 'info': return 'kpi-info';
      case 'attention': return 'kpi-attention';
      case 'neutre': return 'kpi-neutre';
      default: return 'kpi-principal';
    }
  }

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
      case 'EXECUTE': return 'st-execute';
      case 'ANNULE': return 'st-annule';
      case 'REJETE': return 'st-rejete';
      default: return 'st-cours';
    }
  }

  formatMontant(m: number): string {
    return new Intl.NumberFormat('fr-FR').format(m) + ' FCFA';
  }

  titreClassement(): string {
    return this.data()?.portee === 'AGENT' ? '' : 'Meilleurs agents';
  }
}