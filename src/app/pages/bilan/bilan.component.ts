import { Component, OnInit, inject } from '@angular/core';
import { TransfertService } from '../../services/transfert.service';
import { Bilan } from '../../models/models';

@Component({
  selector: 'app-bilan',
  standalone: true,
  template: `
  <div class="cin carte">
    @if (erreur) {
      <div class="err">{{ erreur }}</div>
    } @else if (bilan) {
      <div class="grille">
        <div class="stat">
          <div class="sl">Transferts exécutés</div>
          <div class="disp sv sv-vert">{{ bilan.executes }}</div>
        </div>
        <div class="stat">
          <div class="sl">Transferts rejetés</div>
          <div class="disp sv sv-rouge">{{ bilan.rejetes }}</div>
        </div>
        <div class="stat">
          <div class="sl">Transferts annulés</div>
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
    }
  </div>
  `,
  styles: [`
    .carte { background:#fff; border:1px solid var(--bordure); border-radius:18px; padding:26px 28px; box-shadow:0 4px 20px -12px rgba(0,0,0,.25); }
    .err { text-align:center; color:var(--rouge); font-size:13px; font-weight:700; margin:20px 0; }
    .grille { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    .stat { background:#f7f8fa; border:1px solid var(--bordure); border-radius:14px; padding:20px; }
    .stat-total { grid-column:1 / -1; background:#111318; }
    .stat-total .sl { color:rgba(255,255,255,.5); }
    .stat-total .sv { color:#fff; }
    .sl { font-size:11px; font-weight:700; letter-spacing:.4px; color:#8a8f97; text-transform:uppercase; }
    .sv { font-size:32px; font-weight:700; margin-top:8px; color:var(--encre); }
    .sv-vert { color:var(--vert); }
    .sv-rouge { color:var(--rouge); }
    .jour { margin-top:18px; text-align:center; font-size:12.5px; color:var(--gris); font-weight:600; }
  `]
})
export class BilanComponent implements OnInit {
  private transferts = inject(TransfertService);

  bilan: Bilan | null = null;
  erreur = '';

  ngOnInit(): void {
    this.transferts.bilan().subscribe({
      next: b => { this.bilan = b; },
      error: () => { this.erreur = 'Erreur lors du chargement du bilan.'; }
    });
  }
}
