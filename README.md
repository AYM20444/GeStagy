# GeStagy — Plateforme de Gestion de Stages et de Recrutement

**GeStagy** est une application Full-Stack dédiée à la gestion complète du cycle de vie des stages en entreprise : de la publication des offres et du suivi des candidatures (pipeline Kanban) jusqu'à l'encadrement quotidien des stagiaires, la gestion des tâches et l'évaluation des performances.

---

## Fonctionnalités Principales

- **Portail Public Candidats** : Consultation des offres de stage ouvertes et dépôt de candidature (avec CV et lettre de motivation) sans nécessiter de compte préalable.
- **Authentification & Sécurité** : Authentification stateless par **JWT (JSON Web Token)** et contrôle d'accès basé sur les rôles (**RBAC**).
- **Gestion du Recrutement (RH & Recruteurs)** :
  - Création, modification, publication et archivage des offres de stage (`OPEN`, `DRAFT`, `CLOSED`).
  - Tableau **Kanban de recrutement** pour suivre l'avancement des candidats (`NEW`, `SCREENING`, `INTERVIEW`, `ACCEPTED`, `REJECTED`).
  - Attribution de scores, notes d'évaluation et planification d'entretiens.
  - Tableau de bord analytique et métriques RH.
- **Suivi de Stage & Encadrement (Tuteurs & Stagiaires)** :
  - Suivi des stages en cours (`ONGOING`, `COMPLETED`, `TERMINATED`).
  - Gestion des tâches du stagiaire sous forme de tableau Kanban (`TODO`, `IN_PROGRESS`, `DONE`).
  - Évaluations de mi-parcours (`MID_TERM`) et finales (`FINAL`) portant sur les compétences techniques, les soft skills et l'autonomie.
  - Gestion documentaire (conventions, rapports, attestations) et journal d'activité (`ActivityLog`).

---

## Rôles Utilisateurs

| Rôle | Code | Responsabilités principales |
| :--- | :--- | :--- |
| **Administrateur** | `ADMIN` | Gestion globale du système, des départements, des offres et des utilisateurs |
| **Ressources Humaines** | `HR` | Gestion des offres, suivi global du recrutement, validation des stages et statistiques |
| **Recruteur** | `RECRUITER` | Création d'offres, qualification des candidatures, gestion du pipeline Kanban |
| **Tuteur / Encadrant** | `TUTOR` | Attribution et suivi des tâches des stagiaires, évaluations de mi-parcours et de fin de stage |
| **Stagiaire** | `INTERN` | Suivi de ses objectifs, mise à jour de l'avancement des tâches et consultation des évaluations |

---

## Stack Technique

### Backend (`/backend`)
- **Langage** : Java 21
- **Framework** : Spring Boot 3.3.4 (`Spring Web`, `Spring Data JPA`, `Spring Security`, `Spring Validation`)
- **Base de données** : PostgreSQL (avec support H2 en développement)
- **Sécurité** : JJWT (`0.12.6`) pour l'authentification JWT
- **Documentation API** : SpringDoc OpenAPI 3 / Swagger UI (`2.6.0`)
- **Outils** : Maven, Lombok

### Frontend (`/frontend`)
- **Framework** : Angular 22 (`@angular/core`, `@angular/router`, `@angular/forms`)
- **Langage** : TypeScript 6.0
- **Tests** : Vitest & JSDom

---

## Structure du Projet

```text
GeStagy/
├── backend/                        # API REST Spring Boot
│   ├── src/main/java/com/gestagy/
│   │   ├── config/                 # Initialisation des données de démo (DataSeeder)
│   │   ├── controller/             # Endpoints REST (Auth, Public, Recruitment, Internship)
│   │   ├── dto/                    # Objets de transfert de données (DTOs)
│   │   ├── model/                  # Entités JPA (User, InternshipOffer, Candidate, Internship, Task, Evaluation...)
│   │   ├── repository/             # Interfaces Spring Data JPA
│   │   ├── security/               # Configuration Spring Security & Filtres JWT
│   │   └── service/                # Logique métier
│   ├── src/main/resources/
│   │   └── application.properties  # Configuration serveur, BDD et JWT
│   └── pom.xml
├── frontend/                       # Application cliente Angular
│   ├── src/app/                    # Composants, routes et configuration Angular
│   ├── angular.json
│   └── package.json
├── Diagram sequence/               # Diagrammes de séquence UML (PDF)
│   ├── VueGlobaleDePlatforme.pdf
│   ├── sequence_Authentification.pdf
│   ├── candidatureOffre.pdf
│   ├── pipeLigneDeRecrutement.pdf
│   └── EvaluationDeStagiare.pdf
├── Diagram Classe.pdf              # Diagramme de classes UML
└── diagram UseCase.pdf             # Diagramme de cas d'utilisation UML
```

---

## Installation et Démarrage

### Prérequis
- **JDK 21** ou supérieur
- **Maven 3.9+**
- **Node.js 20+** et **npm 12+**
- **PostgreSQL 15+**

### 1. Configuration de la Base de Données
Créez une base de données PostgreSQL nommée `gestagy_db` :

```sql
CREATE DATABASE gestagy_db;
```

Par défaut, le backend utilise les variables d'environnement suivantes (ou leurs valeurs par défaut définies dans `backend/src/main/resources/application.properties`) :
- `DB_URL` : `jdbc:postgresql://localhost:5432/gestagy_db`
- `DB_USERNAME` : `postgres`
- `DB_PASSWORD` : `postgres`

### 2. Lancer le Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

- L'API sera disponible sur : `http://localhost:8080`
- Documentation interactive **Swagger UI** : `http://localhost:8080/swagger-ui.html`
- Spécification **OpenAPI JSON** : `http://localhost:8080/v3/api-docs`

### 3. Lancer le Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

- L'application web sera accessible sur : `http://localhost:4200`

---

## Comptes de Démonstration (DataSeeder)

Au premier démarrage du backend sur une base vide, le composant `DataSeeder` génère automatiquement des départements, des offres de stage, des candidats, des stages en cours et les comptes utilisateurs suivants :

> **Mot de passe commun à tous les comptes de test :** `password123`

| Rôle | Email | Nom Complet |
| :--- | :--- | :--- |
| **ADMIN** | `admin@gestagy.com` | Admin 2026 |
| **HR** | `rh@gestagy.com` | Sarah Benali |
| **RECRUITER** | `recruteur@gestagy.com` | Youssef Amrani |
| **TUTOR** | `tuteur@gestagy.com` | Alexandre Martin |
| **INTERN** | `stagiaire@gestagy.com` | Mehdi Mansouri |
| **INTERN** | `lina@gestagy.com` | Lina Tazi |

---

## Aperçu des Endpoints API

### Authentification (`/api/auth`)
- `POST /api/auth/register` — Inscription d'un nouvel utilisateur
- `POST /api/auth/login` — Connexion et récupération du token JWT
- `GET /api/auth/me` — Récupération du profil de l'utilisateur connecté

### Portail Public (`/api/public`)
- `GET /api/public/offers` — Lister les offres de stage ouvertes
- `GET /api/public/offers/{id}` — Détail d'une offre de stage
- `POST /api/public/offers/{id}/apply` — Soumettre une candidature à une offre

### Recrutement & RH (`/api/recruitment`)
- `GET /api/recruitment/offers` — Lister toutes les offres (`ADMIN`, `HR`, `RECRUITER`)
- `POST /api/recruitment/offers` — Créer une offre de stage
- `PUT /api/recruitment/offers/{id}` — Modifier une offre existante
- `DELETE /api/recruitment/offers/{id}` — Supprimer une offre (`ADMIN`, `HR`)
- `GET /api/recruitment/candidates` — Lister tous les candidats pour le Kanban
- `GET /api/recruitment/offers/{offerId}/candidates` — Lister les candidats d'une offre
- `PATCH /api/recruitment/candidates/{id}/status` — Mettre à jour le statut Kanban d'un candidat
- `PATCH /api/recruitment/candidates/{id}/score` — Mettre à jour le score et les notes d'un candidat
- `GET /api/recruitment/dashboard/stats` — Statistiques du tableau de bord RH

### Stages & Suivi (`/api/internships`)
- `GET /api/internships` — Lister tous les stages (`ADMIN`, `HR`, `RECRUITER`)
- `GET /api/internships/{id}` — Détails d'un stage (`ADMIN`, `HR`, `TUTOR`, `INTERN`)
- `GET /api/internships/{id}/tasks` — Lister les tâches d'un stage
- `POST /api/internships/{id}/tasks` — Assigner une nouvelle tâche (`ADMIN`, `HR`, `TUTOR`)
- `PATCH /api/internships/tasks/{taskId}/status` — Changer le statut d'une tâche (`TODO`, `IN_PROGRESS`, `DONE`)

