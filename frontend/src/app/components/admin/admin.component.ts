import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Department, RoleName, UserProfile } from '../../models/types';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Top Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Administration Système &amp; Référentiels</h1>
          <p class="text-xs sm:text-sm text-slate-500">Gérez les comptes utilisateurs, attribuez les rôles RBAC et configurez les départements de l'entreprise</p>
        </div>

        <div class="flex gap-2">
          <button
            (click)="showDeptModal = true"
            class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition">
            + Nouveau Département
          </button>
          <button
            (click)="showUserModal = true"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition">
            + Créer un Utilisateur
          </button>
        </div>
      </div>

      <!-- Départements de l'Entreprise -->
      <div class="mb-8">
        <h2 class="text-base font-extrabold text-slate-900 mb-3">🏢 Départements &amp; Unités d'Accueil ({{ departments.length }})</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (d of departments; track d.id) {
            <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 class="text-sm font-black text-slate-900 mb-1">{{ d.name }}</h3>
                <p class="text-xs text-slate-500 mb-4">{{ d.description }}</p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] font-bold">
                <span class="text-indigo-600">📋 {{ d.offersCount ?? 1 }} offre(s)</span>
                <span class="text-emerald-600">🎓 {{ d.internshipsCount ?? 1 }} stagiaire(s)</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Gestion des Utilisateurs & Rôles -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h2 class="text-lg font-extrabold text-slate-900">👥 Annuaire des Utilisateurs &amp; Contrôle des Rôles (RBAC)</h2>
            <p class="text-xs text-slate-500">Modifiez le rôle d'un collaborateur ou activez/désactivez son accès à la plateforme</p>
          </div>
          <div class="flex items-center gap-2">
            <input
              [(ngModel)]="userSearch"
              placeholder="🔍 Rechercher un utilisateur..."
              class="px-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500">
            <select [(ngModel)]="roleFilter" class="px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white font-semibold">
              <option value="">Tous les rôles ({{ users.length }})</option>
              <option value="ADMIN">ADMIN</option>
              <option value="HR">HR (Ressources Humaines)</option>
              <option value="RECRUITER">RECRUITER (Recruteur)</option>
              <option value="TUTOR">TUTOR (Encadrant)</option>
              <option value="INTERN">INTERN (Stagiaire)</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400">
                <th class="py-3 px-3">Utilisateur</th>
                <th class="py-3 px-3">École / Poste</th>
                <th class="py-3 px-3">Rôle Actuel</th>
                <th class="py-3 px-3">Changer le Rôle</th>
                <th class="py-3 px-3">Statut Compte</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs">
              @for (u of filteredUsers; track u.id) {
                <tr class="hover:bg-slate-50/80 transition">
                  <td class="py-3.5 px-3">
                    <p class="font-bold text-slate-900">{{ u.fullName }}</p>
                    <p class="text-[11px] text-slate-500">{{ u.email }}</p>
                  </td>
                  <td class="py-3.5 px-3 text-slate-600">
                    <span class="font-semibold">{{ u.fieldOfStudy || '-' }}</span>
                    @if (u.school) {
                      <span class="block text-[10px] text-slate-400">{{ u.school }}</span>
                    }
                  </td>
                  <td class="py-3.5 px-3">
                    @for (r of u.roles; track r) {
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mr-1">
                        {{ r }}
                      </span>
                    }
                  </td>
                  <td class="py-3.5 px-3">
                    <select
                      [ngModel]="u.roles[0]"
                      (ngModelChange)="changeUserRole(u, $event)"
                      class="px-2.5 py-1 border border-slate-200 rounded-lg text-xs bg-white font-semibold">
                      @for (rn of allRoles; track rn) {
                        <option [value]="rn">{{ rn }}</option>
                      }
                    </select>
                  </td>
                  <td class="py-3.5 px-3">
                    <button
                      (click)="toggleUserActive(u)"
                      class="px-3 py-1 rounded-full text-[11px] font-bold border transition"
                      [ngClass]="u.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'">
                      {{ u.active ? '✓ Actif' : '✕ Désactivé' }}
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL : CRÉER UN UTILISATEUR -->
      @if (showUserModal) {
        <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 class="text-lg font-black text-slate-900 mb-4">Créer un Compte Utilisateur</h3>
            <form (ngSubmit)="createUser()" class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Nom complet *</label>
                <input [(ngModel)]="userForm.fullName" name="fullName" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Email professionnel *</label>
                <input [(ngModel)]="userForm.email" name="email" type="email" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm">
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Rôle RBAC *</label>
                  <select [(ngModel)]="userForm.role" name="role" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white">
                    @for (rn of allRoles; track rn) {
                      <option [value]="rn">{{ rn }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Mot de passe initial</label>
                  <input [(ngModel)]="userForm.password" name="password" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">École / Université</label>
                  <input [(ngModel)]="userForm.school" name="school" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Poste / Spécialité</label>
                  <input [(ngModel)]="userForm.fieldOfStudy" name="fieldOfStudy" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm">
                </div>
              </div>
              <div class="flex justify-end gap-2 pt-3">
                <button type="button" (click)="showUserModal = false" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Annuler</button>
                <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">Créer le compte</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- MODAL : CRÉER UN DÉPARTEMENT -->
      @if (showDeptModal) {
        <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 class="text-lg font-black text-slate-900 mb-4">Créer un Département</h3>
            <form (ngSubmit)="createDepartment()" class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Nom du département *</label>
                <input [(ngModel)]="deptForm.name" name="name" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm" placeholder="Ex: Cybersécurité & Cloud">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea [(ngModel)]="deptForm.description" name="description" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"></textarea>
              </div>
              <div class="flex justify-end gap-2 pt-2">
                <button type="button" (click)="showDeptModal = false" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Annuler</button>
                <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class AdminComponent implements OnInit {
  allRoles: RoleName[] = ['ADMIN', 'HR', 'RECRUITER', 'TUTOR', 'INTERN'];

  departments: Department[] = [
    { id: 1, name: 'Ingénierie & Tech', description: 'Équipe R&D, Cloud, DevOps et Architecture Plateforme', offersCount: 2, internshipsCount: 1 },
    { id: 2, name: 'Produit & Design', description: 'Design UI/UX, Recherche Utilisateur et Product Management', offersCount: 1, internshipsCount: 1 },
    { id: 3, name: 'Marketing & Com', description: 'Growth Marketing, Marque Employeur et Relations Écoles', offersCount: 1, internshipsCount: 0 },
    { id: 4, name: 'Data & IA', description: 'Data Science, Machine Learning et Intelligence Artificielle', offersCount: 1, internshipsCount: 0 }
  ];

  users: UserProfile[] = [
    { id: 1, email: 'admin@gestagy.com', fullName: 'Admin GeStagy', school: 'Polytechnique', fieldOfStudy: 'Direction SI', active: true, roles: ['ADMIN'] },
    { id: 2, email: 'rh@gestagy.com', fullName: 'Sarah Benali', school: 'ESCP', fieldOfStudy: 'Responsable Talents & Campus', active: true, roles: ['HR'] },
    { id: 3, email: 'recruteur@gestagy.com', fullName: 'Youssef Amrani', school: 'HEC', fieldOfStudy: 'Talent Acquisition Specialist', active: true, roles: ['RECRUITER'] },
    { id: 4, email: 'tuteur@gestagy.com', fullName: 'Alexandre Martin', school: 'INSA', fieldOfStudy: 'Principal Tech Lead FullStack', active: true, roles: ['TUTOR'] },
    { id: 5, email: 'nadia.tuteur@gestagy.com', fullName: 'Nadia Berrada', school: 'Strate Design', fieldOfStudy: 'Lead Product Designer', active: true, roles: ['TUTOR'] },
    { id: 6, email: 'stagiaire@gestagy.com', fullName: 'Mehdi Mansouri', school: 'Faculté des Sciences', fieldOfStudy: 'Master 2 Ingénierie Logicielle (M2I)', active: true, roles: ['INTERN'] },
    { id: 7, email: 'lina@gestagy.com', fullName: 'Lina Tazi', school: 'École Supérieure de Design', fieldOfStudy: 'Master UX & Digital Product Design', active: true, roles: ['INTERN'] }
  ];

  userSearch = '';
  roleFilter = '';

  showUserModal = false;
  showDeptModal = false;

  userForm = {
    fullName: '',
    email: '',
    password: 'password123',
    role: 'TUTOR' as RoleName,
    school: '',
    fieldOfStudy: ''
  };

  deptForm = {
    name: '',
    description: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getAllUsers().subscribe({
      next: (list) => {
        if (list && list.length > 0) this.users = list;
      },
      error: () => {}
    });
    this.api.getAdminDepartments().subscribe({
      next: (list) => {
        if (list && list.length > 0) this.departments = list;
      },
      error: () => {}
    });
  }

  get filteredUsers(): UserProfile[] {
    return this.users.filter(u => {
      const q = this.userSearch.trim().toLowerCase();
      const matchQ = !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole = !this.roleFilter || u.roles.includes(this.roleFilter);
      return matchQ && matchRole;
    });
  }

  changeUserRole(u: UserProfile, newRole: RoleName) {
    u.roles = [newRole];
    this.api.updateUser(u.id, { roles: [newRole], active: u.active }).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  toggleUserActive(u: UserProfile) {
    u.active = !u.active;
    this.api.updateUser(u.id, { roles: u.roles, active: u.active }).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  createUser() {
    if (!this.userForm.email.trim() || !this.userForm.fullName.trim()) return;
    this.api.createUser({
      fullName: this.userForm.fullName,
      email: this.userForm.email,
      password: this.userForm.password,
      roles: [this.userForm.role],
      school: this.userForm.school,
      fieldOfStudy: this.userForm.fieldOfStudy,
      active: true
    }).subscribe({
      next: (created) => {
        this.users = [created, ...this.users];
        this.showUserModal = false;
      },
      error: () => {
        this.users = [
          {
            id: Date.now(),
            fullName: this.userForm.fullName,
            email: this.userForm.email,
            school: this.userForm.school,
            fieldOfStudy: this.userForm.fieldOfStudy,
            roles: [this.userForm.role],
            active: true
          },
          ...this.users
        ];
        this.showUserModal = false;
      }
    });
  }

  createDepartment() {
    if (!this.deptForm.name.trim()) return;
    this.api.createDepartment(this.deptForm).subscribe({
      next: (created) => {
        this.departments = [...this.departments, created];
        this.showDeptModal = false;
        this.deptForm = { name: '', description: '' };
      },
      error: () => {
        this.departments = [
          ...this.departments,
          { id: Date.now(), name: this.deptForm.name, description: this.deptForm.description, offersCount: 0, internshipsCount: 0 }
        ];
        this.showDeptModal = false;
        this.deptForm = { name: '', description: '' };
      }
    });
  }
}

