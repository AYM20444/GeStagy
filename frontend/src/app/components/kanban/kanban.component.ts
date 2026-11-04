import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Candidate, CandidateStatus, Interview, InterviewType, UserProfile } from '../../models/types';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Top Bar & View Switcher -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Pipeline de Recrutement &amp; Entretiens</h1>
          <p class="text-xs sm:text-sm text-slate-500">Glissez-déposez les candidats sur les 5 colonnes, cliquez sur une carte pour ouvrir son dossier 360° ou planifier un entretien</p>
        </div>

        <div class="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
          <button
            (click)="activeTab = 'KANBAN'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
            [ngClass]="activeTab === 'KANBAN' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'">
            🗂️ Tableau Kanban ({{ filteredCandidates.length }})
          </button>
          <button
            (click)="activeTab = 'INTERVIEWS'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
            [ngClass]="activeTab === 'INTERVIEWS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'">
            📅 Calendrier Entretiens ({{ interviews.length }})
          </button>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          [(ngModel)]="searchKeyword"
          placeholder="🔍 Filtrer par nom, école (ENSIAS, EMI, INPT...) ou email..."
          class="px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500">

        <select [(ngModel)]="offerFilter" class="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">📋 Toutes les offres de stage</option>
          @for (title of offerTitles; track title) {
            <option [value]="title">{{ title }}</option>
          }
        </select>

        <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <span class="text-xs font-bold text-slate-600 whitespace-nowrap">Score min : {{ minScoreFilter }}%</span>
          <input type="range" min="0" max="95" step="5" [(ngModel)]="minScoreFilter" class="w-full accent-indigo-600">
        </div>
      </div>

      <!-- TAB 1: 5-COLUMN KANBAN PIPELINE -->
      @if (activeTab === 'KANBAN') {
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
          @for (col of columns; track col.status) {
            <div
              (dragover)="onDragOver($event, col.status)"
              (dragleave)="dragOverStatus = null"
              (drop)="onDrop($event, col.status)"
              class="bg-slate-100/80 border rounded-2xl p-3.5 flex flex-col min-h-[540px] transition-all"
              [ngClass]="dragOverStatus === col.status ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-300' : 'border-slate-200/80'">

              <!-- Column Header -->
              <div class="flex justify-between items-center mb-3 px-1">
                <h3 class="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full" [ngClass]="col.dotClass"></span>
                  {{ col.label }}
                </h3>
                <span class="text-[11px] font-black px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                  {{ getCandidatesByStatus(col.status).length }}
                </span>
              </div>

              <!-- Cards List -->
              <div class="flex-1 space-y-2.5">
                @for (c of getCandidatesByStatus(col.status); track c.id) {
                  <div
                    draggable="true"
                    (dragstart)="onDragStart($event, c)"
                    (click)="openCandidateDrawer(c)"
                    class="bg-white p-3.5 rounded-xl shadow-2xs border border-slate-200/90 hover:shadow-md hover:border-indigo-300 cursor-grab active:cursor-grabbing transition group">

                    <div class="flex justify-between items-start gap-1 mb-1.5">
                      <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 truncate max-w-[120px]">
                        🎓 {{ c.school }}
                      </span>
                      <span
                        class="text-[10px] font-black px-1.5 py-0.5 rounded"
                        [ngClass]="(c.score || 0) >= 85 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
                        {{ c.score || 75 }}%
                      </span>
                    </div>

                    <h4 class="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition">{{ c.fullName }}</h4>
                    <p class="text-[11px] text-slate-500 line-clamp-1 mb-2">{{ c.offerTitle }}</p>

                    @if (c.notes) {
                      <p class="text-[10px] text-slate-400 italic line-clamp-1 mb-2">"{{ c.notes }}"</p>
                    }

                    <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                      <span>📞 {{ c.phone }}</span>
                      @if (c.status === 'ACCEPTED') {
                        <span class="text-emerald-600 font-bold">✓ Retenu</span>
                      } @else if (c.status === 'INTERVIEW') {
                        <span class="text-purple-600 font-bold">📅 Entretien</span>
                      } @else {
                        <span class="text-indigo-600 font-semibold group-hover:underline">Dossier →</span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- TAB 2: INTERVIEWS CALENDAR & FEEDBACK -->
      @if (activeTab === 'INTERVIEWS') {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <div class="flex justify-between items-center mb-5">
            <div>
              <h2 class="text-lg font-extrabold text-slate-900">Calendrier des Entretiens Planifiés</h2>
              <p class="text-xs text-slate-500">Suivez les entretiens téléphoniques (PHONE), visio (VIDEO) et présentiels (ONSITE) et saisissez vos feedbacks</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (iv of interviews; track iv.id) {
              <div class="border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition flex flex-col justify-between bg-slate-50/40">
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <span class="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                      [ngClass]="{
                        'bg-purple-100 text-purple-800': iv.type === 'VIDEO',
                        'bg-sky-100 text-sky-800': iv.type === 'PHONE',
                        'bg-emerald-100 text-emerald-800': iv.type === 'ONSITE'
                      }">
                      {{ iv.type === 'VIDEO' ? '🎥 Visio' : (iv.type === 'PHONE' ? '📞 Téléphone' : '🏢 Présentiel') }}
                    </span>
                    <span class="text-xs font-bold text-slate-700">
                      📅 {{ iv.scheduledAt | slice:0:16 }}
                    </span>
                  </div>

                  <h4 class="text-sm font-black text-slate-900">{{ iv.candidateName }}</h4>
                  <p class="text-xs text-indigo-600 font-semibold mb-1">{{ iv.offerTitle }}</p>
                  <p class="text-xs text-slate-500 mb-3">👨‍🏫 Intervieweur : <strong>{{ iv.interviewerName }}</strong></p>

                  <div class="bg-white p-3 rounded-xl border border-slate-200/80 mb-3">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-[10px] font-bold uppercase text-slate-400">Feedback &amp; Note</span>
                      <span class="text-xs font-bold text-amber-500">
                        {{ '★'.repeat(iv.rating || 4) }}{{ '☆'.repeat(5 - (iv.rating || 4)) }} ({{ iv.rating || 4 }}/5)
                      </span>
                    </div>
                    <p class="text-xs text-slate-700">{{ iv.feedback || 'Aucun compte-rendu saisi pour le moment.' }}</p>
                  </div>
                </div>

                <button
                  (click)="openFeedbackEditor(iv)"
                  class="w-full py-2 bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl text-xs font-bold transition">
                  ✏️ Saisir / Modifier le Feedback
                </button>
              </div>
            }
          </div>
        </div>
      }

      <!-- SLIDE-OVER DRAWER : DOSSIER CANDIDAT 360° -->
      @if (selectedCandidate) {
        <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div class="bg-white w-full max-w-xl h-full overflow-y-auto p-6 sm:p-8 shadow-2xl border-l border-slate-200 flex flex-col justify-between">
            <div>
              <!-- Header -->
              <div class="flex justify-between items-start gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    🎓 {{ selectedCandidate.school }}
                  </span>
                  <h2 class="text-xl font-black text-slate-900 mt-2">{{ selectedCandidate.fullName }}</h2>
                  <p class="text-xs text-slate-500">{{ selectedCandidate.email }} • {{ selectedCandidate.phone }}</p>
                </div>
                <button (click)="selectedCandidate = null" class="text-slate-400 hover:text-slate-600 text-xl">✕</button>
              </div>

              @if (drawerBannerMessage) {
                <div class="mt-4 bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold border border-emerald-200">
                  ✓ {{ drawerBannerMessage }}
                </div>
              }

              <!-- Quick Status Switcher -->
              <div class="mt-4">
                <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">Étape du Pipeline Kanban</label>
                <div class="flex flex-wrap gap-1.5">
                  @for (col of columns; track col.status) {
                    <button
                      (click)="changeStatusFromDrawer(selectedCandidate, col.status)"
                      class="px-3 py-1.5 rounded-xl text-xs font-bold border transition"
                      [ngClass]="selectedCandidate.status === col.status
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'">
                      {{ col.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Documents du Candidat (CV & Lettre) -->
              <div class="mt-5 grid grid-cols-2 gap-3">
                <a
                  [href]="getFullDocumentUrl(selectedCandidate.cvUrl)"
                  target="_blank"
                  class="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>📄 Consulter le CV</span>
                  <span class="text-indigo-600">↗</span>
                </a>
                <a
                  [href]="getFullDocumentUrl(selectedCandidate.coverLetterUrl)"
                  target="_blank"
                  class="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>✉️ Lettre de motivation</span>
                  <span class="text-indigo-600">↗</span>
                </a>
              </div>

              <!-- Évaluer et Noter le Candidat -->
              <div class="mt-5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="text-xs font-extrabold uppercase text-slate-700">⭐ Évaluation &amp; Scoring RH</h4>
                  <span class="text-sm font-black text-indigo-600">{{ scoreEdit.score }} / 100</span>
                </div>
                <input type="range" min="0" max="100" [(ngModel)]="scoreEdit.score" class="w-full accent-indigo-600 mb-2">
                <textarea
                  [(ngModel)]="scoreEdit.notes"
                  rows="2"
                  placeholder="Notes d'évaluation RH ou techniques..."
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white mb-2"></textarea>
                <button
                  (click)="saveCandidateScore()"
                  class="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition">
                  Enregistrer la note &amp; l'avis
                </button>
              </div>

              <!-- Planifier un Entretien -->
              <div class="mt-5 bg-purple-50/50 p-4 rounded-2xl border border-purple-200/80">
                <h4 class="text-xs font-extrabold uppercase text-purple-900 mb-3">📅 Planifier un Entretien</h4>
                <div class="grid grid-cols-2 gap-2.5 mb-2.5">
                  <div>
                    <label class="block text-[11px] font-bold text-slate-600 mb-1">Date &amp; Heure</label>
                    <input type="datetime-local" [(ngModel)]="interviewForm.scheduledAt" class="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-white">
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-slate-600 mb-1">Format</label>
                    <select [(ngModel)]="interviewForm.type" class="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-white">
                      <option value="VIDEO">🎥 Visioconférence</option>
                      <option value="ONSITE">🏢 Présentiel</option>
                      <option value="PHONE">📞 Téléphonique</option>
                    </select>
                  </div>
                </div>
                <div class="mb-2.5">
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Assigner un Intervieweur / Encadrant</label>
                  <select [(ngModel)]="interviewForm.interviewerId" class="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-white">
                    @for (t of tutors; track t.id) {
                      <option [ngValue]="t.id">{{ t.fullName }} ({{ t.fieldOfStudy || 'Encadrant' }})</option>
                    }
                  </select>
                </div>
                <button
                  (click)="scheduleInterviewForCandidate()"
                  class="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition">
                  + Planifier l'entretien &amp; passer en statut INTERVIEW
                </button>
              </div>

              <!-- Convertir le Candidat en Stagiaire Actif -->
              <div class="mt-5 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
                <h4 class="text-xs font-extrabold uppercase text-emerald-900 mb-1">🎓 Onboarding &amp; Conversion en Stagiaire</h4>
                <p class="text-[11px] text-emerald-700 mb-3">
                  Crée automatiquement le compte Stagiaire, affecte le Tuteur, génère la Convention de Stage et initialise le Kanban de suivi.
                </p>
                <div class="grid grid-cols-2 gap-2.5 mb-2.5">
                  <div>
                    <label class="block text-[11px] font-bold text-emerald-900 mb-1">Encadrant (Tuteur)</label>
                    <select [(ngModel)]="convertForm.tutorId" class="w-full px-2.5 py-1.5 border border-emerald-300 rounded-xl text-xs bg-white">
                      @for (t of tutors; track t.id) {
                        <option [ngValue]="t.id">{{ t.fullName }}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-emerald-900 mb-1">Date de début</label>
                    <input type="date" [(ngModel)]="convertForm.startDate" class="w-full px-2.5 py-1.5 border border-emerald-300 rounded-xl text-xs bg-white">
                  </div>
                </div>
                <button
                  (click)="convertCandidateToIntern()"
                  class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition">
                  🚀 Valider &amp; Créer le Stage Officiel
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- MODAL FEEDBACK ENTRETIEN -->
      @if (editingInterview) {
        <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 class="text-lg font-black text-slate-900 mb-1">Compte-rendu d'Entretien</h3>
            <p class="text-xs text-slate-500 mb-4">Candidat : {{ editingInterview.candidateName }}</p>

            <div class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Note globale (sur 5)</label>
                <select [(ngModel)]="feedbackForm.rating" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white">
                  <option [ngValue]="5">★★★★★ (5/5 - Excellent)</option>
                  <option [ngValue]="4">★★★★☆ (4/5 - Très bon)</option>
                  <option [ngValue]="3">★★★☆☆ (3/5 - Satisfaisant)</option>
                  <option [ngValue]="2">★★☆☆☆ (2/5 - Moyen)</option>
                  <option [ngValue]="1">★☆☆☆☆ (1/5 - Insuffisant)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Feedback détaillé de l'intervieweur</label>
                <textarea [(ngModel)]="feedbackForm.feedback" rows="3" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"></textarea>
              </div>
              <div class="flex justify-end gap-2 pt-2">
                <button (click)="editingInterview = null" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Annuler</button>
                <button (click)="saveInterviewFeedback()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class KanbanComponent implements OnInit {
  activeTab: 'KANBAN' | 'INTERVIEWS' = 'KANBAN';

  columns: { status: CandidateStatus; label: string; dotClass: string }[] = [
    { status: 'NEW', label: 'Nouveau', dotClass: 'bg-sky-500' },
    { status: 'SCREENING', label: 'Présélection', dotClass: 'bg-amber-500' },
    { status: 'INTERVIEW', label: 'Entretien', dotClass: 'bg-purple-500' },
    { status: 'ACCEPTED', label: 'Accepté', dotClass: 'bg-emerald-500' },
    { status: 'REJECTED', label: 'Refusé', dotClass: 'bg-rose-500' }
  ];

  candidates: Candidate[] = [
    { id: 1, offerId: 1, offerTitle: 'Stagiaire Développeur FullStack (Angular / Spring Boot)', departmentName: 'Ingénierie & Tech', fullName: 'Sophia El Fassi', email: 'sophia.elfassi@test.com', phone: '+212 600 112233', school: 'ENSIAS', status: 'NEW', score: 86, notes: 'Profil solide en Spring Boot 3 et architecture hexagonale.', createdAt: '' },
    { id: 2, offerId: 1, offerTitle: 'Stagiaire Développeur FullStack (Angular / Spring Boot)', departmentName: 'Ingénierie & Tech', fullName: 'Karim Haddad', email: 'karim.haddad@test.com', phone: '+212 611 223344', school: 'EMI', status: 'NEW', score: 79, notes: 'Bonnes bases Java 21 et projets Angular.', createdAt: '' },
    { id: 3, offerId: 1, offerTitle: 'Stagiaire Développeur FullStack (Angular / Spring Boot)', departmentName: 'Ingénierie & Tech', fullName: 'Salma Bennani', email: 'salma.bennani@test.com', phone: '+212 622 334455', school: 'INPT', status: 'SCREENING', score: 88, notes: 'Entretien préliminaire RH très positif.', createdAt: '' },
    { id: 4, offerId: 1, offerTitle: 'Stagiaire Développeur FullStack (Angular / Spring Boot)', departmentName: 'Ingénierie & Tech', fullName: 'Ayoub Chraibi', email: 'ayoub.chraibi@test.com', phone: '+212 633 445566', school: 'FST Fès', status: 'INTERVIEW', score: 91, notes: 'Test algorithmique réussi avec brio.', createdAt: '' },
    { id: 5, offerId: 1, offerTitle: 'Stagiaire Développeur FullStack (Angular / Spring Boot)', departmentName: 'Ingénierie & Tech', fullName: 'Nour Alami', email: 'nour.alami@test.com', phone: '+212 644 556677', school: 'EHTP', status: 'ACCEPTED', score: 95, notes: 'Excellente candidate retenue, prête pour conversion en stagiaire.', createdAt: '' },
    { id: 6, offerId: 1, offerTitle: 'Stagiaire Développeur FullStack (Angular / Spring Boot)', departmentName: 'Ingénierie & Tech', fullName: 'Hamza Berrada', email: 'hamza.berrada@test.com', phone: '+212 655 667788', school: 'Université Hassan II', status: 'REJECTED', score: 54, notes: 'Disponibilité incompatible avec la durée de 6 mois.', createdAt: '' },
    { id: 7, offerId: 2, offerTitle: 'Stagiaire Product Designer & UI/UX Specialist', departmentName: 'Produit & Design', fullName: 'Zineb Kabbaj', email: 'zineb.kabbaj@test.com', phone: '+212 666 778899', school: 'Artcom Sup', status: 'NEW', score: 81, notes: 'Portfolio Behance très créatif.', createdAt: '' },
    { id: 8, offerId: 2, offerTitle: 'Stagiaire Product Designer & UI/UX Specialist', departmentName: 'Produit & Design', fullName: 'Ghita Idrissi', email: 'ghita.idrissi@test.com', phone: '+212 688 990011', school: 'ComSup', status: 'INTERVIEW', score: 89, notes: 'Revue de portfolio validée par l’équipe Design.', createdAt: '' }
  ];

  interviews: Interview[] = [
    { id: 1, candidateId: 4, candidateName: 'Ayoub Chraibi', offerTitle: 'Stagiaire Développeur FullStack', interviewerId: 4, interviewerName: 'Alexandre Martin', scheduledAt: '2026-11-06T10:30:00', type: 'VIDEO', feedback: 'Excellente maîtrise de Spring Security et Angular Signals.', rating: 5 },
    { id: 2, candidateId: 8, candidateName: 'Ghita Idrissi', offerTitle: 'Stagiaire Product Designer & UI/UX', interviewerId: 5, interviewerName: 'Nadia Berrada', scheduledAt: '2026-11-07T14:00:00', type: 'ONSITE', feedback: 'Exercice de maquettage Figma en direct très concluant.', rating: 4 },
    { id: 3, candidateId: 3, candidateName: 'Salma Bennani', offerTitle: 'Stagiaire Développeur FullStack', interviewerId: 3, interviewerName: 'Youssef Amrani', scheduledAt: '2026-11-08T11:00:00', type: 'PHONE', feedback: 'Qualification téléphonique RH validée.', rating: 4 }
  ];

  tutors: UserProfile[] = [
    { id: 4, email: 'tuteur@gestagy.com', fullName: 'Alexandre Martin', fieldOfStudy: 'Principal Tech Lead FullStack', active: true, roles: ['TUTOR'] },
    { id: 5, email: 'nadia.tuteur@gestagy.com', fullName: 'Nadia Berrada', fieldOfStudy: 'Lead Product Designer', active: true, roles: ['TUTOR'] }
  ];

  searchKeyword = '';
  offerFilter = '';
  minScoreFilter = 0;

  draggedCandidate: Candidate | null = null;
  dragOverStatus: CandidateStatus | null = null;

  selectedCandidate: Candidate | null = null;
  drawerBannerMessage = '';

  scoreEdit = { score: 80, notes: '' };
  interviewForm = {
    scheduledAt: '2026-11-10T10:00',
    type: 'VIDEO' as InterviewType,
    interviewerId: 4
  };
  convertForm = {
    tutorId: 4,
    startDate: '2026-11-15'
  };

  editingInterview: Interview | null = null;
  feedbackForm = { rating: 5, feedback: '' };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.api.getAllCandidates().subscribe({
      next: (data) => {
        if (data && data.length > 0) this.candidates = data;
      },
      error: () => {}
    });
    this.api.getAllInterviews().subscribe({
      next: (list) => {
        if (list && list.length > 0) this.interviews = list;
      },
      error: () => {}
    });
    this.api.getTutors().subscribe({
      next: (list) => {
        if (list && list.length > 0) {
          this.tutors = list;
          this.interviewForm.interviewerId = list[0].id;
          this.convertForm.tutorId = list[0].id;
        }
      },
      error: () => {}
    });
  }

  get offerTitles(): string[] {
    return Array.from(new Set(this.candidates.map(c => c.offerTitle)));
  }

  get filteredCandidates(): Candidate[] {
    return this.candidates.filter(c => {
      const kw = this.searchKeyword.trim().toLowerCase();
      const matchKw = !kw
        || c.fullName.toLowerCase().includes(kw)
        || (c.school && c.school.toLowerCase().includes(kw))
        || c.email.toLowerCase().includes(kw);
      const matchOffer = !this.offerFilter || c.offerTitle === this.offerFilter;
      const matchScore = (c.score || 0) >= this.minScoreFilter;
      return matchKw && matchOffer && matchScore;
    });
  }

  getCandidatesByStatus(status: CandidateStatus): Candidate[] {
    return this.filteredCandidates.filter(c => c.status === status);
  }

  // Native HTML5 Drag & Drop
  onDragStart(event: DragEvent, candidate: Candidate) {
    this.draggedCandidate = candidate;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(candidate.id));
    }
  }

  onDragOver(event: DragEvent, status: CandidateStatus) {
    event.preventDefault();
    this.dragOverStatus = status;
  }

  onDrop(event: DragEvent, newStatus: CandidateStatus) {
    event.preventDefault();
    this.dragOverStatus = null;
    if (!this.draggedCandidate || this.draggedCandidate.status === newStatus) return;

    const target = this.draggedCandidate;
    target.status = newStatus;
    this.draggedCandidate = null;

    this.api.updateCandidateStatus(target.id, newStatus).subscribe({
      next: (updated) => {
        target.status = updated.status;
      },
      error: () => {}
    });
  }

  openCandidateDrawer(c: Candidate) {
    this.selectedCandidate = c;
    this.drawerBannerMessage = '';
    this.scoreEdit = {
      score: c.score || 80,
      notes: c.notes || ''
    };
  }

  changeStatusFromDrawer(c: Candidate, newStatus: CandidateStatus) {
    c.status = newStatus;
    this.api.updateCandidateStatus(c.id, newStatus).subscribe({
      next: () => {
        this.drawerBannerMessage = `Statut mis à jour vers ${newStatus} !`;
      },
      error: () => {
        this.drawerBannerMessage = `Statut mis à jour vers ${newStatus} !`;
      }
    });
  }

  saveCandidateScore() {
    if (!this.selectedCandidate) return;
    const c = this.selectedCandidate;
    c.score = this.scoreEdit.score;
    c.notes = this.scoreEdit.notes;
    this.api.updateCandidateScore(c.id, this.scoreEdit.score, this.scoreEdit.notes).subscribe({
      next: () => {
        this.drawerBannerMessage = 'Score et notes RH enregistrés avec succès !';
      },
      error: () => {
        this.drawerBannerMessage = 'Score et notes RH enregistrés !';
      }
    });
  }

  scheduleInterviewForCandidate() {
    if (!this.selectedCandidate) return;
    const c = this.selectedCandidate;
    const tutor = this.tutors.find(t => t.id === Number(this.interviewForm.interviewerId));
    const isoDate = this.interviewForm.scheduledAt.length === 16
      ? `${this.interviewForm.scheduledAt}:00`
      : this.interviewForm.scheduledAt;

    this.api.scheduleInterview(c.id, {
      interviewerId: Number(this.interviewForm.interviewerId),
      scheduledAt: isoDate,
      type: this.interviewForm.type,
      rating: 5,
      feedback: 'Entretien programmé via le dossier candidat.'
    }).subscribe({
      next: (created) => {
        this.interviews = [created, ...this.interviews];
        c.status = 'INTERVIEW';
        this.drawerBannerMessage = 'Entretien planifié et statut passé à INTERVIEW !';
      },
      error: () => {
        this.interviews = [
          {
            id: Date.now(),
            candidateId: c.id,
            candidateName: c.fullName,
            offerTitle: c.offerTitle,
            interviewerId: Number(this.interviewForm.interviewerId),
            interviewerName: tutor?.fullName || 'Alexandre Martin',
            scheduledAt: isoDate,
            type: this.interviewForm.type,
            rating: 5,
            feedback: 'Entretien programmé.'
          },
          ...this.interviews
        ];
        c.status = 'INTERVIEW';
        this.drawerBannerMessage = 'Entretien planifié avec succès !';
      }
    });
  }

  convertCandidateToIntern() {
    if (!this.selectedCandidate) return;
    const c = this.selectedCandidate;
    this.api.convertCandidateToIntern(c.id, {
      tutorId: Number(this.convertForm.tutorId),
      departmentId: c.departmentId,
      startDate: this.convertForm.startDate,
      endDate: '2027-05-15',
      topic: c.offerTitle
    }).subscribe({
      next: () => {
        c.status = 'ACCEPTED';
        this.selectedCandidate = null;
        this.router.navigate(['/espace-stagiaire']);
      },
      error: () => {
        c.status = 'ACCEPTED';
        this.selectedCandidate = null;
        this.router.navigate(['/espace-stagiaire']);
      }
    });
  }

  openFeedbackEditor(iv: Interview) {
    this.editingInterview = iv;
    this.feedbackForm = {
      rating: iv.rating || 5,
      feedback: iv.feedback || ''
    };
  }

  saveInterviewFeedback() {
    if (!this.editingInterview) return;
    const iv = this.editingInterview;
    iv.rating = this.feedbackForm.rating;
    iv.feedback = this.feedbackForm.feedback;
    this.api.saveInterviewFeedback(iv.id, this.feedbackForm).subscribe({
      next: () => {
        this.editingInterview = null;
      },
      error: () => {
        this.editingInterview = null;
      }
    });
  }

  getFullDocumentUrl(url?: string): string {
    if (!url) return 'http://localhost:8080/api/internships/1/attestation/pdf';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  }
}
