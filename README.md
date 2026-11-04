# GeStagy — Plateforme Intelligente de Gestion des Stages & Recrutement

**GeStagy** est une plateforme Full-Stack complète (Spring Boot 3.3 / Java 21 + Angular 22 / Tailwind CSS) conçue pour digitaliser l'intégralité du cycle de vie des stages en entreprise : de la publication des offres et du matching de compétences jusqu'au pipeline Kanban de recrutement, la planification des entretiens, l'encadrement des stagiaires, les évaluations et la génération automatique d'attestations et de rapports officiels en PDF et CSV/Excel.

---

## Fonctionnalités Clés & Modules Implémentés

### 1. Portail Public Candidats & Smart Skill Matcher (`/offres`)
- **Recherche & Filtres multicritères** : Filtrage instantané par mot-clé, compétence, département et durée (`3`, `4`, `6 mois`).
- **Smart Skill Matcher (Unique)** : Simulateur interactif permettant aux candidats de sélectionner leurs compétences techniques et de visualiser en temps réel leur **pourcentage de compatibilité (`Match %`)** sur chaque offre.
- **Candidature avec Upload Réel (`MultipartFile`)** : Dépôt de candidature sans compte avec téléversement du CV et de la lettre de motivation (stockés et servis via `/api/files/{filename}`).

### 2. Authentification JWT, Profil & Redirection par Rôle (`/connexion`)
- Connexion et inscription avec **JWT stateless** (`Bearer Token`) et contrôle d'accès **RBAC** (`ADMIN`, `HR`, `RECRUITER`, `TUTOR`, `INTERN`).
- Redirection intelligente selon le rôle dès la connexion (`Admin` → `/admin`, `RH/Recruteur` → `/dashboard`, `Tuteur/Stagiaire` → `/espace-stagiaire`).
- **Gestion du profil personnel** accessible depuis la barre de navigation + **Centre de Notifications & Rappels** (`🔔`).

### 3. Tableau de Bord RH, Catalogue d'Offres & Export CSV/Excel (`/dashboard`)
- **KPI Temps Réel** : Offres ouvertes/brouillons, total candidats, entretiens planifiés, stagiaires actifs, score moyen d'évaluation et documents en attente de signature.
- **Entonnoir de Conversion (5 étapes)** et **Journal d'Activité (Audit Log)** en direct.
- **CRUD Complet des Offres de Stage** : Création, modification, publication (`OPEN`), passage en brouillon (`DRAFT`), clôture (`CLOSED`) et suppression.
- **Export CSV / Excel** (`GET /api/recruitment/reports/export.csv`) : Téléchargement en un clic du rapport complet des candidatures et des stages.

### 4. Pipeline Kanban 5 Colonnes, Dossier Candidat 360° & Entretiens (`/kanban`)
- **Tableau Kanban Drag & Drop (5 statuts)** : `NEW` (Nouveau), `SCREENING` (Présélection), `INTERVIEW` (Entretien), `ACCEPTED` (Accepté) et `REJECTED` (Refusé).
- **Tiroir Dossier Candidat 360°** :
  - Consultation du CV et de la lettre de motivation.
  - **Scoring & Évaluation RH** (curseur `0–100%` et notes d'entretien).
  - **Planification d'Entretien** (`VIDEO`, `ONSITE`, `PHONE`, date/heure et assignation d'un encadrant/intervieweur).
  - **Onboarding & Conversion en Stagiaire en 1 clic** : Convertit un candidat `ACCEPTED` en compte `INTERN` actif, crée le `Stage`, affecte le `Tuteur`, génère la `Convention` et initialise les tâches d'onboarding.
- **Calendrier des Entretiens** : Vue dédiée aux entretiens planifiés avec saisie du feedback et notation sur 5 étoiles.

### 5. Espace Suivi de Stage, Évaluations & Génération PDF (`/espace-stagiaire`)
- **Sélecteur de Stagiaire** (pour les Tuteurs, RH et Admins) et chargement automatique pour le Stagiaire connecté.
- **Kanban des Tâches (`TODO`, `IN_PROGRESS`, `DONE`)** avec barre de progression globale et création de nouvelles tâches par le tuteur.
- **Évaluations Mi-Parcours (`MID_TERM`) & Finale (`FINAL`)** :
  - Notation sur 20 des **Compétences Techniques**, **Soft Skills** et **Autonomie** avec calcul automatique de la moyenne globale.
  - **Export PDF Officiel** (`GET /api/internships/evaluations/{evalId}/pdf`) générant la fiche d'évaluation officielle.
- **Gestion Documentaire & Attestation PDF** :
  - Dépôt de documents (`CONVENTION`, `REPORT`, `ATTESTATION`, `OTHER`) et validation de **signature électronique**.
  - **Génération d'Attestation de Stage PDF** (`GET /api/internships/{id}/attestation/pdf`) téléchargeable en un clic.

### 6. Administration Système & Référentiels (`/admin`)
- **Gestion des Utilisateurs & Rôles** : Création de comptes, modification dynamique des rôles RBAC et activation/désactivation des accès.
- **Gestion des Départements** : Création de départements et suivi du nombre d'offres et de stagiaires par unité.

---

## Démarrage Rapide

### 1. Lancer le Backend (Spring Boot 3 / Java 21+)
Le backend est préconfiguré avec une base **H2 persistante en mode PostgreSQL** (`./data/gestagy_db`) pour fonctionner immédiatement sans configuration externe, tout en supportant PostgreSQL via la variable `DB_URL`.

```bash
cd backend
mvn spring-boot:run
```

- **API REST** : `http://localhost:8080`
- **Swagger UI (OpenAPI 3)** : `http://localhost:8080/swagger-ui.html`
- **Console H2** : `http://localhost:8080/h2-console`

### 2. Lancer le Frontend (Angular 22)

```bash
cd frontend
npm install
npm start
```

- **Application Web** : `http://localhost:4200`

---

## Comptes de Démonstration (DataSeeder)

> **Mot de passe commun à tous les comptes :** `password123` (ou connexion en **1 clic** depuis la page `/connexion`)

| Rôle | Email | Nom Complet | Spécialité / Poste |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@gestagy.com` | Admin GeStagy | Direction des Systèmes d'Information |
| **HR** | `rh@gestagy.com` | Sarah Benali | Responsable Talents & Campus |
| **RECRUITER** | `recruteur@gestagy.com` | Youssef Amrani | Talent Acquisition Specialist |
| **TUTOR** | `tuteur@gestagy.com` | Alexandre Martin | Principal Tech Lead FullStack |
| **TUTOR** | `nadia.tuteur@gestagy.com` | Nadia Berrada | Lead Product Designer |
| **INTERN** | `stagiaire@gestagy.com` | Mehdi Mansouri | Master 2 Ingénierie Logicielle (M2I) |
| **INTERN** | `lina@gestagy.com` | Lina Tazi | Master UX & Digital Product Design |
