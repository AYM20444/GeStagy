import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/types';

@Component({
  selector: 'app-intern-space',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Stagiaire Banner -->
      <div class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-indigo-100">
            {{ auth.currentUser()?.fullName?.charAt(0) || 'S' }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-bold text-slate-900">{{ auth.currentUser()?.fullName || 'Mehdi Mansouri' }}</h1>
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Stage en cours</span>
            </div>
            <p class="text-xs text-slate-500">Sujet : Développement d'un système de microservices avec Angular & Spring Boot</p>
            <p class="text-xs text-indigo-600 font-medium mt-1">Encadrant : Alexandre Martin (Tech Lead)</p>
          </div>
        </div>

        <div class="flex gap-3">
          <button class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition">
            📄 Convention Signée
          </button>
          <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition">
            🏆 Télécharger Attestation
          </button>
        </div>
      </div>

      <!-- Tâches du Stagiaire -->
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Feuille de Route & Tâches</h2>
          <p class="text-xs text-slate-500">Suivi des objectifs fixés avec votre tuteur</p>
        </div>
        <span class="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
          {{ tasks.length }} tâches assignées
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- À faire -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <h3 class="text-xs font-bold uppercase text-slate-600 tracking-wider mb-3">À Réaliser (TODO)</h3>
          <div class="space-y-3">
            @for (t of getTasksByStatus('TODO'); track t.id) {
              <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <h4 class="text-xs font-bold text-slate-900 mb-1">{{ t.title }}</h4>
                <p class="text-[11px] text-slate-500 mb-2">{{ t.description }}</p>
                <button (click)="changeTaskStatus(t, 'IN_PROGRESS')" class="text-[10px] font-bold text-indigo-600 hover:text-indigo-800">
                  Démarrer la tâche →
                </button>
              </div>
            }
          </div>
        </div>

        <!-- En cours -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <h3 class="text-xs font-bold uppercase text-slate-600 tracking-wider mb-3">En Cours</h3>
          <div class="space-y-3">
            @for (t of getTasksByStatus('IN_PROGRESS'); track t.id) {
              <div class="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
                <h4 class="text-xs font-bold text-slate-900 mb-1">{{ t.title }}</h4>
                <p class="text-[11px] text-slate-500 mb-2">{{ t.description }}</p>
                <button (click)="changeTaskStatus(t, 'DONE')" class="text-[10px] font-bold text-emerald-600 hover:text-emerald-800">
                  Marquer comme terminée ✓
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Terminé -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <h3 class="text-xs font-bold uppercase text-slate-600 tracking-wider mb-3">Validé & Terminé</h3>
          <div class="space-y-3">
            @for (t of getTasksByStatus('DONE'); track t.id) {
              <div class="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
                <h4 class="text-xs font-bold text-slate-900 mb-1 line-through text-slate-400">{{ t.title }}</h4>
                <p class="text-[11px] text-slate-400 mb-1">{{ t.description }}</p>
                <span class="text-[10px] font-bold text-emerald-600">✓ Terminé avec succès</span>
              </div>
            }
          </div>
        </div>

      </div>

    </div>
  `
})
export class InternSpaceComponent implements OnInit {
  tasks: Task[] = [];

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.getInternshipTasks(1).subscribe({
      next: (data) => this.tasks = data,
      error: () => {
        this.tasks = [
          { id: 1, internshipId: 1, title: 'Mise en place de l’environnement Docker', description: 'Configurer PostgreSQL et tester les builds Maven', dueDate: '2026-11-15', status: 'DONE', assignedByName: 'Alexandre Martin' },
          { id: 2, internshipId: 1, title: 'Authentification JWT & RLS Spring', description: 'Filtre de sécurité et annotations par rôle', dueDate: '2026-11-20', status: 'DONE', assignedByName: 'Alexandre Martin' },
          { id: 3, internshipId: 1, title: 'Pipeline Kanban et Drag & Drop', description: 'Création du tableau dynamique pour les recruteurs', dueDate: '2026-11-25', status: 'IN_PROGRESS', assignedByName: 'Alexandre Martin' },
          { id: 4, internshipId: 1, title: 'Génération de l’attestation en PDF', description: 'Éditer le certificat de stage à la fin du cycle', dueDate: '2026-12-05', status: 'TODO', assignedByName: 'Alexandre Martin' }
        ];
      }
    });
  }

  getTasksByStatus(status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Task[] {
    return this.tasks.filter(t => t.status === status);
  }

  changeTaskStatus(task: Task, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') {
    task.status = newStatus;
    this.api.updateTaskStatus(task.id, newStatus).subscribe({
      next: () => {},
      error: () => console.log('Statut tâche changé localement')
    });
  }
}

