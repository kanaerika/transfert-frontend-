import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransfertService } from '../../services/transfert.service';
import { Bilan, Transfert } from '../../models/models';
import { TransfertCardComponent } from '../../shared/transfert-card.component';

@Component({
  selector: 'app-bilan',
  standalone: true,
  imports: [CommonModule, TransfertCardComponent],
  template: `
  <div class="cin carte">
    @if (erreur) {
      <div class="err">{{ erreur }}</div>
    } @else if (bilan) {

      <div class="grille">
        <div class="stat">
          <div class="sl">Exécutés</div>
          <div class="disp sv sv-vert">{{ bilan.executes }}</div>
        </div>
        <div class="stat">
          <div class="sl">Rejetés</div>
          <div class="disp sv sv-rouge">{{ bilan.rejetes }}</div>
        </div>
        <div class="stat">
          <div class="sl">Annulés</div>
          <div class="disp sv">{{ bilan.annules }}</div>
        </div>
        <div class="stat">
          <div class="sl">Non clôturés</div>
          <div class="disp sv">{{ bilan.nonClotures }}</div>
        </div>
        <div class="stat stat-total">
          <div class="sl">Total du jour</div>
          <div class="disp sv">{{ bilan.total }}</div>
        </div>
      </div>

      <div class="jour">Bilan du {{ bilan.jour }}</div>

      <!-- Liste détaillée de toutes les opérations du jour -->
      <div class="liste-titre">Détail des opérations</div>

      @if (bilan.lignes.length === 0) {
        <div class="vide">Aucune opération enregistrée aujourd'hui.</div>
      } @else {
        <div class="table-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>Client</th>
                <th>Montant</th>
                <th>Pays</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (t of bilan.lignes; track t.id) {
                <tr (click)="voir(t)" class="ligne">
                  <td>{{ t.nomClient }}</td>
                  <td class="mnt">{{ format(t.montant) }} FCFA</td>
                  <td>{{ t.paysDestination }}</td>
                  <td>
                    <span class="badge" [class]="classe(t.statut)">{{ t.statut }}</span>
                  </td>
                  <td class="voir-col">Voir →</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    }
  </div>

  @if (transfertSelectionne) {
    <div class="voile" (click)="fermer()">
      <div class="popup-large" (click)="$event.stopPropagation()">
        <app-transfert-card [transfert]="transfertSelectionne" [popup]="true"
                             (fermer)="fermer()" (misAJour)="misAJour($event)" />
      </div>
    </div>
  }
  `,
  styles: [`
    .carte { background:var(--surface); border:1px solid var(--bordure); border-radius:18px; padding:26px 28px; box-shadow:0 4px 20px -12px rgba(0,0,0,.25); }
    .err { text-align:center; color:var(--rouge); font-size:13px; font-weight:700; margin:20px 0; }
    .grille { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    .stat { background:var(--surface-2); border:1px solid var(--bordure); border-radius:14px; padding:20px; }
    .stat-total { grid-column:1 / -1; background:#111318; }
    .stat-total .sl { color:rgba(255,255,255,.5); }
    .stat-total .sv { color:#fff; }
    .sl { font-size:11px; font-weight:700; letter-spacing:.4px; color:var(--gris-texte); text-transform:uppercase; }
    .sv { font-size:32px; font-weight:700; margin-top:8px; color:var(--encre); }
    .sv-vert { color:var(--vert); }
    .sv-rouge { color:var(--rouge); }
    .jour { margin-top:18px; text-align:center; font-size:12.5px; color:var(--gris); font-weight:600; }

    .liste-titre { margin:28px 0 14px; font-size:15px; font-weight:700; color:var(--encre); }
    .vide { text-align:center; color:var(--gris); font-size:13.5px; padding:24px; }
    .table-wrap { overflow-x:auto; }
    .tbl { width:100%; border-collapse:collapse; }
    .tbl th { text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.3px; color:var(--gris-texte); padding:10px 12px; border-bottom:1px solid var(--bordure); }
    .tbl td { padding:12px; font-size:13.5px; color:var(--encre); border-bottom:1px solid var(--bordure); }
    .ligne { cursor:pointer; transition:background .12s ease; }
    .ligne:hover { background:var(--gris-clair); }
    .mnt { font-weight:600; white-space:nowrap; }
    .voir-col { color:var(--rouge); font-weight:600; white-space:nowrap; text-align:right; }
    .badge { padding:4px 10px; border-radius:20px; font-size:11.5px; font-weight:600; white-space:nowrap; }
    .b-execute { background:var(--vert-fond); color:var(--vert); }
    .b-annule  { background:var(--orange-fond); color:var(--orange); }
    .b-rejete  { background:var(--rouge-fond); color:var(--rouge); }
    .b-refuse  { background:var(--rouge-fond); color:var(--rouge); }
    .b-cours   { background:var(--bleu-fond); color:var(--bleu); }
    .b-autre   { background:var(--gris-clair); color:var(--gris-texte); }

    .voile { position:fixed; inset:0; z-index:100; background:rgba(12,14,18,.55); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; padding:20px; overflow-y:auto; }
    .popup-large { width:100%; max-width:760px; max-height:90vh; overflow-y:auto; border-radius:18px; animation:pop .18s ease-out; }
    @keyframes pop { from { transform:scale(.96); opacity:0; } to { transform:scale(1); opacity:1; } }

    @media (max-width:640px) {
      .grille { grid-template-columns:repeat(2,1fr); }
      .sv { font-size:26px; }
    }
  `]
})
export class BilanComponent implements OnInit {
  private transferts = inject(TransfertService);

  bilan: Bilan | null = null;
  erreur = '';
  transfertSelectionne: Transfert | null = null;

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.transferts.bilan().subscribe({
      next: b => { this.bilan = b; },
      error: () => { this.erreur = 'Erreur lors du chargement du bilan.'; }
    });
  }

  voir(t: Transfert): void {
    this.transfertSelectionne = t;
  }

  fermer(): void {
    this.transfertSelectionne = null;
  }

  misAJour(t: Transfert): void {
    this.transfertSelectionne = t;
    this.charger();
  }

  format(m: number): string {
    return new Intl.NumberFormat('fr-FR').format(m);
  }

  classe(statut: string): string {
    const s = statut.toLowerCase();
    if (s.includes('exécuté')) return 'b-execute';
    if (s.includes('annulé')) return 'b-annule';
    if (s.includes('rejeté')) return 'b-rejete';
    if (s.includes('refusé') || s.includes('plafond')) return 'b-refuse';
    if (s.includes('cours')) return 'b-cours';
    return 'b-autre';
  }
}
