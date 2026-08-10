# Suivi des transferts internationaux — Frontend

Application Angular (standalone components) utilisée par les agents Afriland First Bank pour
vérifier, exécuter, annuler et suivre les transferts rapides Hors CEMAC en respectant le plafond
mensuel réglementaire.

Ce dépôt contient uniquement le **frontend**. Il s'appuie sur une API REST Spring Boot fournie par
le projet voisin `../backend`.

## Prérequis

- Node.js 20+ et npm
- Le backend (`../backend`) démarré sur `http://localhost:8080` — voir son propre setup (Java 17,
  Maven, PostgreSQL). Sans lui, les pages d'authentification et de transferts ne fonctionnent pas.

## Démarrage

```bash
npm install
npm start
```

Ouvrir `http://localhost:4200`. `npm start` lance `ng serve --proxy-config proxy.conf.json`.

> Note : `environment.ts` pointe actuellement en dur vers `http://localhost:8080/api`
> (`apiUrl`), donc le proxy n'est pas utilisé pour les appels `TransfertService`/`AuthService`.
> Seul `HealthService` (`/api/health`) passe par le proxy relatif. Le backend doit donc autoriser
> le CORS depuis l'origine du frontend (déjà configuré côté backend).

## Scripts

| Commande        | Effet                                              |
| --------------- | --------------------------------------------------- |
| `npm start`      | Serveur de dev Angular avec proxy `/api`             |
| `npm run build`  | Build de production dans `dist/`                     |
| `npm run watch`  | Build en mode développement avec rebuild automatique |
| `npm test`       | Tests unitaires (Vitest)                              |

## Structure

```
src/app/
  app.ts, app.config.ts, app.routes.ts   racine + configuration + routes
  core/           guard et intercepteur d'authentification (JWT)
  environment/    configuration d'environnement (apiUrl)
  models/         interfaces TypeScript partagées (DTOs)
  services/       AuthService, TransfertService, HealthService
  pages/
    home/         page d'accueil publique (landing)
    login/        connexion agent
    register/     création de compte agent
    channel/      choix du canal de distribution (MoneyGram / Small World)
    layout/       coquille de l'application (sidebar + en-tête) après connexion
    verification/ vérification du plafond avant exécution d'un transfert
    liste/        listes réutilisables : historique, annulation, justificatifs
    bilan/        bilan journalier de l'agence
    details/      détail d'un transfert
```

## Authentification

- Connexion par **numéro de téléphone + mot de passe** (`AuthService.login`).
- Le token JWT retourné par le backend est stocké dans `localStorage` (`token`, `agent`, `canal`)
  et rattaché automatiquement aux requêtes sortantes par `core/auth.interceptor.ts`.
- Les routes sous `/app/**` et `/canal` sont protégées par `core/auth.guard.ts`, qui redirige vers
  `/connexion` si aucun token n'est présent.

## État des lieux côté API

| Fonctionnalité                          | Statut backend |
| ---------------------------------------- | -------------- |
| `POST c`, `/login`      | Implémenté      |
| `GET /api/health`                        | Implémenté      |
| `GET /api/referentiel`                   | Non implémenté — le frontend retombe sur des valeurs par défaut codées en dur |
| `POST /api/transferts/verification`      | Non implémenté |
| `POST /api/transferts`, historique, annulation, bilan | Non implémenté |

Tant que ces derniers endpoints ne sont pas ajoutés côté backend, les pages Vérification,
Historique, Annulation, Justificatifs et Bilan afficheront leur message d'erreur de chargement.

## Ressources Angular CLI

Généré avec [Angular CLI](https://github.com/angular/angular-cli) 21.1.4. Voir la
[référence Angular CLI](https://angular.dev/tools/cli) pour les commandes de scaffolding.
