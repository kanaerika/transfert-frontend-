import { Routes } from '@angular/router';
import { authGuard, firstLoginGuard, roleGuard, afrilandGuard } from './core/auth.guard';

export const routes: Routes = [

  // ---- Public ----
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'connexion',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'mot-de-passe-oublie',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'invitation',
    loadComponent: () =>
      import('./pages/invitation/invitation.component')
        .then(m => m.InvitationComponent)
  },

  // ---- Changement obligatoire (authentifié, hors layout) ----
  {
    path: 'change-password',
    canActivate: [firstLoginGuard],
    loadComponent: () =>
      import('./pages/change-password/change-password.component')
        .then(m => m.ChangePasswordComponent)
  },

  // ---- Espace administration ----
  {
    path: 'admin',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () =>
      import('./pages/admin/admin-layout/admin-layout.component')
        .then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'transactions',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'verification' },
          {
            path: 'verification',
            loadComponent: () =>
              import('./pages/verification/verification.component')
                .then(m => m.VerificationComponent)
          },
          {
            path: 'historique',
            loadComponent: () =>
              import('./pages/liste/liste.component').then(m => m.ListeComponent),
            data: { mode: 'historique' }
          },
          {
            path: 'annulation',
            loadComponent: () =>
              import('./pages/liste/liste.component').then(m => m.ListeComponent),
            data: { mode: 'annulation' }
          },
          {
            path: 'non-cloture',
            loadComponent: () =>
              import('./pages/liste/liste.component').then(m => m.ListeComponent),
            data: { mode: 'non-cloture' }
          },
          {
            path: 'justificatifs',
            loadComponent: () =>
              import('./pages/liste/liste.component').then(m => m.ListeComponent),
            data: { mode: 'justificatifs' }
          },
          {
           path: 'bilan',
           loadComponent: () =>
            import('./pages/bilan/bilan.component').then(m => m.BilanComponent)
          },
          {
             path: 'details/:id',
              loadComponent: () =>
                 import('./pages/details/details.component').then(m => m.DetailsComponent)
          },

        ]
      },
      {
        path: 'partenaires',
        canActivate: [afrilandGuard],
        loadComponent: () =>
          import('./pages/admin/partenaire/partenaires.component')
            .then(m => m.PartenairesComponent)
      },
      {
        path: 'partenaires/:id',
        canActivate: [afrilandGuard],
        loadComponent: () =>
          import('./pages/admin/partenaire/details/details.component')
            .then(m => m.DetailsComponent)
      },
      {
        path: 'agents',
        loadComponent: () =>
          import('./pages/admin/agents/agents.component')
            .then(m => m.AgentsComponent)
      },
      {
        path: 'statistiques',
        loadComponent: () =>
          import('./pages/admin/statistiques/statistiques.component')
            .then(m => m.StatistiquesComponent)
      },
      {
        path: 'profil',
        loadComponent: () =>
          import('./pages/profil/profil.component')
            .then(m => m.ProfilComponent)
      },
      {
        path: 'parametres',
        loadComponent: () =>
          import('./pages/admin/parametres/parametres.component')
            .then(m => m.ParametresComponent)
      }
    ]
  },

  // ---- Espace opérationnel (agents) ----
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'verification' },
      {
        path: 'verification',
        loadComponent: () =>
          import('./pages/verification/verification.component')
            .then(m => m.VerificationComponent)
      },
      {
        path: 'historique',
        loadComponent: () =>
          import('./pages/liste/liste.component').then(m => m.ListeComponent),
        data: { mode: 'historique' }
      },
      {
        path: 'annulation',
        loadComponent: () =>
          import('./pages/liste/liste.component').then(m => m.ListeComponent),
        data: { mode: 'annulation' }
      },
      {
        path: 'non-cloture',
        loadComponent: () =>
          import('./pages/liste/liste.component').then(m => m.ListeComponent),
        data: { mode: 'non-cloture' }
      },
      {
        path: 'justificatifs',
        loadComponent: () =>
          import('./pages/liste/liste.component').then(m => m.ListeComponent),
        data: { mode: 'justificatifs' }
      },
      {
        path: 'bilan',
        loadComponent: () =>
          import('./pages/bilan/bilan.component').then(m => m.BilanComponent)
      },
      {
        path: 'profil',
        loadComponent: () =>
          import('./pages/profil/profil.component').then(m => m.ProfilComponent)
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('./pages/details/details.component').then(m => m.DetailsComponent)
      },
    ]
  },

  // ---- Wildcard : TOUJOURS en dernier ----
  { path: '**', redirectTo: '' }
];