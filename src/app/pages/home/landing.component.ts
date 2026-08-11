import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TraductionService } from '../../core/traduction/traduction.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
  <div class="page">
    <!-- ===== Barre supérieure ===== -->
    <header class="haut">
      <div class="marque">
        <img src="assets/images/AFB.png" alt="Afriland First Bank" class="logo">
      </div>
      <div class="haut-actions">
        <button type="button" class="toggle-langue" (click)="tr.basculer()"
                [attr.aria-label]="tr.langue() === 'fr' ? 'Switch to English' : 'Passer en français'">
          <span [class.actif]="tr.langue() === 'fr'">FR</span>
          <span [class.actif]="tr.langue() === 'en'">EN</span>
        </button>
        <a routerLink="/connexion" class="btn-contour">{{ tr.t('commun.seConnecter') }}</a>
      </div>
    </header>

    <!-- ===== Héros : le message + le produit en action ===== -->
    <main class="heros">
      <div class="heros-txt">
        <div class="sur-titre">{{ tr.t('home.surTitre') }}</div>
        <h1>{{ tr.t('home.h1Debut') }} <em>{{ tr.t('home.h1Em') }}</em> {{ tr.t('home.h1Fin') }}</h1>
        <p class="pitch">{{ tr.t('home.pitch') }}</p>
        <div class="heros-actions">
          <a routerLink="/connexion" class="btn-plein">{{ tr.t('home.btnAcceder') }}</a>
        </div>
      </div>

      <!-- La pièce maîtresse : une vérification en direct -->
      <div class="demo" aria-hidden="true">
        <div class="demo-tete">
          <span class="demo-pastille"></span> {{ tr.t('home.demoTete') }}
        </div>
        <div class="demo-client">
          <div class="demo-op">{{ tr.t('home.demoOp') }}</div>
        </div>
        <svg viewBox="0 0 200 110" class="jauge">
          <path d="M 15 100 A 85 85 0 0 1 185 100" class="jauge-fond"/>
          <path d="M 15 100 A 85 85 0 0 1 185 100" class="jauge-plein"/>
          <text x="100" y="78" class="jauge-val">750 000</text>
          <text x="100" y="96" class="jauge-lib">{{ tr.t('home.jaugeLib') }}</text>
        </svg>
        <div class="demo-verdict">{{ tr.t('home.demoVerdict') }}</div>
      </div>
    </main>

    <!-- ===== Bandeau de confiance ===== -->
    <section class="confiance">
      <div class="stat">
        <span class="stat-ic">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5z"/></svg>
        </span>
        <div>
          <b>{{ tr.t('home.mention1Valeur') }}</b>
          <span>{{ tr.t('home.mention1Label') }}</span>
        </div>
      </div>
      <div class="stat">
        <span class="stat-ic">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </span>
        <div>
          <b>{{ tr.t('home.mention2Valeur') }}</b>
          <span>{{ tr.t('home.mention2Label') }}</span>
        </div>
      </div>
      <div class="stat">
        <span class="stat-ic">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>
        </span>
        <div>
          <b>{{ tr.t('home.mention3Valeur') }}</b>
          <span>{{ tr.t('home.mention3Label') }}</span>
        </div>
      </div>
    </section>

    <!-- ===== Avantages ===== -->
    <section class="avantages">
      <div class="avantages-entete">
        <div class="sur-titre">{{ tr.t('home.avantagesSurTitre') }}</div>
        <h2>{{ tr.t('home.avantagesTitre') }}</h2>
        <p>{{ tr.t('home.avantagesSousTitre') }}</p>
      </div>
      <div class="grille-avantages">
        <div class="carte-avantage">
          <div class="av-ic">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5z"/><path d="M9 12l2 2 4-4"/></svg>
          </div>
          <h3>{{ tr.t('home.avantage1Titre') }}</h3>
          <p>{{ tr.t('home.avantage1Texte') }}</p>
        </div>
        <div class="carte-avantage">
          <div class="av-ic">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h3>{{ tr.t('home.avantage2Titre') }}</h3>
          <p>{{ tr.t('home.avantage2Texte') }}</p>
        </div>
        <div class="carte-avantage">
          <div class="av-ic">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <h3>{{ tr.t('home.avantage3Titre') }}</h3>
          <p>{{ tr.t('home.avantage3Texte') }}</p>
        </div>
        <div class="carte-avantage">
          <div class="av-ic">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3>{{ tr.t('home.avantage4Titre') }}</h3>
          <p>{{ tr.t('home.avantage4Texte') }}</p>
        </div>
      </div>
    </section>

    <!-- ===== Le parcours de l'agent (vraie séquence) ===== -->
    <section class="parcours">
      <h2>{{ tr.t('home.parcoursTitre') }}</h2>
      <div class="etapes">
        <div class="etape">
          <div class="num">1</div>
          <h3>{{ tr.t('home.etape1Titre') }}</h3>
          <p>{{ tr.t('home.etape1Texte') }}</p>
        </div>
        <div class="etape">
          <div class="num">2</div>
          <h3>{{ tr.t('home.etape2Titre') }}</h3>
          <p>{{ tr.t('home.etape2Texte') }}</p>
        </div>
        <div class="etape">
          <div class="num">3</div>
          <h3>{{ tr.t('home.etape3Titre') }}</h3>
          <p>{{ tr.t('home.etape3Texte') }}</p>
        </div>
      </div>
    </section>

    <!-- ===== Bannière CTA ===== -->
    <section class="cta">
      <h2>{{ tr.t('home.ctaTitre') }}</h2>
      <p>{{ tr.t('home.ctaTexte') }}</p>
      <a routerLink="/connexion" class="btn-plein btn-clair">{{ tr.t('commun.seConnecter') }}</a>
    </section>

    <!-- ===== Pied de page ===== -->
    <footer class="pied">
      <div class="pied-haut">
        <div class="pied-marque">
          <img src="assets/images/AFB.png" alt="Afriland First Bank" class="pied-logo">
          <p>{{ tr.t('home.footerTagline') }}</p>
        </div>
        <nav class="pied-liens">
          <div class="pied-titre">{{ tr.t('home.footerLiens') }}</div>
          <a routerLink="/connexion">{{ tr.t('commun.seConnecter') }}</a>
          <a routerLink="/mot-de-passe-oublie">{{ tr.t('login.oubli') }}</a>
        </nav>
      </div>
      <div class="pied-bas">
        {{ tr.t('home.pied') }}
      </div>
    </footer>
  </div>
  `,
  styles: [`
    :host { display:block; }
    .page { min-height:100vh; background:#faf9f6; color:#16181d;
            font-family:'Inter', 'Segoe UI', sans-serif; }

    /* ---- Barre ---- */
    .haut { display:flex; justify-content:space-between; align-items:center;
            padding:22px clamp(24px, 6vw, 72px); border-bottom:1px solid #eceae4; }
    .marque { display:flex; align-items:center; gap:13px; }
    .logo { height:76px; width:auto; object-fit:contain; }
    .haut-actions { display:flex; align-items:center; gap:14px; }
    .btn-contour { border:1.5px solid #16181d; color:#16181d; text-decoration:none;
                   padding:10px 22px; border-radius:10px; font-size:13px; font-weight:700; }
    .btn-contour:hover { background:#16181d; color:#fff; }

    .toggle-langue { display:flex; align-items:center; gap:2px; border:1.5px solid #eceae4;
                     background:#faf9f6; border-radius:10px; padding:3px; cursor:pointer; }
    .toggle-langue span { padding:6px 12px; border-radius:7px; font-size:12px; font-weight:800;
                           letter-spacing:.03em; color:#8a8f97; transition:background .15s, color .15s; }
    .toggle-langue span.actif { background:#16181d; color:#fff; }
    .toggle-langue:hover span:not(.actif) { color:#4b5058; }

    /* ---- Héros ---- */
    .heros { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr);
             gap:clamp(30px, 5vw, 70px); align-items:center;
             padding:clamp(40px, 8vh, 90px) clamp(24px, 6vw, 72px);
             position:relative; background:
               linear-gradient(100deg, #faf9f6 32%, rgba(250,249,246,.88) 55%, rgba(250,249,246,.55) 75%, rgba(250,249,246,.25)),
               url('/assets/images/landing-bg.jpg') center/cover no-repeat; }
    .sur-titre { display:inline-block; font-size:11.5px; font-weight:700; letter-spacing:1.2px;
                 text-transform:uppercase; color:#d71920; border-left:3px solid #d71920;
                 padding-left:10px; margin-bottom:22px; }
    h1 { font-family:'Bricolage Grotesque', 'Inter', sans-serif; font-weight:800;
         font-size:clamp(34px, 4.6vw, 58px); line-height:1.06; letter-spacing:-1.2px; margin:0; }
    h1 em { font-style:normal; color:#d71920; }
    .pitch { font-size:16px; line-height:1.75; color:#4b5058; max-width:520px; margin:24px 0 30px; }
    .btn-plein { display:inline-block; background:#d71920; color:#fff; text-decoration:none;
                 padding:15px 32px; border-radius:12px; font-size:14.5px; font-weight:700;
                 box-shadow:0 16px 32px -14px rgba(215,25,32,.55); }
    .btn-plein:hover { background:#b8141a; }

    /* ---- Bandeau de confiance ---- */
    .confiance { display:flex; gap:clamp(24px, 4vw, 56px); flex-wrap:wrap;
                 padding:0 clamp(24px, 6vw, 72px) clamp(40px, 6vh, 64px); }
    .stat { display:flex; align-items:center; gap:14px; }
    .stat-ic { display:flex; align-items:center; justify-content:center;
               width:40px; height:40px; border-radius:50%; background:#fdeceb; color:#d71920;
               flex-shrink:0; }
    .stat div { display:flex; flex-direction:column; gap:3px; }
    .stat b { font-size:18px; letter-spacing:-.2px; }
    .stat span { font-size:12px; color:#8a8f97; }

    /* ---- La carte démo (signature de la page) ---- */
    .demo { background:#fff; border:1px solid #eceae4; border-radius:22px;
            padding:26px 28px; box-shadow:0 30px 60px -30px rgba(22,24,29,.25);
            max-width:400px; justify-self:end; width:100%; }
    .demo-tete { font-size:11.5px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
                 color:#8a8f97; display:flex; align-items:center; gap:8px; }
    .demo-pastille { width:8px; height:8px; border-radius:50%; background:#d71920;
                     animation:pulse 2.2s infinite; }
    @keyframes pulse { 50% { opacity:.35; } }
    .demo-client { margin:18px 0 6px; }
    .demo-op { font-weight:700; font-size:15px; color:var(--encre); }
    .jauge { width:100%; margin:8px 0 2px; }
    .jauge-fond { fill:none; stroke:#f0eee8; stroke-width:13; stroke-linecap:round; }
    .jauge-plein { fill:none; stroke:#d71920; stroke-width:13; stroke-linecap:round;
                   stroke-dasharray:267; stroke-dashoffset:67;
                   animation:remplir 1.4s .3s cubic-bezier(.3,.9,.3,1) both; }
    @keyframes remplir { from { stroke-dashoffset:267; } }
    .jauge-val { text-anchor:middle; font-size:23px; font-weight:800;
                 font-family:'Bricolage Grotesque', sans-serif; fill:#16181d; }
    .jauge-lib { text-anchor:middle; font-size:8.5px; fill:#8a8f97; }
    .demo-verdict { background:#f0f9f1; color:#1d7a2c; border:1px solid #d8eedb;
                    border-radius:11px; padding:11px 14px; font-size:12.5px;
                    font-weight:700; text-align:center; margin-top:12px; }

    /* ---- Avantages ---- */
    .avantages { padding:clamp(48px, 8vh, 88px) clamp(24px, 6vw, 72px); background:#fff;
                 border-top:1px solid #eceae4; border-bottom:1px solid #eceae4; }
    .avantages-entete { max-width:560px; margin:0 auto 48px; text-align:center; }
    .avantages-entete .sur-titre { margin-left:auto; margin-right:auto; }
    .avantages-entete h2 { font-family:'Bricolage Grotesque', sans-serif; font-weight:800;
                           font-size:clamp(24px, 3vw, 34px); letter-spacing:-.6px; margin:0 0 12px; }
    .avantages-entete p { font-size:15px; line-height:1.7; color:#4b5058; margin:0; }
    .grille-avantages { display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr));
                        gap:24px; max-width:1100px; margin:0 auto; }
    .carte-avantage { padding:26px; border:1px solid #eceae4; border-radius:16px; background:#faf9f6; }
    .av-ic { display:flex; align-items:center; justify-content:center; width:44px; height:44px;
             border-radius:12px; background:#fdeceb; color:#d71920; margin-bottom:18px; }
    .carte-avantage h3 { margin:0 0 8px; font-size:16px; }
    .carte-avantage p { margin:0; font-size:13.5px; line-height:1.7; color:#4b5058; }

    /* ---- Parcours ---- */
    .parcours { background:#16181d; color:#fff;
                padding:clamp(48px, 8vh, 80px) clamp(24px, 6vw, 72px); }
    .parcours h2 { font-family:'Bricolage Grotesque', sans-serif; font-weight:800;
                   font-size:clamp(24px, 3vw, 34px); letter-spacing:-.6px; margin:0 0 40px; }
    .etapes { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));
              gap:clamp(22px, 3vw, 40px); }
    .num { width:34px; height:34px; border-radius:50%; background:#d71920; color:#fff;
           display:flex; align-items:center; justify-content:center;
           font-weight:800; font-size:15px; margin-bottom:16px; }
    .etape h3 { margin:0 0 8px; font-size:17px; }
    .etape p { margin:0; font-size:13.5px; line-height:1.7; color:rgba(255,255,255,.62); }

    /* ---- Bannière CTA ---- */
    .cta { text-align:center; background:#d71920; color:#fff;
           padding:clamp(48px, 8vh, 80px) clamp(24px, 6vw, 72px); }
    .cta h2 { font-family:'Bricolage Grotesque', sans-serif; font-weight:800;
              font-size:clamp(24px, 3vw, 34px); letter-spacing:-.6px; margin:0 0 12px; }
    .cta p { font-size:15px; line-height:1.7; color:rgba(255,255,255,.85);
             max-width:480px; margin:0 auto 30px; }
    .btn-clair { background:#fff; color:#d71920; box-shadow:none; }
    .btn-clair:hover { background:#f0eee8; }

    /* ---- Pied de page ---- */
    .pied { background:#16181d; color:#9aa1ab; }
    .pied-haut { display:flex; justify-content:space-between; gap:40px; flex-wrap:wrap;
                 padding:clamp(40px, 6vh, 64px) clamp(24px, 6vw, 72px) 32px; }
    .pied-marque { display:flex; flex-direction:column; gap:16px; max-width:340px; }
    .pied-logo { height:56px; width:auto; object-fit:contain; filter:brightness(0) invert(1); }
    .pied-marque p { margin:0; font-size:13px; line-height:1.7; }
    .pied-liens { display:flex; flex-direction:column; gap:12px; }
    .pied-titre { font-size:11.5px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
                  color:#6b7078; margin-bottom:4px; }
    .pied-liens a { color:#c8ccd2; text-decoration:none; font-size:13.5px; }
    .pied-liens a:hover { color:#fff; }
    .pied-bas { text-align:center; font-size:12px; padding:20px;
                border-top:1px solid rgba(255,255,255,.08); }

    /* ---- Responsive & accessibilité ---- */
    @media (max-width: 880px) {
      .heros { grid-template-columns:1fr; }
      .demo { justify-self:stretch; max-width:none; }
      .pied-haut { flex-direction:column; gap:28px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .jauge-plein, .demo-pastille { animation:none; }
    }
  `]
})
export class LandingComponent {
  tr = inject(TraductionService);
}
