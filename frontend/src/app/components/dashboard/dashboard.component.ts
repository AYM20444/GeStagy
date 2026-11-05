import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DashboardStats, Department, InternshipOffer, OfferStatus } from '../../models/types';
import {
  CountUpDirective,
  MagneticButtonDirective,
  RevealOnScrollDirective,
  Tilt3dDirective
} from '../../directives/tactile-3d.directives';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    Tilt3dDirective,
    MagneticButtonDirective,
    CountUpDirective,
    RevealOnScrollDirective
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Top Header & Tactile 3D Actions -->
      <div revealOnScroll class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 mb-2">
            <span class="live-pulse-dot" style="width:6px;height:6px;"></span>
            <span>LIVE HR TELEMETRY STREAM</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white">Pilotage RH, Offres &amp; Reporting 3D</h1>
          <p class="text-xs sm:text-sm text-slate-400">Gérez vos offres de stage, suivez les KPI du pipeline en temps réel et exportez vos rapports d'activité</p>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button
            magneticBtn
            (click)="exportCsv()"
            class="px-3.5 py-2 text-xs font-bold rounded-xl btn-3d-glass flex items-center gap-1.5">
            📥 Exporter Rapport CSV / Excel
          </button>
          <button
            magneticBtn
            (click)="openCreateOfferModal()"
            class="px-4 py-2 text-xs font-black rounded-xl btn-3d-primary">
            + Créer une Offre de Stage
          </button>
          <a
            magneticBtn
            routerLink="/kanban"
            class="px-4 py-2 text-xs font-bold rounded-xl btn-3d-glass flex items-center">
            🗂️ Pipeline Kanban →
          </a>
        </div>
      </div>

      <!-- 6 3D Tilt KPI Cards with Animated CountUp Telemetry -->
      <div class="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div tilt3d [tiltMaxAngle]="8" revealOnScroll [revealDelay]="0" class="card-3d-glass p-4 rounded-2xl">
          <div class="flex justify-between items-center">
            <span class="text-[11px] text-slate-400 font-bold uppercase">Offres Ouvertes</span>
            <span class="live-pulse-dot" style="width:6px;height:6px;"></span>
          </div>
          <h3 class="text-2xl font-black mt-1.5" style="color: var(--accent-primary)" [countUp]="stats.openOffersCount"></h3>
          <p class="text-[11px] text-slate-400 mt-0.5">+ {{ stats.draftOffersCount }} brouillon(s)</p>
        </div>

        <div tilt3d [tiltMaxAngle]="8" revealOnScroll [revealDelay]="50" class="card-3d-glass p-4 rounded-2xl">
          <span class="text-[11px] text-slate-400 font-bold uppercase">Total Candidats</span>
          <h3 class="text-2xl font-black text-white mt-1.5" [countUp]="stats.totalCandidatesCount"></h3>
          <p class="text-[11px] text-cyan-400 font-semibold mt-0.5">{{ stats.newCandidatesCount }} nouveaux</p>
        </div>

        <div tilt3d [tiltMaxAngle]="8" revealOnScroll [revealDelay]="100" class="card-3d-glass p-4 rounded-2xl">
          <span class="text-[11px] text-slate-400 font-bold uppercase">Entretiens</span>
          <h3 class="text-2xl font-black text-[#B829FF] mt-1.5" [countUp]="stats.totalInterviewsCount"></h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Planifiés &amp; évalués</p>
        </div>

        <div tilt3d [tiltMaxAngle]="8" revealOnScroll [revealDelay]="150" class="card-3d-glass p-4 rounded-2xl">
          <div class="flex justify-between items-center">
            <span class="text-[11px] text-slate-400 font-bold uppercase">Stagiaires Actifs</span>
            <span class="live-pulse-dot" style="width:6px;height:6px;"></span>
          </div>
          <h3 class="text-2xl font-black text-[#10B981] mt-1.5" [countUp]="stats.ongoingInternshipsCount"></h3>
          <p class="text-[11px] text-slate-400 mt-0.5">En cours d'encadrement</p>
        </div>

        <div tilt3d [tiltMaxAngle]="8" revealOnScroll [revealDelay]="200" class="card-3d-glass p-4 rounded-2xl">
          <span class="text-[11px] text-slate-400 font-bold uppercase">Score Évaluations</span>
          <h3 class="text-2xl font-black text-[#F59E0B] mt-1.5" [countUp]="stats.averageEvaluationScore" [countDecimals]="1" countSuffix="/20"></h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Moyenne globale</p>
        </div>

        <div tilt3d [tiltMaxAngle]="8" revealOnScroll [revealDelay]="250" class="card-3d-glass p-4 rounded-2xl">
          <span class="text-[11px] text-slate-400 font-bold uppercase">Docs à Signer</span>
          <h3 class="text-2xl font-black text-[#EF4444] mt-1.5" [countUp]="stats.unsignedDocumentsCount"></h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Conventions en attente</p>
        </div>
      </div>

      <!-- Funnel Analytics & Recent Activity Log -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        <!-- 5-Stage Recruitment Funnel with 3D Tilt -->
        <div tilt3d [tiltMaxAngle]="4" revealOnScroll class="lg:col-span-2 card-3d-glass rounded-2xl p-6">
          <div class="flex justify-between items-center mb-5">
            <div>
              <h3 class="text-base font-extrabold text-white">Entonnoir de Conversion du Recrutement</h3>
              <p class="text-xs text-slate-400">Répartition en temps réel des {{ stats.totalCandidatesCount }} candidatures sur les 5 colonnes Kanban</p>
            </div>
            <a magneticBtn routerLink="/kanban" class="text-xs font-bold px-3 py-1.5 rounded-xl btn-3d-glass">
              Ouvrir Kanban →
            </a>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-200 mb-1.5">
                <span>1. Nouveaux dossiers (APPLIED)</span>
                <span class="text-[#00F0FF]">{{ stats.newCandidatesCount }} candidat(s) ({{ getPercent(stats.newCandidatesCount) }}%)</span>
              </div>
              <div class="w-full bg-[#05050A] h-2.5 rounded-full overflow-hidden border border-white/10">
                <div class="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#00F0FF] to-[#0066FF] shadow-[0_0_12px_#00F0FF]" [style.width.%]="getPercent(stats.newCandidatesCount)"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold text-slate-200 mb-1.5">
                <span>2. Présélection RH (UNDER_REVIEW)</span>
                <span class="text-[#F59E0B]">{{ stats.screeningCandidatesCount }} candidat(s) ({{ getPercent(stats.screeningCandidatesCount) }}%)</span>
              </div>
              <div class="w-full bg-[#05050A] h-2.5 rounded-full overflow-hidden border border-white/10">
                <div class="bg-[#F59E0B] h-full rounded-full transition-all duration-700 shadow-[0_0_12px_#F59E0B]" [style.width.%]="getPercent(stats.screeningCandidatesCount)"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold text-slate-200 mb-1.5">
                <span>3. Entretiens Techniques &amp; RH (INTERVIEW)</span>
                <span class="text-[#B829FF]">{{ stats.interviewCandidatesCount }} candidat(s) ({{ getPercent(stats.interviewCandidatesCount) }}%)</span>
              </div>
              <div class="w-full bg-[#05050A] h-2.5 rounded-full overflow-hidden border border-white/10">
                <div class="bg-gradient-to-r from-[#B829FF] to-[#FF2975] h-full rounded-full transition-all duration-700 shadow-[0_0_12px_#B829FF]" [style.width.%]="getPercent(stats.interviewCandidatesCount)"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold text-slate-200 mb-1.5">
                <span>4. Candidatures Retenues (ACCEPTED)</span>
                <span class="text-[#10B981]">{{ stats.acceptedCandidatesCount }} candidat(s) ({{ getPercent(stats.acceptedCandidatesCount) }}%)</span>
              </div>
              <div class="w-full bg-[#05050A] h-2.5 rounded-full overflow-hidden border border-white/10">
                <div class="bg-[#10B981] h-full rounded-full transition-all duration-700 shadow-[0_0_12px_#10B981]" [style.width.%]="getPercent(stats.acceptedCandidatesCount)"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold text-slate-200 mb-1.5">
                <span>5. Candidatures Non Retenues (REJECTED)</span>
                <span class="text-[#EF4444]">{{ stats.rejectedCandidatesCount }} candidat(s) ({{ getPercent(stats.rejectedCandidatesCount) }}%)</span>
              </div>
              <div class="w-full bg-[#05050A] h-2.5 rounded-full overflow-hidden border border-white/10">
                <div class="bg-[#EF4444] h-full rounded-full transition-all duration-700 shadow-[0_0_12px_#EF4444]" [style.width.%]="getPercent(stats.rejectedCandidatesCount)"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Activity Log with Pulsing Nodes -->
        <div tilt3d [tiltMaxAngle]="4" revealOnScroll [revealDelay]="100" class="card-3d-glass rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-base font-extrabold text-white">Journal d'Activité Live</h3>
              <span class="live-pulse-dot"></span>
            </div>
            <p class="text-xs text-slate-400 mb-4">Traçabilité temps réel (Audit Log)</p>
            <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
              @for (act of stats.recentActivities; track act.id) {
                <div class="flex items-start gap-2.5 text-xs border-b border-white/10 pb-2.5 last:border-0">
                  <span class="w-2 h-2 rounded-full mt-1.5 shrink-0" style="background: var(--accent-primary); box-shadow: 0 0 8px var(--accent-primary)"></span>
                  <div>
                    <p class="text-slate-100 font-semibold leading-snug">{{ act.details }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">Par {{ act.userName }} • {{ act.entity }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Gestion Complète des Offres de Stage (CRUD) -->
      <div revealOnScroll class="card-3d-glass rounded-2xl p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h2 class="text-lg font-extrabold text-white">Gestion du Catalogue des Offres de Stage</h2>
            <p class="text-xs text-slate-400">Créez, modifiez, publiez (OPEN), passez en brouillon (DRAFT) ou clôturez (CLOSED) vos offres</p>
          </div>
          <div class="flex items-center gap-2.5">
            <select [(ngModel)]="offerStatusFilter" class="px-3 py-1.5 rounded-xl text-xs font-semibold">
              <option value="">Tous les statuts ({{ offers.length }})</option>
              <option value="OPEN">OPEN (Publiées)</option>
              <option value="DRAFT">DRAFT (Brouillons)</option>
              <option value="CLOSED">CLOSED (Fermées)</option>
            </select>
            <button
              magneticBtn
              (click)="openCreateOfferModal()"
              class="px-3.5 py-1.5 text-xs font-black rounded-xl btn-3d-primary">
              + Nouvelle Offre
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/10 text-[11px] font-bold uppercase text-slate-400">
                <th class="py-3 px-3">Titre de l'Offre</th>
                <th class="py-3 px-3">Département</th>
                <th class="py-3 px-3">Lieu &amp; Durée</th>
                <th class="py-3 px-3">Candidats</th>
                <th class="py-3 px-3">Statut</th>
                <th class="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10 text-xs">
              @for (offer of filteredOffers; track offer.id) {
                <tr class="hover:bg-white/5 transition">
                  <td class="py-3.5 px-3">
                    <p class="font-bold text-white">{{ offer.title }}</p>
                    <div class="flex flex-wrap gap-1 mt-1">
                      @for (s of offer.skills.slice(0, 4); track s) {
                        <span class="text-[10px] bg-white/5 border border-white/10 text-slate-300 px-1.5 py-0.5 rounded">{{ s }}</span>
                      }
                    </div>
                  </td>
                  <td class="py-3.5 px-3 font-medium text-slate-300">{{ offer.departmentName }}</td>
                  <td class="py-3.5 px-3 text-slate-400">{{ offer.location }} • {{ offer.durationMonths }} mois</td>
                  <td class="py-3.5 px-3">
                    <span class="px-2.5 py-1 bg-indigo-50 border font-bold rounded-full">
                      {{ offer.candidatesCount }} candidat(s)
                    </span>
                  </td>
                  <td class="py-3.5 px-3">
                    <span
                      class="px-2.5 py-1 rounded-full text-[11px] font-bold border"
                      [ngClass]="{
                        'bg-emerald-50': offer.status === 'OPEN',
                        'bg-amber-50': offer.status === 'DRAFT',
                        'bg-slate-100': offer.status === 'CLOSED'
                      }">
                      {{ offer.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                    @if (offer.status !== 'OPEN') {
                      <button
                        magneticBtn
                        (click)="toggleOfferStatus(offer, 'OPEN')"
                        class="px-2.5 py-1 bg-emerald-50 border font-bold rounded-lg transition">
                        Publier
                      </button>
                    } @else {
                      <button
                        magneticBtn
                        (click)="toggleOfferStatus(offer, 'CLOSED')"
                        class="px-2.5 py-1 bg-amber-50 border font-bold rounded-lg transition">
                        Fermer
                      </button>
                    }
                    <button
                      magneticBtn
                      (click)="openEditOfferModal(offer)"
                      class="px-2.5 py-1 btn-3d-glass font-bold rounded-lg">
                      Modifier
                    </button>
                    <button
                      magneticBtn
                      (click)="deleteOffer(offer.id)"
                      class="px-2.5 py-1 bg-rose-50 border font-bold rounded-lg transition">
                      Suppr.
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal 3D Création / Édition d'Offre -->
      @if (showOfferModal) {
        <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div tilt3d [tiltMaxAngle]="3" class="card-3d-glass rounded-3xl max-w-lg w-full p-6 sm:p-8 my-8">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-black text-white">
                {{ editingOfferId ? 'Modifier l’Offre de Stage' : 'Créer une Nouvelle Offre de Stage' }}
              </h3>
              <button (click)="showOfferModal = false" class="text-slate-400 hover:text-white">✕</button>
            </div>

            <form (ngSubmit)="saveOffer()" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Titre de l'offre *</label>
                <input [(ngModel)]="offerForm.title" name="title" required class="w-full px-3 py-2 rounded-xl text-sm outline-none" placeholder="Ex: Stagiaire Ingénieur DevSecOps">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-300 mb-1">Département *</label>
                  <select [(ngModel)]="offerForm.departmentId" name="departmentId" class="w-full px-3 py-2 rounded-xl text-sm">
                    @for (d of departments; track d.id) {
                      <option [ngValue]="d.id">{{ d.name }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-300 mb-1">Statut *</label>
                  <select [(ngModel)]="offerForm.status" name="status" class="w-full px-3 py-2 rounded-xl text-sm">
                    <option value="OPEN">OPEN (Publiée)</option>
                    <option value="DRAFT">DRAFT (Brouillon)</option>
                    <option value="CLOSED">CLOSED (Fermée)</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-300 mb-1">Durée (mois)</label>
                  <input [(ngModel)]="offerForm.durationMonths" name="durationMonths" type="number" min="1" max="12" class="w-full px-3 py-2 rounded-xl text-sm">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-300 mb-1">Date de début</label>
                  <input [(ngModel)]="offerForm.startDate" name="startDate" type="date" class="w-full px-3 py-2 rounded-xl text-sm">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-300 mb-1">Localisation</label>
                  <input [(ngModel)]="offerForm.location" name="location" class="w-full px-3 py-2 rounded-xl text-sm" placeholder="Casablanca">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Compétences (séparées par des virgules)</label>
                <input [(ngModel)]="offerForm.skillsText" name="skillsText" class="w-full px-3 py-2 rounded-xl text-sm" placeholder="Java, Spring Boot, Angular, Docker">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Description détaillée *</label>
                <textarea [(ngModel)]="offerForm.description" name="description" rows="3" required class="w-full px-3 py-2 rounded-xl text-sm"></textarea>
              </div>

              <div class="flex justify-end gap-2.5 pt-3">
                <button magneticBtn type="button" (click)="showOfferModal = false" class="px-4 py-2 rounded-xl text-xs font-bold btn-3d-glass">
                  Annuler
                </button>
                <button magneticBtn type="submit" class="px-5 py-2 rounded-xl text-xs font-black btn-3d-primary">
                  {{ editingOfferId ? 'Enregistrer' : 'Publier l’offre' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    openOffersCount: 4,
    draftOffersCount: 1,
    closedOffersCount: 0,
    totalCandidatesCount: 10,
    newCandidatesCount: 3,
    screeningCandidatesCount: 2,
    interviewCandidatesCount: 2,
    acceptedCandidatesCount: 2,
    rejectedCandidatesCount: 1,
    ongoingInternshipsCount: 2,
    completedInternshipsCount: 0,
    upcomingInternshipsCount: 0,
    upcomingEndDatesCount: 2,
    totalInterviewsCount: 3,
    unsignedDocumentsCount: 1,
    averageEvaluationScore: 17.5,
    recentActivities: [
      { id: 1, userName: 'Sarah Benali', action: 'CANDIDATE_ACCEPTED', entity: 'Candidate', details: 'Candidature de Nour Alami (EHTP) validée avec un score de 95%', createdAt: '' },
      { id: 2, userName: 'Alexandre Martin', action: 'EVALUATION_COMPLETED', entity: 'Evaluation', details: 'Évaluation mi-parcours enregistrée pour Mehdi Mansouri (17.5/20)', createdAt: '' },
      { id: 3, userName: 'Youssef Amrani', action: 'INTERVIEW_SCHEDULED', entity: 'Interview', details: 'Entretien technique VIDEO planifié pour Ayoub Chraibi', createdAt: '' },
      { id: 4, userName: 'Sarah Benali', action: 'OFFER_PUBLISHED', entity: 'InternshipOffer', details: 'Publication de l’offre : Stagiaire Data Scientist & IA Générative', createdAt: '' }
    ]
  };

  departments: Department[] = [
    { id: 1, name: 'Ingénierie & Tech', description: 'Équipe R&D, Cloud et Plateforme' },
    { id: 2, name: 'Produit & Design', description: 'Design UI/UX & Product Management' },
    { id: 3, name: 'Marketing & Com', description: 'Growth & Marque Employeur' },
    { id: 4, name: 'Data & IA', description: 'Data Science & Intelligence Artificielle' }
  ];

  offers: InternshipOffer[] = [
    {
      id: 1,
      title: 'Stagiaire Développeur FullStack (Angular / Spring Boot)',
      description: 'Rejoignez notre équipe Core Platform pour concevoir des microservices résilients sous Spring Boot 3.',
      departmentId: 1,
      departmentName: 'Ingénierie & Tech',
      skills: ['Java', 'Spring Boot', 'Angular', 'TypeScript', 'PostgreSQL'],
      durationMonths: 6,
      startDate: '2026-11-20',
      location: 'Casablanca / Hybride',
      status: 'OPEN',
      candidatesCount: 6,
      createdAt: ''
    },
    {
      id: 2,
      title: 'Stagiaire Product Designer & UI/UX Specialist',
      description: 'Contribuez à l’ergonomie et aux maquettes de nos nouvelles applications web & mobiles.',
      departmentId: 2,
      departmentName: 'Produit & Design',
      skills: ['Figma', 'Design System', 'Tailwind CSS'],
      durationMonths: 4,
      startDate: '2026-11-25',
      location: 'Rabat / Présentiel',
      status: 'OPEN',
      candidatesCount: 3,
      createdAt: ''
    },
    {
      id: 5,
      title: 'Stagiaire Employer Branding & Relations Écoles',
      description: 'Gestion de nos campagnes de recrutement campus et communication digitale.',
      departmentId: 3,
      departmentName: 'Marketing & Com',
      skills: ['Copywriting', 'LinkedIn Ads', 'Canva', 'SEO'],
      durationMonths: 3,
      startDate: '2026-12-15',
      location: 'Casablanca',
      status: 'DRAFT',
      candidatesCount: 0,
      createdAt: ''
    }
  ];

  offerStatusFilter = '';
  showOfferModal = false;
  editingOfferId: number | null = null;

  offerForm = {
    title: '',
    description: '',
    departmentId: 1,
    durationMonths: 6,
    startDate: '2026-12-01',
    location: 'Casablanca / Hybride',
    status: 'OPEN' as OfferStatus,
    skillsText: 'Java, Spring Boot, Angular, Docker'
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getDashboardStats().subscribe({
      next: (res) => this.stats = res,
      error: () => {}
    });
    this.api.getAllOffers().subscribe({
      next: (list) => {
        if (list && list.length > 0) this.offers = list;
      },
      error: () => {}
    });
    this.api.getPublicDepartments().subscribe({
      next: (depts) => {
        if (depts && depts.length > 0) this.departments = depts;
      },
      error: () => {}
    });
  }

  get filteredOffers(): InternshipOffer[] {
    if (!this.offerStatusFilter) return this.offers;
    return this.offers.filter(o => o.status === this.offerStatusFilter);
  }

  getPercent(count: number): number {
    if (!this.stats.totalCandidatesCount) return 0;
    return Math.round((count / this.stats.totalCandidatesCount) * 100);
  }

  openCreateOfferModal() {
    this.editingOfferId = null;
    this.offerForm = {
      title: '',
      description: '',
      departmentId: this.departments[0]?.id || 1,
      durationMonths: 6,
      startDate: '2026-12-01',
      location: 'Casablanca / Hybride',
      status: 'OPEN',
      skillsText: 'Java, Spring Boot, Angular, PostgreSQL'
    };
    this.showOfferModal = true;
  }

  openEditOfferModal(offer: InternshipOffer) {
    this.editingOfferId = offer.id;
    this.offerForm = {
      title: offer.title,
      description: offer.description,
      departmentId: offer.departmentId || 1,
      durationMonths: offer.durationMonths,
      startDate: offer.startDate || '2026-12-01',
      location: offer.location,
      status: offer.status,
      skillsText: (offer.skills || []).join(', ')
    };
    this.showOfferModal = true;
  }

  saveOffer() {
    const skills = this.offerForm.skillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const dept = this.departments.find(d => d.id === Number(this.offerForm.departmentId));

    const payload: Partial<InternshipOffer> = {
      title: this.offerForm.title,
      description: this.offerForm.description,
      departmentId: Number(this.offerForm.departmentId),
      durationMonths: Number(this.offerForm.durationMonths),
      startDate: this.offerForm.startDate,
      location: this.offerForm.location,
      status: this.offerForm.status,
      skills
    };

    if (this.editingOfferId) {
      const id = this.editingOfferId;
      this.api.updateOffer(id, payload).subscribe({
        next: (updated) => {
          this.offers = this.offers.map(o => o.id === id ? updated : o);
          this.showOfferModal = false;
          this.loadData();
        },
        error: () => {
          this.offers = this.offers.map(o => o.id === id ? {
            ...o,
            ...payload,
            departmentName: dept?.name || o.departmentName,
            skills
          } as InternshipOffer : o);
          this.showOfferModal = false;
        }
      });
    } else {
      this.api.createOffer(payload).subscribe({
        next: (created) => {
          this.offers = [created, ...this.offers];
          this.showOfferModal = false;
          this.loadData();
        },
        error: () => {
          const mockOffer: InternshipOffer = {
            id: Date.now(),
            title: payload.title || 'Nouvelle Offre',
            description: payload.description || '',
            departmentId: Number(payload.departmentId),
            departmentName: dept?.name || 'Ingénierie & Tech',
            skills,
            durationMonths: Number(payload.durationMonths),
            startDate: payload.startDate || '',
            location: payload.location || 'Casablanca',
            status: payload.status || 'OPEN',
            candidatesCount: 0,
            createdAt: new Date().toISOString()
          };
          this.offers = [mockOffer, ...this.offers];
          this.showOfferModal = false;
        }
      });
    }
  }

  toggleOfferStatus(offer: InternshipOffer, newStatus: OfferStatus) {
    const payload = { ...offer, status: newStatus };
    this.api.updateOffer(offer.id, payload).subscribe({
      next: (updated) => {
        offer.status = updated.status;
        this.loadData();
      },
      error: () => {
        offer.status = newStatus;
      }
    });
  }

  deleteOffer(id: number) {
    this.api.deleteOffer(id).subscribe({
      next: () => {
        this.offers = this.offers.filter(o => o.id !== id);
        this.loadData();
      },
      error: () => {
        this.offers = this.offers.filter(o => o.id !== id);
      }
    });
  }

  exportCsv() {
    this.api.exportRecruitmentCsv().subscribe({
      next: (blob) => {
        this.triggerDownload(blob, 'GeStagy_Rapport_RH_2026.csv');
      },
      error: () => {
        const csv = '\ufeffID;Offre;Département;Durée;Statut;Candidats\n' +
          this.offers.map(o => `${o.id};"${o.title}";"${o.departmentName}";${o.durationMonths} mois;${o.status};${o.candidatesCount}`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        this.triggerDownload(blob, 'GeStagy_Rapport_RH_2026.csv');
      }
    });
  }

  private triggerDownload(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
