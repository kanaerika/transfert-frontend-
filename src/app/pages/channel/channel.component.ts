import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransfertService } from '../../services/transfert.service';
import { TraductionService } from '../../core/traduction/traduction.service';

interface CanalUi {
  nom: string;
  description: string;
  couleur: string;
}

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [RouterLink],
  template: `
  <div class="cin page">
    <div class="halo h1"></div>
    <div class="halo h2"></div>
    <div class="grille"></div>

    <div class="marque">
      <div class="logo"><img src="assets/images/AFB.png" alt="Afriland First Bank"></div>
    </div>

    <div class="entete">
      <div class="badge">{{ tr.t('channel.etapeFinale') }}</div>
      <h1 class="disp">{{ tr.t('channel.titre') }}</h1>
      <p>{{ tr.t('channel.sousTitre') }}</p>
    </div>

    <div class="cartes">
      @for (c of canaux; track c.nom) {
        <button class="lift carte" (click)="choisir(c.nom)">
          <div class="haut">
            <div class="icone" [style.background]="c.couleur">
              <!-- Globe (MoneyGram) / Avion (Small World) -->
              @if (c.nom === 'MoneyGram') {
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              } @else {
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              }
            </div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>
          </div>
          <div class="disp titre">{{ c.nom }}</div>
          <div class="desc">{{ c.description }}</div>
        </button>
      }
    </div>

    <button class="navi retour" routerLink="/connexion">{{ tr.t('channel.retour') }}</button>
  </div>
  `,
  styles: [`
    .page { min-height:100vh; background:#0b0c10; position:relative; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 24px; }
    .halo { position:absolute; border-radius:50%; }
    .h1 { width:620px; height:620px; background:radial-gradient(closest-side,rgba(215,25,32,.4),transparent); filter:blur(50px); top:-160px; right:-120px; animation:meshmove 18s ease-in-out infinite; }
    .h2 { width:460px; height:460px; background:radial-gradient(closest-side,rgba(120,20,25,.5),transparent); filter:blur(45px); bottom:-140px; left:-100px; animation:meshmove 22s ease-in-out infinite reverse; }
    .grille { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px); background-size:48px 48px; }
    .marque { position:relative; display:flex; align-items:center; gap:12px; color:#fff; margin-bottom:30px; }
    .logo { border-radius:16px; background:#fff; padding:15px 19px; box-shadow:0 10px 26px -8px rgba(215,25,32,.9); }
    .logo img { display:block; height:56px; width:auto; object-fit:contain; }
    .entete { position:relative; text-align:center; margin-bottom:34px; }
    .badge { display:inline-flex; align-items:center; gap:8px; background:rgba(215,25,32,.14); border:1px solid rgba(215,25,32,.35); color:#ff6b73; font-size:11.5px; font-weight:700; padding:6px 13px; border-radius:20px; letter-spacing:.3px; margin-bottom:16px; }
    h1 { color:#fff; font-size:34px; font-weight:700; margin:0; letter-spacing:-.4px; }
    .entete p { color:rgba(255,255,255,.55); font-size:14.5px; margin:12px 0 0; }
    .cartes { position:relative; display:flex; flex-wrap:wrap; gap:16px; justify-content:center; max-width:900px; }
    .carte { width:264px; text-align:left; cursor:pointer; background:rgba(255,255,255,.045); border:1px solid rgba(255,255,255,.1); border-radius:18px; padding:20px; backdrop-filter:blur(10px); }
    .haut { display:flex; align-items:center; justify-content:space-between; }
    .icone { width:48px; height:48px; border-radius:13px; display:flex; align-items:center; justify-content:center; color:#fff; }
    .titre { color:#fff; font-size:17px; font-weight:700; margin-top:16px; }
    .desc { color:rgba(255,255,255,.5); font-size:12.5px; margin-top:4px; line-height:1.4; }
    .retour { position:relative; margin-top:34px; border:none; background:none; color:rgba(255,255,255,.5); font-weight:600; font-size:12.5px; cursor:pointer; }
  `]
})
export class ChannelComponent implements OnInit {
  private auth = inject(AuthService);
  private transferts = inject(TransfertService);
  private router = inject(Router);
  tr = inject(TraductionService);

  // Valeurs par défaut, remplacées par le référentiel de l'API
  canaux: CanalUi[] = [
    { nom: 'MoneyGram', description: 'Transfert international · réseau MoneyGram', couleur: '#d71920' },
    { nom: 'Small World', description: 'Transfert international · réseau Small World', couleur: '#2a2c33' }
  ];

  ngOnInit(): void {
    this.transferts.referentiel().subscribe({
      next: ref => {
        this.canaux = ref.canaux.map((c, i) => ({
          nom: c.nom,
          description: c.description,
          couleur: i === 0 ? '#d71920' : '#2a2c33'
        }));
      },
      error: () => { /* valeurs par défaut conservées */ }
    });
  }

  choisir(nom: string): void {
    this.auth.choisirCanal(nom);
    this.router.navigate(['/app/verification']);
  }
}