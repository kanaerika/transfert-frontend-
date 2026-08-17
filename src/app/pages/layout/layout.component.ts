import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TraductionService } from '../../core/traduction/traduction.service';
import { ThemeService } from '../../core/theme/theme.service';
 
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <div class="fond">
    <div class="cin coque">
 
      <!-- ===== Sidebar ===== -->
      <nav class="sidebar">
        <div class="marque">
          <div class="logo"><img src="assets/images/AFB.png" alt="Afriland First Bank"></div>
          <div class="disp nom">TransFlow</div>
        </div>
 
        <div class="section">{{ tr.t('menu.titre') }}</div>
        <div class="menu">
          <a class="navi item" routerLink="/app/verification" routerLinkActive="actif">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            {{ tr.t('menu.verification') }}
          </a>
          <a class="navi item" routerLink="/app/historique" routerLinkActive="actif">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>
            {{ tr.t('menu.historique') }}
          </a>
          <a class="navi item" routerLink="/app/bilan" routerLinkActive="actif">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            {{ tr.t('menu.bilan') }}
          </a>
          <a class="navi item" routerLink="/app/annulation" routerLinkActive="actif">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
            {{ tr.t('menu.annulation') }}
          </a>
          <a class="navi item" routerLink="/app/non-cloture" routerLinkActive="actif">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ tr.t('menu.nonClotures') }}
          </a>
          @if (auth.role() === 'ADMIN') {
            <a class="navi item" routerLink="/admin/dashboard">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              {{ tr.t('menu.espaceAdministration') }}
            </a>
          }
        </div>
 
        <!-- Carte agent en bas -->
        <div class="reglages">
        <button class="regl" (click)="tr.basculer()" title="Français / English">
          {{ tr.langue() === 'fr' ? 'EN' : 'FR' }}
        </button>
      </div>
 
      <div class="agent">
          <div class="ligne">
            <div class="avatar">{{ codeAgent }}</div>
            <div class="infos">
              <div class="anom">{{ nomAgent }}</div>
              <div class="acanal">{{ canalLabel }}</div>
            </div>
          </div>
          <button class="navi deco" (click)="deconnexion()">{{ tr.t('menu.deconnexion') }}</button>
        </div>
      </nav>
 
      <!-- ===== Zone principale ===== -->
      <div class="principal">
        <header>
          <div class="entete-gauche">
            <div class="marque-app">
              <div class="logo-app"><img src="assets/images/AFB.png" alt="Afriland First Bank"></div>
              <span class="nom-app">TransFlow</span>
            </div>
            <div class="separateur"></div>
            <div class="titres">
              <div class="disp titre">{{ titre }}</div>
              <div class="soustitre">{{ sousTitre }}</div>
            </div>
          </div>
          <div class="droite">
            <button class="bascule-theme" (click)="theme.basculer()" [title]="theme.theme() === 'sombre' ? 'Mode clair' : 'Mode sombre'">
              @if (theme.theme() === 'sombre') {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              } @else {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            <div class="datejour">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d71920" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
              {{ aujourdHui }}
            </div>
          </div>
        </header>
 
        <div class="contenu">
          <router-outlet />
        </div>
      </div>
 
    </div>
  </div>
  `,
  styles: [`
    :host { display:block; height:100vh; }
    .fond { height:100vh; background:var(--fond); }
    .coque { display:flex; height:100vh; width:100%; }

    /* Sidebar */
    .sidebar { width:300px; flex:none; position:fixed; top:0; left:0; bottom:0; background:linear-gradient(180deg,#15171d,#0b0c10); display:flex; flex-direction:column; padding:22px 16px; }
    .marque { display:flex; align-items:center; gap:11px; padding:2px 6px 4px; }
    .logo { width:76px; height:76px; border-radius:17px; background:#fff; padding:8px; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 18px -6px rgba(215,25,32,.7); }
    .logo img { width:100%; height:100%; object-fit:contain; border-radius:7px; }
    .nom { color:#fff; font-weight:700; font-size:19px; letter-spacing:.2px; }
    .section { margin-top:26px; font-size:10px; font-weight:700; letter-spacing:1.4px; color:rgba(255,255,255,.32); padding:0 8px 10px; }
    .menu { display:flex; flex-direction:column; gap:4px; }
    .item { display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:11px; font-size:13.5px; font-weight:600; color:rgba(255,255,255,.62); background:transparent; cursor:pointer; }
    .item:hover { color:#fff; background:rgba(255,255,255,.07); }
    .item.actif { color:#fff; background:linear-gradient(135deg,var(--rouge),var(--rouge-fonce)); font-weight:800; box-shadow:0 10px 22px -10px rgba(215,25,32,.9); }
 
    /* Agent card */
    .reglages { display:flex; gap:8px; margin-top:auto; padding:0 4px 10px; }
    .regl { flex:1; border:1px solid rgba(255,255,255,.14); background:rgba(255,255,255,.05); color:rgba(255,255,255,.75); border-radius:10px; padding:8px 0; font-size:12px; font-weight:700; cursor:pointer; }
    .regl:hover { background:rgba(255,255,255,.12); }
    .agent { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); border-radius:14px; padding:12px; }
    .ligne { display:flex; align-items:center; gap:10px; }
    .avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,var(--rouge),var(--rouge-fonce)); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:12px; }
    .infos { line-height:1.25; }
    .anom { color:#fff; font-size:12.5px; font-weight:700; }
    .acanal { font-size:10.5px; color:rgba(255,255,255,.45); }
    .deco { width:100%; margin-top:10px; border:none; background:rgba(215,25,32,.16); color:#ff7a80; font-weight:700; font-size:12px; padding:9px; border-radius:9px; cursor:pointer; }
    .deco:hover { background:rgba(215,25,32,.28); }
 
    /* Main */
    .principal { flex:1; margin-left:300px; height:100vh; display:flex; flex-direction:column; min-width:0; }
    header { display:flex; align-items:center; justify-content:space-between; padding:22px 30px 14px; background:var(--surface); border-bottom:1px solid var(--bordure); position:relative; }
    header::after { content:''; position:absolute; left:0; right:0; bottom:-1px; height:2px; background:linear-gradient(90deg,var(--rouge),var(--rouge-fonce) 40%,transparent); }
    .entete-gauche { display:flex; align-items:center; gap:18px; }
    .marque-app { display:flex; align-items:center; gap:9px; }
    .logo-app { width:62px; height:62px; border-radius:14px; background:#fff; border:1px solid var(--bordure); display:flex; align-items:center; justify-content:center; box-shadow:0 6px 14px -6px rgba(215,25,32,.25); overflow:hidden; padding:4px; }
    .logo-app img { width:100%; height:100%; object-fit:contain; }
    .nom-app { font-size:23px; font-weight:800; color:var(--encre); letter-spacing:.1px; }
    .separateur { width:1px; height:38px; background:var(--bordure); }
    .titre { font-size:21px; font-weight:700; color:var(--encre); }
    .soustitre { font-size:12.5px; color:var(--gris); font-weight:500; margin-top:2px; }
    .droite { display:flex; align-items:center; gap:10px; }
    .bascule-theme { flex:none; display:flex; align-items:center; justify-content:center; width:38px; height:38px; border:1px solid var(--bordure); border-radius:11px; background:var(--surface); color:var(--gris); cursor:pointer; }
    .bascule-theme:hover { background:var(--gris-clair); color:var(--rouge); }
    .datejour { display:flex; align-items:center; gap:8px; padding:9px 13px; border:1px solid var(--bordure); border-radius:11px; font-size:12.5px; font-weight:600; color:var(--encre); background:var(--surface); }
    .contenu { flex:1; overflow-y:auto; padding:22px 30px 28px; }
  `]
})
export class LayoutComponent {
  readonly auth = inject(AuthService);
  readonly tr = inject(TraductionService);
  readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
 
  get nomAgent(): string { return this.auth.agent?.nomComplet ?? this.tr.t('layout.agentParDefaut'); }
  get codeAgent(): string { return this.auth.agent?.codeAgent ?? '—'; }
  get canalLabel(): string {
  const partenaire = this.auth.agent?.partenaireNom;

  if (partenaire && partenaire.trim() !== '') {
    return partenaire;
  }

  return 'Afriland First Bank';
}

  /** Titres selon la route active (comme dans la maquette) */
  private titres: Record<string, [string, string]> = {
    '/app/verification':   ['layout.titreVerification', 'layout.sousTitreVerification'],
    '/app/historique':     ['layout.titreHistorique', 'layout.sousTitreHistorique'],
    '/app/bilan':          ['layout.titreBilan', 'layout.sousTitreBilan'],
    '/app/annulation':     ['layout.titreAnnulation', 'layout.sousTitreAnnulation'],
    '/app/non-cloture':    ['layout.titreNonClotures', 'layout.sousTitreNonClotures'],
    '/app/details':        ['layout.titreDetails', 'layout.sousTitreDetails']
  };

  get titre(): string {
    const cle = this.cle()?.[0];
    return cle ? this.tr.t(cle) : this.tr.t('layout.titreDefaut');
  }
  get sousTitre(): string {
    const cle = this.cle()?.[1];
    return cle ? this.tr.t(cle) : '';
  }
  private cle(): [string, string] | undefined {
    const url = this.router.url;
    const entree = Object.entries(this.titres).find(([k]) => url.startsWith(k));
    return entree?.[1];
  }
 
  get aujourdHui(): string {
    return new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
 
  deconnexion(): void {
    this.auth.deconnexion();
    this.router.navigate(['/']);
  }
}
