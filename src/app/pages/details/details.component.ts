import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransfertService } from '../../services/transfert.service';
import { Transfert } from '../../models/models';
import { TransfertCardComponent } from '../../shared/transfert-card.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, TransfertCardComponent],
  template: `
  <div class="cin">
    <button class="retour-top" (click)="retour()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      Retour
    </button>

    @if (erreur()) {
      <div class="carte carte-erreur">
        <div class="icone-erreur">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="erreur-titre">Impossible d'afficher ce transfert</div>
        <div class="erreur-texte">{{ erreur() }}</div>
        <button class="btn-principal" (click)="retour()">Retour au bilan</button>
      </div>
    } @else if (t(); as tr) {
      <app-transfert-card [transfert]="tr" (fermer)="retour()" (misAJour)="t.set($event)" />
    } @else {
      <div class="carte"><div class="chargement">Chargement…</div></div>
    }
  </div>
  `,
  styles: [`
    .retour-top { display:inline-flex; align-items:center; gap:6px; border:none; background:none; color:var(--gris); font-weight:600; font-size:13px; cursor:pointer; padding:8px 0; margin-bottom:14px; }
    .retour-top:hover { color:var(--rouge); }
    .carte { background:var(--surface); border:1px solid var(--bordure); border-radius:18px; overflow:hidden; box-shadow:0 4px 20px -12px rgba(0,0,0,.25); }
    .chargement { padding:40px; text-align:center; color:var(--gris); }

    .carte-erreur { padding:40px 28px; text-align:center; }
    .icone-erreur { width:64px; height:64px; margin:0 auto 16px; border-radius:50%; background:var(--rouge-fond); color:var(--rouge); display:flex; align-items:center; justify-content:center; }
    .erreur-titre { font-size:17px; font-weight:800; color:var(--encre); margin-bottom:6px; }
    .erreur-texte { font-size:13.5px; color:var(--gris); margin-bottom:22px; }
    .btn-principal { display:inline-flex; align-items:center; gap:8px; border:none; cursor:pointer; padding:12px 22px; border-radius:12px; font-size:13.5px; font-weight:700; color:#fff; background:linear-gradient(135deg,var(--rouge),var(--rouge-fonce)); box-shadow:0 10px 24px -12px rgba(215,25,32,.8); }
  `]
})
export class DetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private transferts = inject(TransfertService);

  t = signal<Transfert | null>(null);
  erreur = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.erreur.set('Identifiant invalide.'); return; }

    this.transferts.detail(id).subscribe({
      next: tr => this.t.set(tr),
      error: () => this.erreur.set('Transfert introuvable ou accès refusé.')
    });
  }

  retour(): void {
    this.router.navigate(['../bilan'], { relativeTo: this.route });
  }
}
