import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TraductionService } from '../../core/traduction/traduction.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
  <div class="cin page-photo">
    <div class="carte-connexion">

      <div class="logo-carte">
        <img src="assets/images/AFB.png" alt="Afriland First Bank">
      </div>

      <h1 class="titre-carte">
        {{ tr.t('login.retourTitre1') }}<br>
        <span class="accent">{{ tr.t('login.retourTitre2') }}</span>
      </h1>
      <p class="desc-carte">{{ tr.t('login.pitch') }}</p>

      <div class="badge-securise">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        {{ tr.t('login.accesSecurise') }}
      </div>

      <label>{{ tr.t('login.email') }}</label>

        <div class="fld m16">
          <span class="ic">
            <svg width="18" height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">

              <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </span>

          <input
            class="fin"
            [(ngModel)]="email"
            type="email"
            autocomplete="email"
            placeholder="nom@entreprise.com">
        </div>

        <label>{{ tr.t('login.mdp') }}</label>
        <div class="fld m10">
          <span class="ic">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <input
            class="fin avec-oeil"
            [(ngModel)]="motDePasse"
            [type]="mdpVisible ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••"
            (keyup.enter)="connexion()">
          <button type="button" class="oeil" (click)="mdpVisible = !mdpVisible" [attr.aria-label]="mdpVisible ? tr.t('login.masquerMdp') : tr.t('login.afficherMdp')">
            @if (mdpVisible) {
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.86 21.86 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.86 21.86 0 0 1-3.22 4.44M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            } @else {
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>

        <div class="ligne">
          <label class="souvenir">
            <input type="checkbox" checked> {{ tr.t('login.souvenir') }}
          </label>
        </div>

        @if (erreur) {
          <div class="err">{{ erreur }}</div>
        }

        <button
          class="lift btn"
          (click)="connexion()"
          [disabled]="chargement">

          @if (chargement) {
            <span class="spin"></span>
          }
          {{ chargement ? tr.t('login.connexionEnCours') : tr.t('login.bouton') }}

        </button>

        <div class="pied-carte">
          <a routerLink="/">{{ tr.t('login.retourAccueil') }}</a>
          <a routerLink="/mot-de-passe-oublie">{{ tr.t('login.oubli') }}</a>
        </div>

        <div class="copyright-carte">{{ tr.t('commun.copyright') }}</div>

    </div>          <!-- fin .carte-connexion -->
  </div>            <!-- fin .page-photo -->
`,
  styles: [`
    .page-photo {
      min-height:100vh;
      width:100%;
      display:flex;
      align-items:center;
      justify-content:flex-end;
      padding:40px clamp(24px, 6vw, 90px);
      background:
        linear-gradient(100deg, rgba(255,255,255,.12), rgba(255,255,255,0) 45%),
        url('/assets/images/landing-bg.jpg') center/cover no-repeat;
    }

    .carte-connexion {
      width:440px;
      max-width:100%;
      background:var(--surface);
      border-radius:22px;
      box-shadow:0 30px 70px -25px rgba(15,17,20,.5);
      padding:40px 40px 32px;
    }

    .logo-carte { display:inline-flex; border-radius:14px; background:var(--surface); border:1px solid var(--bordure); padding:8px 12px; box-shadow:0 8px 18px -8px rgba(215,25,32,.35); margin-bottom:22px; }
    .logo-carte img { display:block; height:46px; width:auto; object-fit:contain; }

    .titre-carte { font-size:28px; font-weight:800; line-height:1.18; letter-spacing:-.4px; color:var(--encre); margin:0 0 10px; font-family:'Sora','Manrope',sans-serif; }
    .titre-carte .accent { color:var(--rouge); }
    .desc-carte { color:var(--gris); font-size:14px; line-height:1.6; margin:0 0 18px; max-width:360px; }

    .badge-securise { display:inline-flex; align-items:center; gap:6px; background:var(--rouge-fond); color:var(--rouge-fonce); font-size:11.5px; font-weight:700; letter-spacing:.2px; padding:6px 12px; border-radius:100px; margin-bottom:24px; }

    label { font-size:12.5px; font-weight:700; color:var(--texte); display:block; margin-bottom:7px; }
    .m16 { margin-bottom:16px; } .m10 { margin-bottom:10px; }

    .fld .fin.avec-oeil { padding-right:42px; }
    .oeil { position:absolute; right:10px; top:50%; transform:translateY(-50%); border:none; background:none; color:var(--texte-faible); cursor:pointer; display:flex; padding:6px; border-radius:8px; }
    .oeil:hover { color:var(--rouge); background:var(--rouge-fond); }

    .ligne { display:flex; align-items:center; margin:6px 0 20px; }
    .souvenir { display:flex; align-items:center; gap:8px; font-size:12.5px; font-weight:500; color:var(--gris-texte); cursor:pointer; margin:0; }
    .souvenir input { accent-color:var(--rouge); width:15px; height:15px; }
    .err { text-align:center; color:var(--rouge); background:var(--rouge-fond); border-radius:10px; padding:10px; font-size:13px; font-weight:700; margin:0 0 16px; }

    .btn { width:100%; display:flex; align-items:center; justify-content:center; gap:10px; border:none; background:linear-gradient(135deg,var(--rouge),var(--rouge-fonce)); color:#fff; font-weight:700; font-size:15px; padding:15px; border-radius:14px; cursor:pointer; box-shadow:0 16px 32px -12px rgba(215,25,32,.85); }
    .btn:disabled { opacity:.75; cursor:default; }
    .spin { width:15px; height:15px; border-radius:50%; border:2px solid rgba(255,255,255,.4); border-top-color:#fff; animation:tourne .7s linear infinite; }
    @keyframes tourne { to { transform:rotate(360deg); } }

    .pied-carte { display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:18px; border-top:1px solid var(--bordure); }
    .pied-carte a { font-size:12.5px; font-weight:700; color:var(--gris); }
    .pied-carte a:hover { color:var(--rouge); }

    .copyright-carte { text-align:center; margin-top:16px; font-size:11.5px; color:var(--texte-faible); }

    @media (max-width:640px){
      .page-photo {
        justify-content:center;
        padding:22px;
        background:
          linear-gradient(rgba(255,255,255,.6), rgba(255,255,255,.6)),
          url('/assets/images/landing-bg.jpg') center/cover no-repeat;
      }
      .carte-connexion { padding:30px 24px 26px; }
    }
  `]
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  tr = inject(TraductionService);

  email = '';
  motDePasse = '';
  erreur = '';
  chargement = false;
  mdpVisible = false;

  connexion(): void {

    if (!this.email.trim() || !this.motDePasse.trim()) {
      this.erreur = this.tr.t('login.erreurChampsRequis');
      return;
    }

    this.erreur = '';
    this.chargement = true;

    this.auth.login(this.email, this.motDePasse).subscribe({

      next: () => {
        this.chargement = false;
        // routeAccueil() gère tout : /change-password si firstLogin,
        // sinon /admin/dashboard ou /app/verification selon le rôle.
        this.router.navigate([this.auth.routeAccueil()]);
      },
      error: err => {
        this.erreur =
          err?.error?.message ??
          this.tr.t('login.erreurIdentifiants');
        this.chargement = false;
      }

    });

  }
}
