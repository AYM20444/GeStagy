# GeStagy — Plateforme de Gestion de Stages et de Recrutement

**GeStagy** (InternHub) est une application Full-Stack d'entreprise dédiée à la gestion complète du cycle de vie des stages : de la publication des offres et du suivi des candidatures (pipeline Kanban drag & drop) jusqu'à l'encadrement quotidien des stagiaires, la gestion interactive des tâches, les conventions et l'évaluation des performances.

---

## Fonctionnalités Principales & Espaces Utilisateurs

### 1. 🌟 Portail Public & Espace Stagiaire
- **Vitrine des Offres de Stage** : Consultation attractive des offres avec filtres par département, durée et compétences requises.
- **Formulaire de Candidature Rapide** : Dépôt direct sans inscription obligatoire (nom, email, téléphone, école, lien CV).
- **Espace Personnel Stagiaire** (`/espace-stagiaire`) :
  - Suivi du sujet de stage, des dates et de l'encadrant assigné.
  - **Tableau de Bord Tâches (Kanban Stagiaire)** : passage interactif des objectifs (`À Réaliser`, `En Cours`, `Validé & Terminé`).
  - Téléchargement des conventions signées et attestations de stage générées.

### 2. 💼 Espace Recruteurs & RH
- **Dashboard Analytique RH** (`/dashboard`) :
  - **KPIs en temps réel** : Offres ouvertes, Nouveaux candidats, Stagiaires actifs, Moyenne des évaluations (/20).
  - Graphiques de répartition du pipeline de recrutement et flux d'activité récent (`ActivityLog`).
- **Pipeline de Recrutement Interactif** (`/kanban`) :
  - Tableau Kanban complet avec **Drag & Drop fluide** (`@angular/cdk/drag-drop`).
  - 4 colonnes de qualification : `Nouveau (NEW)` ➔ `Présélection (SCREENING)` ➔ `Entretien (INTERVIEW)` ➔ `Accepté (ACCEPTED)`.
  - Mise à jour immédiate du statut en base de données avec recalcul du score et historique des notes.
- **Gestion Complète des Offres de Stage** : Création, édition, publication et archivage (`OPEN`, `DRAFT`, `CLOSED`).

### 3. 👨‍🏫 Espace Encadrants & Tuteurs
- **Supervision des Stagiaires assignés** : Suivi des livrables et assignation de nouvelles tâches avec date d'échéance.
- **Grille d'Évaluation Multicritères** : Notation de mi-parcours (`MID_TERM`) et finale (`FINAL`) sur les compétences techniques, les soft skills et l'autonomie.

---

## Modèle de Rôles & Sécurité (RBAC)

Les rôles sont isolés dans une table dédiée `user_roles` et contrôlés par des annotations de sécurité Spring `@PreAuthorize` et des Guards Angular :

| Rôle | Code | Droits & Responsabilités |
| :--- | :--- | :--- |
| **Administrateur** | `ADMIN` | Accès global, gestion des départements, utilisateurs et logs d'activité |
| **Ressources Humaines** | `HR` | Gestion des offres, candidatures, validation des stages et métriques globales |
| **Recruteur** | `RECRUITER` | Publication d'offres, gestion du pipeline Kanban, notation et planification d'entretiens |
| **Tuteur / Encadrant** | `TUTOR` | Attribution et validation des tâches de ses stagiaires, remplissage des évaluations |
| **Stagiaire** | `INTERN` | Consultation de son stage, avancement de ses tâches, accès aux conventions et attestations |

---

## Architecture & Stack Technique

### Backend (`/backend`)
- **Langage** : Java 21 LTS (Eclipse Adoptium)
- **Framework** : Spring Boot 3.3.4
  - `spring-boot-starter-web` (REST APIs)
  - `spring-boot-starter-data-jpa` (Hibernate ORM 6.5)
  - `spring-boot-starter-security` (Spring Security 6)
  - `spring-boot-starter-validation` (Validation des DTOs)
- **Sécurité** : JJWT `0.12.6` (Authentification stateless Bearer token)
- **Base de données** : PostgreSQL 17 (port `5433`, base `gestagy_db`)
- **Documentation API** : SpringDoc OpenAPI 3 / Swagger UI (`2.6.0`)
- **Build Tool** : Apache Maven 3.9+

### Frontend (`/frontend`)
- **Framework** : Angular 22 (Mode **Zoneless** haute performance via `provideZonelessChangeDetection`)
- **Architecture** : Standalone Components, Signal-based reactivity, Angular Router
- **UI & Design** : Tailwind CSS, typographie *Plus Jakarta Sans*, cartes douces `rounded-3xl`
- **Interactivité** : `@angular/cdk/drag-drop` (Kanban), formulaires réactifs
- **Client HTTP** : `provideHttpClient` avec intercepteur d'authentification Bearer JWT

---

## Structure du Répertoire

```text
GyStagy/
├── backend/                        # API REST Spring Boot 3
│   ├── src/main/java/com/gestagy/
│   │   ├── config/                 # DataSeeder (Comptes et données de démo)
│   │   ├── controller/             # Contrôleurs REST (Auth, Public, Recruitment, Internship)
│   │   ├── dto/                    # Objets de transfert de données typés
│   │   ├── model/                  # Entités JPA (User, Role, Offer, Candidate, Task, Evaluation...)
│   │   ├── repository/             # Interfaces Spring Data JPA
│   │   ├── security/               # Filtre OncePerRequestFilter, WebSecurityConfig, JwtUtils
│   │   └── service/                # Logique métier et transactions
│   ├── src/main/resources/
│   │   └── application.properties  # Ports (8081), URL PostgreSQL (5433), Clé JWT
│   └── pom.xml
├── frontend/                       # Client Web Angular 22
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── navbar/             # Barre de navigation responsive avec profil connecté
│   │   │   ├── offers/             # Vitrine des offres publiques + modal de candidature
│   │   │   ├── dashboard/          # Métriques KPIs et statistiques de recrutement
│   │   │   ├── kanban/             # Pipeline Drag & Drop de qualification des candidats
│   │   │   ├── intern-space/       # Feuille de route et tâches interactives du stagiaire
│   │   │   └── login/              # Interface de connexion rapide par profil
│   │   ├── models/                 # Interfaces TypeScript
│   │   ├── services/               # Services API REST et AuthService
│   │   ├── app.config.ts           # Configuration Zoneless & HTTP
│   │   └── app.routes.ts           # Routage de l'application
│   ├── angular.json
│   └── package.json
├── Diagram sequence/               # Diagrammes de séquence UML officiels
└── Diagram Classe.pdf              # Diagramme de classes UML
```

---

## Guide d'Installation et Exécution

### 1. Prérequis
- **Java JDK 21**
- **Apache Maven 3.9+**
- **Node.js 20+** / **npm 12+**
- **PostgreSQL 15+**

---

### 2. Configuration PostgreSQL
Créez la base de données dans votre invite `psql` :
```sql
CREATE DATABASE gestagy_db;
```

> **Paramètres configurés par défaut dans `application.properties` :**
> - Port PostgreSQL : `5433` (ou `5432`)
> - Utilisateur : `postgres`
> - Mot de passe : `postgresql`
> - Port du serveur Backend : `8081`

---

### 3. Lancer le Backend Spring Boot

Ouvrez un terminal PowerShell :
```powershell
# 1. Se positionner dans le backend
cd backend

# 2. Configurer Java 21 (si Java 11 est actif par défaut sur la machine)
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path

# 3. Lancer le JAR exécutable repackagé
java -jar target/gestagy-backend-1.0.0-SNAPSHOT.jar
```
*(Alternative avec Maven : `mvn spring-boot:run`)*

- **API REST :** `http://localhost:8081`
- **Swagger UI interactif :** 👉 `http://localhost:8081/swagger-ui.html`

---

### 4. Lancer le Frontend Angular

Dans un second terminal :
```powershell
cd frontend
ng serve --open
```

- **Application Web GeStagy :** 👉 `http://localhost:4200`

---

## Comptes de Test Pré-chargés (`DataSeeder`)

Au démarrage, le système insère automatiquement des départements, 5 offres de stage, 10 candidats qualifiés et les comptes suivants :

> **Mot de passe commun :** `password123`

| Rôle | Email | Ce que vous pouvez tester |
| :--- | :--- | :--- |
| **RH** | `rh@gestagy.com` | Dashboard complet, KPIs, gestion des offres & candidats |
| **Recruteur** | `recruteur@gestagy.com` | Pipeline Kanban Drag & Drop, qualification, notation |
| **Encadrant** | `tuteur@gestagy.com` | Suivi de stage, assignation de tâches, évaluations |
| **Stagiaire** | `stagiaire@gestagy.com` | Espace personnel stagiaire, validation de ses tâches |
| **Admin** | `admin@gestagy.com` | Supervision globale de la plateforme |

---

## Endpoints REST Clés

| Domaine | Méthode & Route | Accès RBAC | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST /api/auth/login` | Public | Authentification et émission du Bearer JWT |
| **Auth** | `POST /api/auth/register` | Public | Inscription d'un utilisateur |
| **Auth** | `GET /api/auth/me` | Authentifié | Profil et rôles de l'utilisateur connecté |
| **Public** | `GET /api/public/offers` | Public | Liste des offres ouvertes |
| **Public** | `POST /api/public/offers/{id}/apply` | Public | Dépôt d'une candidature avec CV |
| **Recrutement** | `GET /api/recruitment/dashboard/stats` | `HR`, `ADMIN`, `RECRUITER` | Statistiques et métriques RH en direct |
| **Recrutement** | `GET /api/recruitment/candidates` | `HR`, `ADMIN`, `RECRUITER` | Candidats classés pour le Kanban |
| **Recrutement** | `PATCH /api/recruitment/candidates/{id}/status` | `HR`, `ADMIN`, `RECRUITER` | Changement de statut (Drag & Drop) |
| **Stages** | `GET /api/internships` | `HR`, `ADMIN`, `RECRUITER` | Liste des stages en cours |
| **Tâches** | `GET /api/internships/{id}/tasks` | `TUTOR`, `INTERN`, `HR` | Liste des tâches de stage |
| **Tâches** | `PATCH /api/internships/tasks/{id}/status` | `TUTOR`, `INTERN` | Mise à jour du statut d'une tâche |
