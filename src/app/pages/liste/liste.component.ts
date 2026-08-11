import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TransfertService } from '../../services/transfert.service';
import { Transfert } from '../../models/models';
import { imprimerBordereau } from '../../core/bordereau';
import { TraductionService } from '../../core/traduction/traduction.service';
 
type Mode = 'historique' | 'annulation' | 'justificatifs';
 
@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [FormsModule],
  template: `
  <div class="cin carte">
    <div class="recherche">
      <div class="fld">
        <span class="ic">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input class="fin" [(ngModel)]="recherche" (keyup.enter)="charger()" placeholder="Rechercher un client, une référence…">
      </div>
      <button class="lift btn" (click)="charger()">Rechercher</button>
    </div>
 
    @if (erreur) { <div class="err">{{ erreur }}</div> }
 
    @if (!erreur && transferts.length === 0) {
      <div class="vide">Aucun transfert à afficher.</div>
    }
 
    @if (transferts.length > 0) {
      <div class="table-wrap"><table class="tbl">
        <thead>
          <tr>
            <th>Client</th>
            <th>Destination</th>
            <th>Montant</th>
            <th>Canal</th>
            <th>Référence</th>
            <th>Saisi par</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Motif</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (t of transferts; track t.id) {
            <tr>
              <td class="nom">
                <div class="client">
                  <div class="avatar">{{ initiales(t.nomClient) }}</div>
                  <span>{{ t.nomClient }}</span>
                </div>
              </td>
              <td class="no-coupe">{{ t.paysDestination }}</td>
              <td class="no-coupe"><b>{{ fmt(t.montant) }}</b> FCFA</td>
              <td class="no-coupe">{{ t.canal }}</td>
              <td class="no-coupe">{{ t.reference || '—' }}</td>
              <td class="saisi"><b>{{ t.agentNom || '—' }}</b>{{ t.agence }}</td>
              <td class="no-coupe">{{ t.dateTransfert }}</td>
              <td class="no-coupe"><span [class]="statutClasse(t.statut)">{{ t.statut }}</span></td>
              <td class="motif-col">{{ t.motif || '—' }}</td>
              <td class="acts"><div class="actions-cell">
                <button class="navi lien" (click)="voirDetails(t)">Détails</button>
                <button class="navi lien" (click)="imprimer(t)">Bordereau</button>
                @if (mode === 'annulation') {
                  <button class="navi lien lien-danger" (click)="ouvrirMotif(t, 'annulation')">Annuler</button>
                  <button class="navi lien lien-danger" (click)="ouvrirMotif(t, 'rejet')">Rejeter</button>
                }
              </div></td>
            </tr>
          }
        </tbody>
      </table></div>
    }
 
    <!-- Popup de saisie du motif (annulation ou rejet) -->
    @if (cible) {
      <div class="voile" (click)="fermerMotif()">
        <div class="popup" (click)="$event.stopPropagation()">
          <div class="popup-tete">
            <div class="popup-titre">
              {{ action === 'annulation' ? 'Annuler ce transfert' : 'Rejeter ce transfert' }}
            </div>
            <button class="popup-x" (click)="fermerMotif()">✕</button>
          </div>
 
          <div class="popup-resume">
            <div class="pr-ligne"><span>Client</span><b>{{ cible.nomClient }}</b></div>
            <div class="pr-ligne"><span>Montant</span><b>{{ fmt(cible.montant) }} FCFA</b></div>
            <div class="pr-ligne"><span>Destination</span><b>{{ cible.paysDestination }}</b></div>
            <div class="pr-ligne"><span>Référence</span><b>{{ cible.reference }}</b></div>
          </div>
 
          <label class="popup-label">Motif de {{ action === 'annulation' ? "l'annulation" : 'du rejet' }} <span class="oblig">— obligatoire</span></label>
          <textarea class="in motif-zone" [(ngModel)]="motif" rows="3"
                    placeholder="Expliquez pourquoi cette opération est {{ action === 'annulation' ? 'annulée' : 'rejetée' }} (au moins 10 caractères)…"></textarea>
          <div class="motif-compteur" [class.ok]="motif.trim().length >= 10">
            {{ motif.trim().length >= 10 ? '✓ Motif valide' : motif.trim().length + '/10 caractères minimum' }}
          </div>
          @if (erreurMotif) { <div class="err">{{ erreurMotif }}</div> }
 
          <div class="popup-actions">
            <button class="navi btn-gris" (click)="fermerMotif()">Retour</button>
            <button class="lift btn btn-confirm" [disabled]="motif.trim().length < 10 || envoi"
                    (click)="confirmer()">
              {{ envoi ? 'Envoi…' : (action === 'annulation' ? "Confirmer l'annulation" : 'Confirmer le rejet') }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Popup de détail d'un transfert -->
    @if (detailsCible; as d) {
      <div class="voile" (click)="fermerDetails()">
        <div class="popup popup-details" (click)="$event.stopPropagation()">
          <div class="popup-tete">
            <div class="popup-titre">Détail du transfert</div>
            <button class="popup-x" (click)="fermerDetails()">✕</button>
          </div>

          <div class="fiche">
            <div class="cell"><div class="cl">CLIENT</div><div class="cv">{{ d.nomClient }}</div></div>
            <div class="cell"><div class="cl">NAISSANCE</div><div class="cv">{{ d.dateNaissance }}</div></div>
            <div class="cell"><div class="cl">NATURE PIÈCE</div><div class="cv">{{ d.naturePiece }}</div></div>
            <div class="cell"><div class="cl">N° PIÈCE</div><div class="cv">{{ d.numeroPiece }}</div></div>
            <div class="cell"><div class="cl">DESTINATION</div><div class="cv">{{ d.paysDestination }}</div></div>
            <div class="cell"><div class="cl">MONTANT</div><div class="cv">{{ fmt(d.montant) }} FCFA</div></div>
            <div class="cell"><div class="cl">CANAL</div><div class="cv">{{ d.canal || '—' }}</div></div>
            <div class="cell"><div class="cl">AGENCE</div><div class="cv">{{ d.agence || '—' }}</div></div>
            <div class="cell"><div class="cl">RÉFÉRENCE DE TRANSACTION</div><div class="cv">{{ d.reference || '—' }}</div></div>
            <div class="cell"><div class="cl">RÉFÉRENCE DE VÉRIFICATION</div><div class="cv">{{ d.referenceVerification || '—' }}</div></div>
            <div class="cell"><div class="cl">DATE DU TRANSFERT</div><div class="cv">{{ d.dateTransfert }}</div></div>
            <div class="cell"><div class="cl">STATUT</div><div class="cv">{{ d.statut }}</div></div>
            <div class="cell"><div class="cl">CUMUL DU MOIS</div><div class="cv">{{ fmt(d.cumulMois) }} FCFA</div></div>
            <div class="cell"><div class="cl">FAIT PAR (AGENT)</div><div class="cv">{{ d.agentNom || '—' }}</div></div>
            @if (d.motif) {
              <div class="cell motif"><div class="cl">MOTIF ({{ d.statut }})</div><div class="cv">{{ d.motif }}</div></div>
            }
          </div>

          <div class="popup-actions">
            <button class="navi btn-gris" (click)="fermerDetails()">Fermer</button>
            <button class="lift btn btn-confirm" (click)="imprimer(d)">Imprimer le bordereau (PDF)</button>
          </div>
        </div>
      </div>
    }
  </div>
  `,
  styles: [`
    .carte { background:#fff; border:1px solid var(--bordure); border-radius:18px; padding:22px 24px; box-shadow:0 4px 20px -12px rgba(0,0,0,.25); }
    .recherche { display:flex; gap:12px; margin-bottom:20px; }
    .recherche .fld { flex:1; }
    .recherche .fin { width:100%; }
    .btn { border:none; cursor:pointer; padding:12px 24px; border-radius:12px; font-size:13.5px; font-weight:700; color:#fff; background:linear-gradient(135deg,var(--rouge),var(--rouge-fonce)); box-shadow:0 10px 24px -12px rgba(215,25,32,.8); white-space:nowrap; }
    .err { text-align:center; color:var(--rouge); font-size:13px; font-weight:700; margin:20px 0; }
    .vide { text-align:center; color:var(--gris); font-size:13.5px; padding:30px 0; }
    .tbl { width:100%; border-collapse:collapse; font-size:13.5px; }
    .tbl th { text-align:left; font-size:11px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; color:#8a8f97; padding:12px 18px; border-bottom:1px solid var(--bordure); white-space:nowrap; background:#fafafb; }
    .tbl td { padding:14px 18px; border-bottom:1px solid var(--bordure); color:var(--encre); }
    .tbl tbody tr { transition:background .12s ease; }
    .tbl tbody tr:hover { background:#fbf7f7; }
    .tbl tbody tr:last-child td { border-bottom:none; }
    .nom { white-space:nowrap; }
    .client { display:flex; align-items:center; gap:10px; }
    .avatar { flex:none; width:32px; height:32px; border-radius:50%; background:#eceef1; color:#3a3d44; font-size:11px; font-weight:800; letter-spacing:.2px; display:flex; align-items:center; justify-content:center; }
    .pill { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; }
    .pill::before { content:''; width:6px; height:6px; border-radius:50%; background:currentColor; flex:none; }
    .st-ok { background:#e8f5e9; color:#1f9d43; }
    .st-rej { background:#fdeceb; color:var(--rouge); }
    .st-ann { background:#f1f2f4; color:#6b7078; }
    .st-attente { background:#fff4e5; color:#b96a00; }
    .acts { display:flex; gap:14px; white-space:nowrap; }
    .lien { font-size:11.5px; font-weight:700; cursor:pointer; border:1px solid #e4e6ea; background:#fff; color:var(--encre); padding:6px 12px; border-radius:8px; white-space:nowrap; text-decoration:none; display:inline-block; }
    .lien:hover { border-color:#c9ccd2; background:#f7f8fa; }
    .lien-danger { color:var(--rouge); border-color:#f3c8ca; }
    .lien-danger:hover { background:#fdf3f3; border-color:var(--rouge); }
    .table-wrap { overflow-x:auto; }
    .actions-cell { display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap; min-width:290px; }
    .lien-danger { color:var(--rouge); }
    .motif-col { color:var(--rouge); font-weight:600; font-size:12px; min-width:170px; max-width:240px; line-height:1.5; }
    .no-coupe { white-space:nowrap; }
    .saisi { font-size:12px; color:var(--gris); white-space:nowrap; }
    .saisi b { display:block; color:var(--encre); font-size:12.5px; }
    .voile { position:fixed; inset:0; z-index:100; background:rgba(12,14,18,.55); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; padding:20px; }
    .popup { background:#fff; border-radius:18px; width:100%; max-width:480px; padding:26px 28px; box-shadow:0 30px 70px -20px rgba(0,0,0,.5); animation:pop .18s ease-out; }
    @keyframes pop { from { transform:scale(.94); opacity:0; } to { transform:scale(1); opacity:1; } }
    .popup-details { max-width:660px; max-height:88vh; overflow-y:auto; }
    .fiche { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .cell { background:#f7f8fa; border:1px solid var(--bordure); border-radius:12px; padding:12px 14px; }
    .cl { font-size:10.5px; color:#8a8f97; font-weight:700; letter-spacing:.4px; }
    .cv { font-size:13.5px; font-weight:700; margin-top:3px; color:var(--encre); word-break:break-word; }
    .motif { grid-column:1 / -1; border-color:var(--rouge); background:#fff7f7; }
    .popup-tete { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
    .popup-titre { font-size:18px; font-weight:800; letter-spacing:-.3px; color:var(--rouge); }
    .popup-x { border:none; background:#f1f2f4; width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:13px; color:var(--gris); }
    .popup-x:hover { background:#e4e6ea; }
    .popup-resume { background:#f7f8fa; border:1px solid var(--bordure); border-radius:12px; padding:6px 16px; margin-bottom:18px; }
    .pr-ligne { display:flex; justify-content:space-between; align-items:center; padding:9px 0; font-size:13px; }
    .pr-ligne + .pr-ligne { border-top:1px solid #ececf0; }
    .pr-ligne span { color:var(--gris); }
    .popup-label { display:block; font-size:13px; font-weight:700; margin-bottom:7px; }
    .oblig { color:var(--rouge); font-weight:600; font-size:12px; }
    .popup-actions { display:flex; gap:12px; margin-top:20px; }
    .popup-actions .btn-confirm { flex:1; }
    .motif-zone { width:100%; resize:vertical; font-family:inherit; }
    .motif-compteur { font-size:11.5px; color:var(--rouge); font-weight:700; margin-top:6px; }
    .motif-compteur.ok { color:#2e7d32; }
    .motif-actions { display:flex; gap:12px; justify-content:flex-end; margin-top:14px; }
    .btn-gris { border:1px solid #e4e6ea; cursor:pointer; padding:11px 20px; border-radius:12px; font-size:13px; font-weight:700; color:var(--encre); background:#fff; }
  `]
})
export class ListeComponent implements OnInit {
  private transferts_ = inject(TransfertService);
  private route = inject(ActivatedRoute);
 
  mode: Mode = 'historique';
  transferts: Transfert[] = [];
  recherche = '';
  erreur = '';
  cible: Transfert | null = null;
  detailsCible: Transfert | null = null;
  action: 'annulation' | 'rejet' = 'annulation';
  motif = '';
  erreurMotif = '';
  envoi = false;
 
  ngOnInit(): void {
    this.mode = (this.route.snapshot.data['mode'] as Mode) ?? 'historique';
    this.charger();
  }
 
  charger(): void {
    this.erreur = '';
    const flux = this.mode === 'annulation'
      ? this.transferts_.annulables(this.recherche)
      : this.transferts_.historique(this.recherche);
 
    flux.subscribe({
      next: liste => { this.transferts = liste; },
      error: () => { this.erreur = 'Erreur lors du chargement des transferts.'; }
    });
  }
 
  voirDetails(t: Transfert): void {
    this.detailsCible = t;
  }

  fermerDetails(): void {
    this.detailsCible = null;
  }

  ouvrirMotif(t: Transfert, action: 'annulation' | 'rejet'): void {
    this.cible = t;
    this.action = action;
    this.motif = '';
    this.erreurMotif = '';
  }
 
  fermerMotif(): void {
    this.cible = null;
    this.motif = '';
    this.erreurMotif = '';
  }
 
  confirmer(): void {
    if (!this.cible) return;
    if (this.motif.trim().length < 10) {
      this.erreurMotif = 'Le motif doit contenir au moins 10 caractères.';
      return;
    }
    this.envoi = true;
    this.erreurMotif = '';
    const flux = this.action === 'annulation'
      ? this.transferts_.annuler(this.cible.id, this.motif.trim())
      : this.transferts_.rejeter(this.cible.id, this.motif.trim());
    flux.subscribe({
      next: () => { this.envoi = false; this.fermerMotif(); this.charger(); },
      error: err => {
        this.envoi = false;
        this.erreurMotif = err?.error?.message ?? "Impossible d'effectuer cette opération.";
      }
    });
  }
 
  imprimer(t: Transfert): void {
    imprimerBordereau(t);
  }
 
  fmt(n: number): string {
    return Number(n || 0).toLocaleString('fr-FR');
  }

  initiales(nom: string): string {
    return (nom || '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(mot => mot.charAt(0).toUpperCase())
      .join('');
  }

  statutClasse(statut: string): string {
    const s = (statut || '').toLowerCase();
    if (s.includes('exécut')) return 'pill st-ok';
    if (s.includes('rejet')) return 'pill st-rej';
    if (s.includes('annul')) return 'pill st-ann';
    if (s.includes('attente') || s.includes('justificatif')) return 'pill st-attente';
    return 'pill st-ann';
  }
}
 
