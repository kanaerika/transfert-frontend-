import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransfertService } from '../services/transfert.service';
import { Transfert } from '../models/models';
import { imprimerBordereau } from '../core/bordereau';

interface InfoStatut {
  classe: string;
  icone: 'check' | 'x' | 'ban' | 'clock';
  titre: string;
  sousTitre: string;
}

@Component({
  selector: 'app-transfert-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  @if (transfert; as tr) {
    @if (infoStatut(tr.statut); as info) {
      <div class="carte">

        @if (popup) {
          <button class="popup-x popup-x-flottant" (click)="fermer.emit()">✕</button>
        }

        <div class="banniere" [class]="info.classe">
          <div class="banniere-motif"></div>
          <div class="banniere-gauche">
            <div class="icone-statut">
              @switch (info.icone) {
                @case ('check') { <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
                @case ('x') { <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
                @case ('ban') { <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="5.5" y1="5.5" x2="18.5" y2="18.5"/></svg> }
                @case ('clock') { <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/></svg> }
              }
            </div>
            <div>
              <div class="statut-titre">{{ info.titre }}</div>
              <div class="statut-ref">{{ tr.referenceVerification || tr.reference || '—' }}</div>
              <div class="statut-sous">{{ info.sousTitre }}</div>
            </div>
          </div>
          <div class="montant-box">
            <div class="montant-lbl">Montant du transfert</div>
            <div class="montant-val">{{ format(tr.montant) }} FCFA</div>
          </div>
        </div>

        <div class="corps-grille">
          <div class="colonne-principale">

            <div class="section">
              <div class="section-entete">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Client
              </div>
              <div class="grille2">
                <div class="champ"><span class="lbl">Nom</span><span class="val">{{ tr.nomClient }}</span></div>
                <div class="champ"><span class="lbl">Date de naissance</span><span class="val">{{ tr.dateNaissance || '—' }}</span></div>
                <div class="champ"><span class="lbl">Nature de pièce</span><span class="val">{{ tr.naturePiece || '—' }}</span></div>
                <div class="champ"><span class="lbl">N° de pièce</span><span class="val">{{ tr.numeroPiece || '—' }}</span></div>
              </div>
            </div>

            <div class="section">
              <div class="section-entete">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                Opération
              </div>
              <div class="grille2">
                <div class="champ"><span class="lbl">Pays destination</span><span class="val">{{ tr.paysDestination }}</span></div>
                <div class="champ"><span class="lbl">Canal</span><span class="val">{{ tr.canal || '—' }}</span></div>
                <div class="champ"><span class="lbl">Référence plateforme</span><span class="val">{{ tr.reference || '—' }}</span></div>
                <div class="champ"><span class="lbl">Date</span><span class="val">{{ tr.dateTransfert }}</span></div>
                <div class="champ"><span class="lbl">Cumul du mois</span><span class="val">{{ format(tr.cumulMois) }} FCFA</span></div>
                <div class="champ"><span class="lbl">Agence</span><span class="val">{{ tr.agence || '—' }}</span></div>
              </div>
            </div>

            @if (tr.motif) {
              <div class="section">
                <div class="section-entete">Motif</div>
                <div class="motif-bloc">{{ tr.motif }}</div>
              </div>
            }

            @if (estCloturable(tr.statut)) {
              <div class="section">
                <div class="section-entete">Clôturer ce transfert</div>
                <div class="cloture-actions">
                  <button class="btn-outline btn-danger" (click)="ouvrirCloture('annulation')">Annuler</button>
                  <button class="btn-outline btn-danger" (click)="ouvrirCloture('rejet')">Rejeter</button>
                </div>
              </div>
            }

          </div>

          <div class="colonne-laterale">
            <div class="badge-central" [class]="info.classe">
              @switch (info.icone) {
                @case ('check') { <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
                @case ('x') { <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
                @case ('ban') { <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="5.5" y1="5.5" x2="18.5" y2="18.5"/></svg> }
                @case ('clock') { <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/></svg> }
              }
            </div>

            <div class="info-ligne">
              <span class="info-ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
              <div><div class="info-lbl">Date et heure du transfert</div><div class="info-val">{{ tr.dateTransfert }}</div></div>
            </div>

            <div class="info-ligne">
              <span class="info-ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg></span>
              <div><div class="info-lbl">Référence de transaction</div><div class="info-val">{{ tr.reference || tr.referenceVerification || '—' }}</div></div>
            </div>

            <div class="info-note">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Veuillez conserver cette référence pour vos prochaines opérations.
            </div>
          </div>
        </div>

        <div class="pied-actions">
          <div class="pied-gauche">
            <button class="btn-outline" (click)="imprimer(tr)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Imprimer le bordereau
            </button>
            <button class="btn-outline" (click)="imprimer(tr)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Télécharger (PDF)
            </button>
          </div>
          <button class="btn-principal" (click)="fermer.emit()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {{ popup ? 'Fermer' : 'Retour au bilan' }}
          </button>
        </div>
      </div>
    }
  }

  @if (cloture(); as action) {
    <div class="voile" (click)="fermerCloture()">
      <div class="popup" (click)="$event.stopPropagation()">
        <div class="popup-tete">
          <div class="popup-titre">{{ action === 'annulation' ? 'Annuler ce transfert' : 'Rejeter ce transfert' }}</div>
          <button class="popup-x" (click)="fermerCloture()">✕</button>
        </div>

        <label class="popup-label">Motif {{ action === 'annulation' ? "de l'annulation" : 'du rejet' }} <span class="oblig">— obligatoire</span></label>
        <textarea class="in motif-zone" [(ngModel)]="motif" rows="3"
                  placeholder="Expliquez pourquoi cette opération est {{ action === 'annulation' ? 'annulée' : 'rejetée' }} (au moins 10 caractères)…"></textarea>
        <div class="motif-compteur" [class.ok]="motif.trim().length >= 10">
          {{ motif.trim().length >= 10 ? '✓ Motif valide' : motif.trim().length + '/10 caractères minimum' }}
        </div>
        @if (erreurMotif()) { <div class="err">{{ erreurMotif() }}</div> }

        <div class="popup-actions">
          <button class="btn-outline" (click)="fermerCloture()">Retour</button>
          <button class="btn-principal btn-confirm" [disabled]="motif.trim().length < 10 || envoi()"
                  (click)="confirmerCloture()">
            {{ envoi() ? 'Envoi…' : (action === 'annulation' ? "Confirmer l'annulation" : 'Confirmer le rejet') }}
          </button>
        </div>
      </div>
    </div>
  }
  `,
  styles: [`
    .carte { position:relative; background:var(--surface); border:1px solid var(--bordure); border-radius:18px; overflow:hidden; box-shadow:0 4px 20px -12px rgba(0,0,0,.25); }
    .popup-x-flottant { position:absolute; top:16px; right:16px; z-index:2; border:none; background:rgba(255,255,255,.22); color:#fff; width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:13px; }
    .popup-x-flottant:hover { background:rgba(255,255,255,.35); }

    /* ---- Bannière statut ---- */
    .banniere { position:relative; display:flex; justify-content:space-between; align-items:center; gap:20px; padding:26px 30px; color:#fff; overflow:hidden; flex-wrap:wrap; }
    .banniere-motif { position:absolute; inset:0; background-image:repeating-linear-gradient(115deg, rgba(255,255,255,.08) 0 10px, transparent 10px 24px); pointer-events:none; }
    .e-execute { background:linear-gradient(135deg,var(--vert),#0d6d3a); }
    .e-refuse, .e-rejete { background:linear-gradient(135deg,var(--rouge),#a00d25); }
    .e-annule { background:linear-gradient(135deg,#e08a00,#b36f00); }
    .e-cours { background:linear-gradient(135deg,#1f6feb,#0d4a9e); }
    .e-autre { background:linear-gradient(135deg,#4a4d54,#2c2e33); }
    .banniere-gauche { position:relative; display:flex; align-items:center; gap:16px; z-index:1; }
    .icone-statut { flex:none; width:52px; height:52px; border-radius:50%; background:rgba(255,255,255,.18); border:1.5px solid rgba(255,255,255,.4); display:flex; align-items:center; justify-content:center; }
    .statut-titre { font-size:12px; font-weight:800; letter-spacing:.6px; text-transform:uppercase; opacity:.9; }
    .statut-ref { font-size:24px; font-weight:800; letter-spacing:-.3px; margin-top:2px; }
    .statut-sous { font-size:12.5px; opacity:.85; margin-top:4px; }
    .montant-box { position:relative; z-index:1; background:var(--surface); border-radius:14px; padding:14px 20px; text-align:right; box-shadow:0 10px 24px -12px rgba(0,0,0,.35); }
    .montant-lbl { font-size:10.5px; font-weight:700; letter-spacing:.4px; text-transform:uppercase; color:var(--gris-texte); }
    .montant-val { font-size:19px; font-weight:800; color:var(--encre); margin-top:2px; }

    /* ---- Corps ---- */
    .corps-grille { display:grid; grid-template-columns:1fr 260px; gap:0; }
    .colonne-principale { padding:26px 30px; }
    .colonne-laterale { padding:26px 24px; border-left:1px solid var(--bordure); background:var(--surface-2); display:flex; flex-direction:column; align-items:center; gap:16px; }
    .section { margin-bottom:22px; }
    .section:last-child { margin-bottom:0; }
    .section-entete { display:flex; align-items:center; gap:8px; font-size:11px; text-transform:uppercase; letter-spacing:.5px; color:var(--gris-texte); font-weight:800; margin-bottom:14px; }
    .grille2 { display:grid; grid-template-columns:1fr 1fr; gap:14px 24px; }
    .champ { display:flex; flex-direction:column; gap:3px; padding-bottom:10px; border-bottom:1px solid var(--bordure); }
    .lbl { font-size:12px; color:var(--gris-texte); }
    .val { font-size:14px; color:var(--encre); font-weight:600; }
    .motif-bloc { background:var(--rouge-fond); border-left:3px solid var(--rouge); border-radius:8px; padding:12px 14px; font-size:13.5px; color:var(--rouge); line-height:1.5; }

    .cloture-actions { display:flex; gap:12px; }

    .badge-central { width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; opacity:.92; }
    .info-ligne { width:100%; display:flex; align-items:flex-start; gap:10px; background:var(--surface); border:1px solid var(--bordure); border-radius:12px; padding:12px 14px; }
    .info-ic { flex:none; width:26px; height:26px; border-radius:50%; background:var(--rouge-fond); color:var(--rouge); display:flex; align-items:center; justify-content:center; }
    .info-lbl { font-size:11px; color:var(--gris-texte); }
    .info-val { font-size:13px; font-weight:700; color:var(--encre); margin-top:2px; word-break:break-word; }
    .info-note { width:100%; display:flex; align-items:flex-start; gap:8px; background:var(--rouge-fond); color:var(--rouge); border-radius:12px; padding:12px 14px; font-size:12px; line-height:1.5; }
    .info-note svg { flex:none; margin-top:1px; }

    /* ---- Pied ---- */
    .pied-actions { display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; padding:20px 30px; border-top:1px solid var(--bordure); background:var(--surface-2); }
    .pied-gauche { display:flex; gap:12px; flex-wrap:wrap; }
    .btn-outline { display:inline-flex; align-items:center; gap:8px; border:1px solid var(--bordure); background:var(--surface); color:var(--encre); cursor:pointer; padding:11px 18px; border-radius:12px; font-size:13px; font-weight:700; }
    .btn-outline:hover { border-color:var(--gris-bordure); background:var(--gris-clair); }
    .btn-outline:disabled { opacity:.5; cursor:default; }
    .btn-danger { color:var(--rouge); border-color:rgba(215,25,32,.3); }
    .btn-danger:hover { background:var(--rouge-fond); border-color:var(--rouge); }
    .btn-principal { display:inline-flex; align-items:center; gap:8px; border:none; cursor:pointer; padding:12px 22px; border-radius:12px; font-size:13.5px; font-weight:700; color:#fff; background:linear-gradient(135deg,var(--rouge),var(--rouge-fonce)); box-shadow:0 10px 24px -12px rgba(215,25,32,.8); white-space:nowrap; }
    .btn-principal:disabled { opacity:.5; cursor:default; }

    /* ---- Popup clôture ---- */
    .voile { position:fixed; inset:0; z-index:100; background:rgba(12,14,18,.55); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; padding:20px; }
    .popup { background:var(--surface); border-radius:18px; width:100%; max-width:480px; padding:26px 28px; box-shadow:0 30px 70px -20px rgba(0,0,0,.5); animation:pop .18s ease-out; }
    @keyframes pop { from { transform:scale(.94); opacity:0; } to { transform:scale(1); opacity:1; } }
    .popup-tete { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
    .popup-titre { font-size:18px; font-weight:800; letter-spacing:-.3px; color:var(--rouge); }
    .popup-x { border:none; background:var(--gris-clair); width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:13px; color:var(--gris); }
    .popup-x:hover { background:var(--bordure); }
    .popup-label { display:block; font-size:13px; font-weight:700; margin-bottom:7px; }
    .oblig { color:var(--rouge); font-weight:600; font-size:12px; }
    .popup-actions { display:flex; gap:12px; margin-top:20px; }
    .popup-actions .btn-confirm { flex:1; justify-content:center; }
    .motif-zone { width:100%; resize:vertical; font-family:inherit; background:var(--surface); color:var(--texte); }
    .motif-compteur { font-size:11.5px; color:var(--rouge); font-weight:700; margin-top:6px; }
    .motif-compteur.ok { color:var(--vert); }
    .err { text-align:center; color:var(--rouge); font-size:13px; font-weight:700; margin:14px 0 0; }

    @media (max-width:760px) {
      .corps-grille { grid-template-columns:1fr; }
      .colonne-laterale { border-left:none; border-top:1px solid var(--bordure); }
      .banniere { flex-direction:column; align-items:flex-start; }
      .montant-box { text-align:left; }
      .grille2 { grid-template-columns:1fr; }
      .pied-actions { flex-direction:column; align-items:stretch; }
      .pied-gauche { justify-content:stretch; }
      .btn-principal { justify-content:center; }
    }
  `]
})
export class TransfertCardComponent {
  private transferts = inject(TransfertService);

  @Input() transfert: Transfert | null = null;
  @Input() popup = false;
  @Output() fermer = new EventEmitter<void>();
  @Output() misAJour = new EventEmitter<Transfert>();

  cloture = signal<'annulation' | 'rejet' | null>(null);
  motif = '';
  erreurMotif = signal('');
  envoi = signal(false);

  format(m: number): string {
    return new Intl.NumberFormat('fr-FR').format(m);
  }

  imprimer(t: Transfert): void {
    imprimerBordereau(t);
  }

  estCloturable(statut: string): boolean {
    return statut.toLowerCase().includes('exécuté');
  }

  infoStatut(statut: string): InfoStatut {
    const s = statut.toLowerCase();
    if (s.includes('exécuté')) {
      return { classe: 'e-execute', icone: 'check', titre: 'Transfert exécuté', sousTitre: 'Ce transfert a été exécuté avec succès.' };
    }
    if (s.includes('refusé') || s.includes('plafond')) {
      return { classe: 'e-refuse', icone: 'x', titre: 'Transfert refusé', sousTitre: 'Ce transfert a été refusé.' };
    }
    if (s.includes('rejeté')) {
      return { classe: 'e-rejete', icone: 'x', titre: 'Transfert rejeté', sousTitre: 'Ce transfert a été rejeté.' };
    }
    if (s.includes('annulé')) {
      return { classe: 'e-annule', icone: 'ban', titre: 'Transfert annulé', sousTitre: 'Ce transfert a été annulé.' };
    }
    if (s.includes('cours')) {
      return { classe: 'e-cours', icone: 'clock', titre: 'Transfert en cours', sousTitre: 'Ce transfert est en attente de clôture.' };
    }
    return { classe: 'e-autre', icone: 'clock', titre: statut, sousTitre: "Détail de l'opération." };
  }

  ouvrirCloture(action: 'annulation' | 'rejet'): void {
    this.cloture.set(action);
    this.motif = '';
    this.erreurMotif.set('');
  }

  fermerCloture(): void {
    this.cloture.set(null);
    this.motif = '';
    this.erreurMotif.set('');
  }

  confirmerCloture(): void {
    const tr = this.transfert;
    const action = this.cloture();
    if (!tr || !action) return;
    if (this.motif.trim().length < 10) {
      this.erreurMotif.set('Le motif doit contenir au moins 10 caractères.');
      return;
    }
    this.envoi.set(true);
    this.erreurMotif.set('');
    const flux = action === 'annulation'
      ? this.transferts.annuler(tr.id, this.motif.trim())
      : this.transferts.rejeter(tr.id, this.motif.trim());
    flux.subscribe({
      next: majTr => {
        this.envoi.set(false);
        this.fermerCloture();
        this.misAJour.emit(majTr);
      },
      error: err => {
        this.envoi.set(false);
        this.erreurMotif.set(err?.error?.message ?? "Impossible d'effectuer cette opération.");
      }
    });
  }
}
