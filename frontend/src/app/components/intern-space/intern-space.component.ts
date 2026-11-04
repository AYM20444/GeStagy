import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { DocumentItem, DocumentType, Evaluation, EvaluationType, Internship, Task, TaskStatus } from '../../models/types';

@Component({
  selector: 'app-intern-space',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Switcher de Stagiaire (pour Tuteur, RH et Admin) -->
      @if (internships.length > 1) {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span>👨‍🏫 Dossiers de Stage suivis ({{ internships.length }}) :</span>
          </div>
          <div class="flex flex-wrap gap-2">
            @for (item of internships; track item.id) {
              <button
                (click)="selectInternship(item)"
                class="px-3.5 py-1.5 rounded-xl text-xs font-bold border transition"
                [ngClass]="currentInternship?.id === item.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'">
                🎓 {{ item.internName }} ({{ item.departmentName }})
              </button>
            }
          </div>
        </div>
      }

      <!-- Bannière Principale du Stage -->
      @if (currentInternship) {
        <div class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs mb-8">
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div class="flex items-start sm:items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
                {{ currentInternship.internName.charAt(0) }}
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <h1 class="text-xl font-black text-slate-900">{{ currentInternship.internName }}</h1>
                  <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {{ currentInternship.status }}
                  </span>
                  <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {{ currentInternship.internSchool }}
                  </span>
                </div>
                <p class="text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                  📌 Sujet : {{ currentInternship.topic }}
                </p>
                <div class="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>👨‍🏫 Encadrant : <strong class="text-indigo-600">{{ currentInternship.tutorName }}</strong></span>
                  <span>🏢 Département : <strong>{{ currentInternship.departmentName }}</strong></span>
                  <span>📅 Période : <strong>{{ currentInternship.startDate }} → {{ currentInternship.endDate }}</strong></span>
                </div>
              </div>
            </div>

            <!-- Boutons d'Action Rapide : Convention & Attestation PDF -->
            <div class="flex flex-wrap gap-2.5">
              <button
                (click)="activeTab = 'DOCUMENTS'"
                class="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5">
                📄 Documents &amp; Convention ({{ documents.length }})
              </button>
              <button
                (click)="downloadAttestationPdf()"
                class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5">
                🏆 Générer Attestation PDF
              </button>
            </div>
          </div>

          <!-- Barre de Progression Globale -->
          <div class="mt-6 pt-5 border-t border-slate-100">
            <div class="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Progression des livrables &amp; objectifs du stage</span>
              <span class="text-indigo-600">{{ progressPercent }}% complété ({{ getTasksByStatus('DONE').length }}/{{ tasks.length }} tâches)</span>
            </div>
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-indigo-600 to-emerald-500 h-2.5 rounded-full transition-all" [style.width.%]="progressPercent"></div>
            </div>
          </div>
        </div>
      }

      <!-- Navigation par Onglets : Tâches | Évaluations | Documents -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <button
            (click)="activeTab = 'TASKS'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition"
            [ngClass]="activeTab === 'TASKS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'">
            ✅ Feuille de Route &amp; Tâches ({{ tasks.length }})
          </button>
          <button
            (click)="activeTab = 'EVALUATIONS'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition"
            [ngClass]="activeTab === 'EVALUATIONS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'">
            ⭐ Évaluations &amp; PDF ({{ evaluations.length }})
          </button>
          <button
            (click)="activeTab = 'DOCUMENTS'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition"
            [ngClass]="activeTab === 'DOCUMENTS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'">
            📂 Documents &amp; Signatures ({{ documents.length }})
          </button>
        </div>

        @if (activeTab === 'TASKS') {
          <button
            (click)="showTaskModal = true"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition">
            + Assigner une Nouvelle Tâche
          </button>
        }
        @if (activeTab === 'EVALUATIONS') {
          <button
            (click)="showEvaluationModal = true"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition">
            + Réaliser une Évaluation
          </button>
        }
        @if (activeTab === 'DOCUMENTS') {
          <button
            (click)="showDocumentModal = true"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition">
            + Téléverser un Document
          </button>
        }
      </div>

      <!-- ONGLET 1 : KANBAN DES TÂCHES DU STAGIAIRE -->
      @if (activeTab === 'TASKS') {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <!-- Colonne TODO -->
          <div class="bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 min-h-[380px]">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                À Réaliser (TODO)
              </h3>
              <span class="text-xs font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200">{{ getTasksByStatus('TODO').length }}</span>
            </div>
            <div class="space-y-3">
              @for (t of getTasksByStatus('TODO'); track t.id) {
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div class="flex justify-between items-start gap-2 mb-1">
                    <h4 class="text-xs font-extrabold text-slate-900">{{ t.title }}</h4>
                    <span class="text-[10px] text-slate-400 whitespace-nowrap">📅 {{ t.dueDate }}</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mb-3 leading-relaxed">{{ t.description }}</p>
                  <div class="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span class="text-[10px] text-slate-400">Par {{ t.assignedByName }}</span>
                    <button
                      (click)="changeTaskStatus(t, 'IN_PROGRESS')"
                      class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-bold transition">
                      Démarrer →
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Colonne IN_PROGRESS -->
          <div class="bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 min-h-[380px]">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                En Cours (IN_PROGRESS)
              </h3>
              <span class="text-xs font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200">{{ getTasksByStatus('IN_PROGRESS').length }}</span>
            </div>
            <div class="space-y-3">
              @for (t of getTasksByStatus('IN_PROGRESS'); track t.id) {
                <div class="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
                  <div class="flex justify-between items-start gap-2 mb-1">
                    <h4 class="text-xs font-extrabold text-slate-900">{{ t.title }}</h4>
                    <span class="text-[10px] text-amber-700 font-semibold whitespace-nowrap">⏳ {{ t.dueDate }}</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mb-3 leading-relaxed">{{ t.description }}</p>
                  <div class="flex justify-between items-center pt-2 border-t border-slate-100">
                    <button
                      (click)="changeTaskStatus(t, 'TODO')"
                      class="text-[10px] text-slate-400 hover:text-slate-600 font-semibold">
                      ← À faire
                    </button>
                    <button
                      (click)="changeTaskStatus(t, 'DONE')"
                      class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold transition">
                      Valider Terminé ✓
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Colonne DONE -->
          <div class="bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 min-h-[380px]">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Terminé &amp; Validé (DONE)
              </h3>
              <span class="text-xs font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200">{{ getTasksByStatus('DONE').length }}</span>
            </div>
            <div class="space-y-3">
              @for (t of getTasksByStatus('DONE'); track t.id) {
                <div class="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
                  <div class="flex justify-between items-start gap-2 mb-1">
                    <h4 class="text-xs font-bold text-slate-500 line-through">{{ t.title }}</h4>
                    <span class="text-[10px] font-bold text-emerald-600">✓ DONE</span>
                  </div>
                  <p class="text-[11px] text-slate-400 mb-2">{{ t.description }}</p>
                  <div class="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span class="text-[10px] text-emerald-600 font-semibold">Validé par {{ t.assignedByName }}</span>
                    <button
                      (click)="changeTaskStatus(t, 'IN_PROGRESS')"
                      class="text-[10px] text-slate-400 hover:text-slate-600">
                      Rouvrir
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

        </div>
      }

      <!-- ONGLET 2 : ÉVALUATIONS DE STAGE & EXPORT PDF -->
      @if (activeTab === 'EVALUATIONS') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (ev of evaluations; track ev.id) {
            <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <span
                      class="px-2.5 py-1 rounded-lg text-xs font-extrabold"
                      [ngClass]="ev.type === 'FINAL' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'">
                      {{ ev.type === 'FINAL' ? '🏆 ÉVALUATION FINALE' : '📊 ÉVALUATION MI-PARCOURS' }}
                    </span>
                    <p class="text-xs text-slate-500 mt-1.5">Évaluateur : <strong>{{ ev.evaluatorName }}</strong></p>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-bold text-slate-400 uppercase block">Score Global</span>
                    <span class="text-2xl font-black text-indigo-600">{{ ev.averageScore }}/20</span>
                  </div>
                </div>

                <!-- Barres de compétences détaillées -->
                <div class="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 mb-4">
                  <div>
                    <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Compétences Techniques</span>
                      <span>{{ ev.technicalScore }}/20</span>
                    </div>
                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div class="bg-indigo-600 h-2 rounded-full" [style.width.%]="(ev.technicalScore / 20) * 100"></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Soft Skills &amp; Communication</span>
                      <span>{{ ev.softSkillsScore }}/20</span>
                    </div>
                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div class="bg-emerald-500 h-2 rounded-full" [style.width.%]="(ev.softSkillsScore / 20) * 100"></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Autonomie &amp; Initiative</span>
                      <span>{{ ev.autonomyScore }}/20</span>
                    </div>
                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div class="bg-amber-500 h-2 rounded-full" [style.width.%]="(ev.autonomyScore / 20) * 100"></div>
                    </div>
                  </div>
                </div>

                <h4 class="text-xs font-bold uppercase text-slate-400 mb-1">Appréciation de l'encadrant</h4>
                <p class="text-xs sm:text-sm text-slate-700 italic bg-slate-50/70 p-3 rounded-xl border border-slate-100 mb-4">
                  "{{ ev.comments }}"
                </p>
              </div>

              <button
                (click)="downloadEvaluationPdf(ev)"
                class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
                📥 Exporter la Fiche d'Évaluation en PDF
              </button>
            </div>
          }
        </div>
      }

      <!-- ONGLET 3 : DOCUMENTS, CONVENTIONS & SIGNATURES -->
      @if (activeTab === 'DOCUMENTS') {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
            <div>
              <h3 class="text-base font-extrabold text-slate-900">Gestion Documentaire &amp; Suivi des Signatures</h3>
              <p class="text-xs text-slate-500">Conventions de stage, rapports d'avancement et attestations officielles</p>
            </div>
            <button
              (click)="downloadAttestationPdf()"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition">
              🏆 Télécharger Attestation Officielle PDF
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (doc of documents; track doc.id) {
              <div class="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between bg-slate-50/40 hover:border-indigo-200 transition">
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 text-indigo-700">
                      {{ doc.type }}
                    </span>
                    <span
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                      [ngClass]="doc.signed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'">
                      {{ doc.signed ? '✓ Signé & Validé' : '⏳ Signature en attente' }}
                    </span>
                  </div>

                  <h4 class="text-xs font-extrabold text-slate-900 mb-1 break-all">📄 {{ doc.fileName }}</h4>
                  <p class="text-[11px] text-slate-500 mb-4">Déposé par {{ doc.uploadedByName }}</p>
                </div>

                <div class="flex items-center justify-between gap-2 pt-3 border-t border-slate-200/70">
                  <button
                    (click)="toggleSignature(doc)"
                    class="px-3 py-1.5 rounded-xl text-[11px] font-bold border transition"
                    [ngClass]="doc.signed
                      ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                      : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'">
                    {{ doc.signed ? 'Révoquer signature' : '✍️ Signer électroniquement' }}
                  </button>

                  <button
                    (click)="downloadAttestationPdf()"
                    class="px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl text-[11px] font-bold transition">
                    PDF ↗
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- MODAL : CRÉER / ASSIGNER UNE TÂCHE -->
      @if (showTaskModal) {
        <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 class="text-lg font-black text-slate-900 mb-1">Assigner une Nouvelle Tâche</h3>
            <p class="text-xs text-slate-500 mb-4">Pour {{ currentInternship?.internName }}</p>

            <form (ngSubmit)="createNewTask()" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Titre de la tâche *</label>
                <input [(ngModel)]="taskForm.title" name="title" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm" placeholder="Ex: Implémenter les tests unitaires JUnit">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Date d'échéance</label>
                <input [(ngModel)]="taskForm.dueDate" name="dueDate" type="date" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Description / Livrable attendu</label>
                <textarea [(ngModel)]="taskForm.description" name="description" rows="3" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"></textarea>
              </div>
              <div class="flex justify-end gap-2 pt-2">
                <button type="button" (click)="showTaskModal = false" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Annuler</button>
                <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">Assigner</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- MODAL : RÉALISER UNE ÉVALUATION (AVEC CALCUL AUTOMATIQUE DU SCORE GLOBAL) -->
      @if (showEvaluationModal) {
        <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="text-lg font-black text-slate-900">Grille d'Évaluation Stagiaire</h3>
                <p class="text-xs text-slate-500">Stagiaire : {{ currentInternship?.internName }}</p>
              </div>
              <div class="text-right bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
                <span class="text-[10px] font-bold uppercase text-indigo-500 block">Moyenne Calculée</span>
                <span class="text-lg font-black text-indigo-700">{{ computedEvaluationAverage }}/20</span>
              </div>
            </div>

            <form (ngSubmit)="submitEvaluation()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Type d'évaluation</label>
                <select [(ngModel)]="evalForm.type" name="type" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white">
                  <option value="MID_TERM">Évaluation Intermédiaire (Mi-Parcours)</option>
                  <option value="FINAL">Évaluation Finale (Fin de Stage)</option>
                </select>
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>1. Compétences Techniques &amp; Qualité du Code</span>
                  <span class="text-indigo-600">{{ evalForm.technicalScore }} / 20</span>
                </div>
                <input type="range" min="0" max="20" step="0.5" [(ngModel)]="evalForm.technicalScore" name="technicalScore" class="w-full accent-indigo-600">
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>2. Soft Skills, Communication &amp; Intégration</span>
                  <span class="text-emerald-600">{{ evalForm.softSkillsScore }} / 20</span>
                </div>
                <input type="range" min="0" max="20" step="0.5" [(ngModel)]="evalForm.softSkillsScore" name="softSkillsScore" class="w-full accent-emerald-600">
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>3. Autonomie, Rigueur &amp; Respect des Délais</span>
                  <span class="text-amber-600">{{ evalForm.autonomyScore }} / 20</span>
                </div>
                <input type="range" min="0" max="20" step="0.5" [(ngModel)]="evalForm.autonomyScore" name="autonomyScore" class="w-full accent-amber-500">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Appréciation générale &amp; axes de progression *</label>
                <textarea [(ngModel)]="evalForm.comments" name="comments" rows="3" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"></textarea>
              </div>

              <div class="flex justify-end gap-2 pt-2">
                <button type="button" (click)="showEvaluationModal = false" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Annuler</button>
                <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md">
                  Enregistrer l'évaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- MODAL : TÉLÉVERSER UN DOCUMENT -->
      @if (showDocumentModal) {
        <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 class="text-lg font-black text-slate-900 mb-1">Ajouter un Document de Stage</h3>
            <p class="text-xs text-slate-500 mb-4">Convention, Rapport de stage ou Attestation</p>

            <form (ngSubmit)="submitDocument()" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Type de document</label>
                <select [(ngModel)]="docForm.type" name="type" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white">
                  <option value="CONVENTION">CONVENTION (Convention de stage)</option>
                  <option value="REPORT">REPORT (Rapport / Livrable)</option>
                  <option value="ATTESTATION">ATTESTATION (Attestation de fin de stage)</option>
                  <option value="OTHER">OTHER (Autre document administratif)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Nom du fichier *</label>
                <input [(ngModel)]="docForm.fileName" name="fileName" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm" placeholder="Ex: Rapport_Final_PFE_2026.pdf">
              </div>
              <div class="border border-dashed border-indigo-300 rounded-xl p-3 bg-indigo-50/40">
                <label class="block text-xs font-bold text-indigo-900 mb-1">Sélectionner un fichier PDF</label>
                <input type="file" accept=".pdf,.doc,.docx" (change)="onDocFileSelected($event)" class="text-xs text-slate-600 w-full">
              </div>
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" [(ngModel)]="docForm.signed" name="signed" class="accent-indigo-600">
                Marquer directement comme signé
              </label>
              <div class="flex justify-end gap-2 pt-2">
                <button type="button" (click)="showDocumentModal = false" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Annuler</button>
                <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">Téléverser</button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class InternSpaceComponent implements OnInit {
  activeTab: 'TASKS' | 'EVALUATIONS' | 'DOCUMENTS' = 'TASKS';

  internships: Internship[] = [
    {
      id: 1,
      internId: 6,
      internName: 'Mehdi Mansouri',
      internEmail: 'stagiaire@gestagy.com',
      internSchool: 'Faculté des Sciences (M2I)',
      tutorId: 4,
      tutorName: 'Alexandre Martin',
      departmentId: 1,
      departmentName: 'Ingénierie & Tech',
      startDate: '2026-09-04',
      endDate: '2027-03-04',
      topic: 'Développement de la plateforme FullStack GeStagy avec Angular 22 et Spring Boot 3',
      status: 'ONGOING',
      tasksCount: 4,
      doneTasksCount: 2,
      progressPercent: 50
    },
    {
      id: 2,
      internId: 7,
      internName: 'Lina Tazi',
      internEmail: 'lina@gestagy.com',
      internSchool: 'École Supérieure de Design',
      tutorId: 5,
      tutorName: 'Nadia Berrada',
      departmentId: 2,
      departmentName: 'Produit & Design',
      startDate: '2026-10-01',
      endDate: '2027-02-01',
      topic: 'Refonte complète de l’expérience utilisateur et du Design System GeStagy',
      status: 'ONGOING',
      tasksCount: 2,
      doneTasksCount: 1,
      progressPercent: 50
    }
  ];

  currentInternship: Internship | null = this.internships[0];

  tasks: Task[] = [];
  evaluations: Evaluation[] = [];
  documents: DocumentItem[] = [];

  showTaskModal = false;
  showEvaluationModal = false;
  showDocumentModal = false;

  taskForm = {
    title: '',
    description: '',
    dueDate: '2026-11-25'
  };

  evalForm = {
    type: 'MID_TERM' as EvaluationType,
    technicalScore: 17.5,
    softSkillsScore: 18.0,
    autonomyScore: 17.0,
    comments: 'Très bonne implication technique et excellente autonomie sur les livrables.'
  };

  docForm = {
    type: 'REPORT' as DocumentType,
    fileName: 'Rapport_Avancement_Stage.pdf',
    fileUrl: '',
    signed: true
  };

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.getMyInternships().subscribe({
      next: (list) => {
        if (list && list.length > 0) {
          this.internships = list;
          this.selectInternship(list[0]);
        } else {
          this.loadFallbackInternshipDetails(1);
        }
      },
      error: () => {
        this.loadFallbackInternshipDetails(1);
      }
    });
  }

  selectInternship(item: Internship) {
    this.currentInternship = item;
    const id = item.id;

    this.api.getInternshipTasks(id).subscribe({
      next: (t) => this.tasks = t,
      error: () => this.loadFallbackInternshipDetails(id)
    });

    this.api.getEvaluations(id).subscribe({
      next: (e) => this.evaluations = e,
      error: () => {}
    });

    this.api.getDocuments(id).subscribe({
      next: (d) => this.documents = d,
      error: () => {}
    });
  }

  private loadFallbackInternshipDetails(id: number) {
    this.tasks = [
      { id: 1, internshipId: id, title: 'Mise en place de l’environnement et base de données', description: 'Configurer Spring Boot, la persistance JPA et valider le build Maven.', dueDate: '2026-11-10', status: 'DONE', assignedByName: 'Alexandre Martin' },
      { id: 2, internshipId: id, title: 'Implémentation de l’authentification JWT & RBAC', description: 'Sécuriser les endpoints REST par rôle (ADMIN, HR, RECRUITER, TUTOR, INTERN).', dueDate: '2026-11-15', status: 'DONE', assignedByName: 'Alexandre Martin' },
      { id: 3, internshipId: id, title: 'Développement du Pipeline Kanban Drag & Drop', description: 'Permettre le déplacement temps réel des candidats sur 5 colonnes.', dueDate: '2026-11-22', status: 'IN_PROGRESS', assignedByName: 'Alexandre Martin' },
      { id: 4, internshipId: id, title: 'Module d’Évaluation & Génération PDF Officielle', description: 'Générer dynamiquement les attestations de stage et fiches d’évaluation en PDF.', dueDate: '2026-11-30', status: 'TODO', assignedByName: 'Alexandre Martin' }
    ];
    this.evaluations = [
      {
        id: 1,
        internshipId: id,
        internName: this.currentInternship?.internName || 'Mehdi Mansouri',
        evaluatorName: 'Alexandre Martin',
        type: 'MID_TERM',
        technicalScore: 18.0,
        softSkillsScore: 17.5,
        autonomyScore: 17.0,
        averageScore: 17.5,
        comments: 'Excellente progression technique sur Spring Boot et Angular. Mehdi est autonome, rigoureux et force de proposition.',
        createdAt: '2026-11-01T10:00:00'
      }
    ];
    this.documents = [
      {
        id: 1,
        internshipId: id,
        type: 'CONVENTION',
        fileName: 'Convention_Tripartite_Mehdi_Mansouri.pdf',
        fileUrl: `/api/internships/${id}/attestation/pdf`,
        uploadedByName: 'Sarah Benali (RH)',
        signed: true,
        createdAt: '2026-09-04T09:00:00'
      },
      {
        id: 2,
        internshipId: id,
        type: 'REPORT',
        fileName: 'Rapport_Avancement_Mi_Parcours_M2I.pdf',
        fileUrl: `/api/internships/${id}/attestation/pdf`,
        uploadedByName: 'Mehdi Mansouri',
        signed: true,
        createdAt: '2026-11-01T14:00:00'
      }
    ];
  }

  get progressPercent(): number {
    if (!this.tasks.length) return 0;
    const done = this.tasks.filter(t => t.status === 'DONE').length;
    return Math.round((done / this.tasks.length) * 100);
  }

  get computedEvaluationAverage(): number {
    const avg = (Number(this.evalForm.technicalScore) + Number(this.evalForm.softSkillsScore) + Number(this.evalForm.autonomyScore)) / 3;
    return Math.round(avg * 10) / 10;
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(t => t.status === status);
  }

  changeTaskStatus(task: Task, newStatus: TaskStatus) {
    task.status = newStatus;
    this.api.updateTaskStatus(task.id, newStatus).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  createNewTask() {
    if (!this.currentInternship || !this.taskForm.title.trim()) return;
    const internshipId = this.currentInternship.id;
    this.api.createTask(internshipId, {
      title: this.taskForm.title,
      description: this.taskForm.description,
      dueDate: this.taskForm.dueDate,
      status: 'TODO'
    }).subscribe({
      next: (created) => {
        this.tasks = [...this.tasks, created];
        this.showTaskModal = false;
        this.taskForm = { title: '', description: '', dueDate: '2026-11-25' };
      },
      error: () => {
        this.tasks = [
          ...this.tasks,
          {
            id: Date.now(),
            internshipId,
            title: this.taskForm.title,
            description: this.taskForm.description,
            dueDate: this.taskForm.dueDate,
            status: 'TODO',
            assignedByName: this.auth.currentUser()?.fullName || 'Alexandre Martin'
          }
        ];
        this.showTaskModal = false;
        this.taskForm = { title: '', description: '', dueDate: '2026-11-25' };
      }
    });
  }

  submitEvaluation() {
    if (!this.currentInternship) return;
    const internshipId = this.currentInternship.id;
    this.api.createEvaluation(internshipId, this.evalForm).subscribe({
      next: (created) => {
        this.evaluations = [created, ...this.evaluations];
        this.showEvaluationModal = false;
      },
      error: () => {
        this.evaluations = [
          {
            id: Date.now(),
            internshipId,
            internName: this.currentInternship?.internName,
            evaluatorName: this.auth.currentUser()?.fullName || 'Alexandre Martin',
            type: this.evalForm.type,
            technicalScore: this.evalForm.technicalScore,
            softSkillsScore: this.evalForm.softSkillsScore,
            autonomyScore: this.evalForm.autonomyScore,
            averageScore: this.computedEvaluationAverage,
            comments: this.evalForm.comments,
            createdAt: new Date().toISOString()
          },
          ...this.evaluations
        ];
        this.showEvaluationModal = false;
      }
    });
  }

  onDocFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.docForm.fileName = file.name;
    this.api.uploadFile(file).subscribe({
      next: (res) => {
        this.docForm.fileUrl = res.fileUrl;
      },
      error: () => {
        this.docForm.fileUrl = `/api/files/${file.name}`;
      }
    });
  }

  submitDocument() {
    if (!this.currentInternship || !this.docForm.fileName.trim()) return;
    const internshipId = this.currentInternship.id;
    this.api.addDocument(internshipId, this.docForm).subscribe({
      next: (created) => {
        this.documents = [created, ...this.documents];
        this.showDocumentModal = false;
      },
      error: () => {
        this.documents = [
          {
            id: Date.now(),
            internshipId,
            type: this.docForm.type,
            fileName: this.docForm.fileName,
            fileUrl: this.docForm.fileUrl || `/api/internships/${internshipId}/attestation/pdf`,
            uploadedByName: this.auth.currentUser()?.fullName || 'Utilisateur GeStagy',
            signed: this.docForm.signed,
            createdAt: new Date().toISOString()
          },
          ...this.documents
        ];
        this.showDocumentModal = false;
      }
    });
  }

  toggleSignature(doc: DocumentItem) {
    this.api.toggleDocumentSignature(doc.id).subscribe({
      next: (updated) => {
        doc.signed = updated.signed;
      },
      error: () => {
        doc.signed = !doc.signed;
      }
    });
  }

  downloadAttestationPdf() {
    const id = this.currentInternship?.id || 1;
    this.api.downloadAttestationPdf(id).subscribe({
      next: (blob) => {
        this.triggerDownload(blob, `Attestation_Stage_${this.currentInternship?.internName.replace(/\s+/g, '_')}.pdf`);
      },
      error: () => {
        window.open(`http://localhost:8080/api/internships/${id}/attestation/pdf`, '_blank');
      }
    });
  }

  downloadEvaluationPdf(ev: Evaluation) {
    this.api.downloadEvaluationPdf(ev.id).subscribe({
      next: (blob) => {
        this.triggerDownload(blob, `Evaluation_${ev.type}_${this.currentInternship?.internName.replace(/\s+/g, '_')}.pdf`);
      },
      error: () => {
        window.open(`http://localhost:8080/api/internships/evaluations/${ev.id}/pdf`, '_blank');
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
