import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  AuthResponse,
  MessageResponse,
  PremierMotDePasseRequest,
  ChangementMotDePasseRequest
} from '../models/models';
import { environment } from '../environment/environment';

const CLE_TOKEN = 'token';
const CLE_AGENT = 'agent';
const CLE_CANAL = 'canal';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly api = `${environment.apiUrl}/auth`;

  /** Session courante, exposée en signal pour l'UI. */
  private readonly _session = signal<AuthResponse | null>(this.lireSession());

  readonly session = this._session.asReadonly();
  readonly estConnecte = computed(() => this._session() !== null);
  readonly doitChangerMotDePasse = computed(() => this._session()?.firstLogin === true);
  readonly role = computed(() => {
    const role = this._session()?.role ?? null;
    return typeof role === 'string' ? role.trim().toUpperCase() : null;
  });
  /** Seul l'admin du partenaire fondateur (Afriland) onboarde les autres partenaires. */
  readonly estAdminAfriland = computed(() => {
    const partenaireNom = this._session()?.partenaireNom;
    return this.role() === 'ADMIN'
      && typeof partenaireNom === 'string'
      && partenaireNom.trim().toLowerCase() === 'afriland first bank';
  });

  get token(): string | null {
    return localStorage.getItem(CLE_TOKEN);
  }

  get agent(): AuthResponse | null {
    return this._session();
  }

  // ---- Connexion ----

  login(email: string, motDePasse: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api}/login`, { email, motDePasse })
      .pipe(tap(res => this.stocker(res)));
  }

  deconnexion(): void {
    localStorage.removeItem(CLE_TOKEN);
    localStorage.removeItem(CLE_AGENT);
    localStorage.removeItem(CLE_CANAL);
    this._session.set(null);
    this.router.navigate(['/connexion']);
  }

  // ---- Invitation ----

  /** Valide le lien reçu par email (endpoint public, pas de token JWT requis). */
  validerInvitation(token: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${environment.apiUrl}/invitation/validation`,
      {},
      { params: { token } }
    );
  }

  // ---- Mots de passe ----

  /** Première connexion : pas d'ancien mot de passe demandé. */
  definirPremierMotDePasse(data: PremierMotDePasseRequest): Observable<MessageResponse> {
    return this.http
      .post<MessageResponse>(`${this.api}/premier-mot-de-passe`, data)
      .pipe(tap(() => this.marquerMotDePasseDefini()));
  }

  /** Changement volontaire depuis « Mon Profil ». */
  changerMotDePasse(data: ChangementMotDePasseRequest): Observable<MessageResponse> {
    return this.http
      .post<MessageResponse>(`${this.api}/changer-mot-de-passe`, data)
      .pipe(tap(() => this.marquerMotDePasseDefini()));
  }

  // ---- Navigation post-login ----

  /** Route d'accueil selon le rôle et l'état du compte. */
  routeAccueil(): string {
    const session = this._session();
    if (!session) return '/connexion';
    if (session.firstLogin) return '/change-password';

    return this.role() === 'ADMIN'
      ? '/admin/dashboard'
      : '/app/verification';
  }

  // ---- Canal (existant) ----

  choisirCanal(canal: string): void {
    localStorage.setItem(CLE_CANAL, canal);
  }

  canal(): string {
    return localStorage.getItem(CLE_CANAL) ?? '';
  }

  // ---- Interne ----

  private stocker(res: AuthResponse): void {
    localStorage.setItem(CLE_TOKEN, res.token);
    localStorage.setItem(CLE_AGENT, JSON.stringify(res));
    this._session.set(res);
  }

  private marquerMotDePasseDefini(): void {
    const session = this._session();
    if (!session) return;
    const maj: AuthResponse = { ...session, firstLogin: false };
    localStorage.setItem(CLE_AGENT, JSON.stringify(maj));
    this._session.set(maj);
  }

  private lireSession(): AuthResponse | null {
    const brut = localStorage.getItem(CLE_AGENT);
    if (!brut) return null;
    try {
      return JSON.parse(brut) as AuthResponse;
    } catch {
      localStorage.removeItem(CLE_AGENT);
      localStorage.removeItem(CLE_TOKEN);
      return null;
    }
  }
}