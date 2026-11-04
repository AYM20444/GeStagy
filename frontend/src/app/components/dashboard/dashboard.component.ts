import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DashboardStats } from '../../models/types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Top Title -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Tableau de bord Recrutement & RH</h1>
          <p class="text-sm text-slate-500">Vue synthétique des indicateurs clés et activités de la campagne de stage</p>
        </div>
        <div class="flex gap-2">
          <a routerLink="/kanban" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition">
            Ouvrir Pipeline Kanban
          </a>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
            📋
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Offres Ouvertes</p>
            <h3 class="text-2xl font-black text-slate-900">{{ stats?.openOffersCount ?? 5 }}</h3>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            ⚡
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nouveaux Candidats</p>
            <h3 class="text-2xl font-black text-slate-900">{{ stats?.newCandidatesCount ?? 4 }}</h3>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            🎓
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stagiaires Actifs</p>
            <h3 class="text-2xl font-black text-slate-900">{{ stats?.ongoingInternshipsCount ?? 2 }}</h3>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">
            ⭐
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Moyenne Évaluations</p>
            <h3 class="text-2xl font-black text-slate-900">{{ stats?.averageEvaluationScore ?? 17.3 }}/20</h3>
          </div>
        </div>

      </div>

      <!-- Quick Action / Status Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6">
          <h3 class="text-base font-bold text-slate-900 mb-4">Pipeline de Recrutement en cours</h3>
          
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Nouveaux dossiers (New)</span>
                <span>4 candidats</span>
              </div>
              <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div class="bg-sky-500 h-2.5 rounded-full" style="width: 35%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>En présélection RH (Screening)</span>
                <span>2 candidats</span>
              </div>
              <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div class="bg-amber-500 h-2.5 rounded-full" style="width: 20%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Entretiens techniques (Interview)</span>
                <span>2 candidats</span>
              </div>
              <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div class="bg-purple-500 h-2.5 rounded-full" style="width: 20%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Candidatures acceptées (Accepted)</span>
                <span>2 candidats</span>
              </div>
              <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-2.5 rounded-full" style="width: 25%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent activities -->
        <div class="bg-white rounded-2xl border border-slate-200/80 p-6">
          <h3 class="text-base font-bold text-slate-900 mb-4">Dernières Activités</h3>
          <ul class="space-y-3 text-xs text-slate-600">
            <li class="flex items-start gap-2">
              <span class="text-emerald-500 font-bold">•</span>
              <span>Candidature acceptée pour <strong>Nour Alami</strong></span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-indigo-500 font-bold">•</span>
              <span>Évaluation mi-parcours complétée pour <strong>Mehdi Mansouri</strong> (17.3/20)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-500 font-bold">•</span>
              <span>Nouvelle offre publiée : <strong>Stagiaire Cloud DevOps</strong></span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDashboardStats().subscribe({
      next: (res) => this.stats = res,
      error: () => console.log('Mode démo / statistiques de démonstration activées')
    });
  }
}

