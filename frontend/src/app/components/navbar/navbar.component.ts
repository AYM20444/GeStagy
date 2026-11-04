import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { NotificationItem } from '../../models/types';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">

          <!-- Logo & Brand -->
          <div class="flex items-center space-x-3 cursor-pointer" routerLink="/">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-200 text-white font-black text-xl">
              G
            </div>
            <div>
              <div class="flex items-center">
                <span class="text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">GeStagy</span>
                <span class="text-[10px] ml-1.5 px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-wider">Enterprise</span>
              </div>
              <p class="text-[10px] text-slate-400 hidden sm:block leading-none mt-0.5">InternHub &amp; Talent Pipeline</p>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center space-x-1">
            <a routerLink="/offres" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
              🎯 Portail Offres
            </a>

            @if (auth.isLoggedIn()) {
              @if (auth.hasAnyRole(['ADMIN', 'HR', 'RECRUITER', 'TUTOR'])) {
                <a routerLink="/dashboard" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
                  📊 Dashboard &amp; Offres
                </a>
                <a routerLink="/kanban" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
                  🗂️ Kanban &amp; Entretiens
                </a>
              }

              <a routerLink="/espace-stagiaire" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
                🎓 Suivi Stage &amp; Évaluations
              </a>

              @if (auth.hasAnyRole(['ADMIN', 'HR'])) {
                <a routerLink="/admin" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
                  ⚙️ Administration
                </a>
              }
            }
          </nav>

          <!-- Right Actions: Notifications, Profile & Auth -->
          <div class="flex items-center space-x-2.5">
            @if (auth.isLoggedIn()) {
              <!-- Notification Bell -->
              <div class="relative">
                <button
                  (click)="toggleNotifications()"
                  class="relative p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200/80 transition"
                  title="Notifications et Rappels">
                  🔔
                  @if (notifications.length > 0) {
                    <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {{ notifications.length }}
                    </span>
                  }
                </button>

                @if (showNotifications) {
                  <div class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50">
                    <div class="flex justify-between items-center pb-2.5 mb-2.5 border-b border-slate-100">
                      <span class="text-xs font-bold text-slate-900">Notifications &amp; Rappels ({{ notifications.length }})</span>
                      <button (click)="showNotifications = false" class="text-xs text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                    <div class="space-y-2.5 max-h-72 overflow-y-auto">
                      @for (n of notifications; track n.id) {
                        <div
                          (click)="goToNotification(n)"
                          class="p-2.5 rounded-xl border border-slate-100 hover:bg-indigo-50/50 cursor-pointer transition">
                          <div class="flex items-center justify-between mb-1">
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-md"
                              [ngClass]="{
                                'bg-amber-50 text-amber-700': n.severity === 'WARNING',
                                'bg-indigo-50 text-indigo-700': n.severity === 'INFO',
                                'bg-emerald-50 text-emerald-700': n.severity === 'SUCCESS'
                              }">
                              {{ n.category }}
                            </span>
                          </div>
                          <p class="text-xs font-bold text-slate-800">{{ n.title }}</p>
                          <p class="text-[11px] text-slate-500">{{ n.message }}</p>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- User Profile Pill -->
              <div class="flex items-center space-x-2.5 bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-200/80">
                <button
                  (click)="openProfileModal()"
                  class="flex items-center space-x-2 text-left hover:opacity-80 transition"
                  title="Modifier mon profil">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {{ auth.currentUser()?.fullName?.charAt(0) || 'U' }}
                  </div>
                  <div class="hidden sm:block">
                    <p class="text-xs font-bold text-slate-800 leading-none">{{ auth.currentUser()?.fullName }}</p>
                    <p class="text-[10px] font-semibold text-indigo-600 uppercase mt-0.5">{{ auth.currentUser()?.roles?.join(' • ') }}</p>
                  </div>
                </button>
                <button
                  (click)="logout()"
                  class="text-xs text-rose-600 hover:text-rose-700 font-bold pl-2 border-l border-slate-200">
                  Quitter
                </button>
              </div>
            } @else {
              <a routerLink="/connexion" class="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition">
                🔐 Connexion / Inscription
              </a>
            }
          </div>

        </div>

        <!-- Mobile Navigation Bar -->
        @if (auth.isLoggedIn()) {
          <div class="flex md:hidden items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 text-xs">
            <a routerLink="/offres" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-2.5 py-1 rounded-lg text-slate-600 whitespace-nowrap">Offres</a>
            @if (auth.hasAnyRole(['ADMIN', 'HR', 'RECRUITER', 'TUTOR'])) {
              <a routerLink="/dashboard" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-2.5 py-1 rounded-lg text-slate-600 whitespace-nowrap">Dashboard</a>
              <a routerLink="/kanban" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-2.5 py-1 rounded-lg text-slate-600 whitespace-nowrap">Kanban</a>
            }
            <a routerLink="/espace-stagiaire" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-2.5 py-1 rounded-lg text-slate-600 whitespace-nowrap">Stage</a>
            @if (auth.hasAnyRole(['ADMIN', 'HR'])) {
              <a routerLink="/admin" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-2.5 py-1 rounded-lg text-slate-600 whitespace-nowrap">Admin</a>
            }
          </div>
        }
      </div>
    </header>

    <!-- Modal : Gérer mon profil -->
    @if (showProfileModal) {
      <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
          <div class="flex justify-between items-center mb-5">
            <div>
              <h3 class="text-lg font-black text-slate-900">Mon Profil Utilisateur</h3>
              <p class="text-xs text-slate-500">{{ auth.currentUser()?.email }} • Rôle : {{ auth.currentUser()?.roles?.join(', ') }}</p>
            </div>
            <button (click)="showProfileModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          @if (profileSavedMessage) {
            <div class="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-semibold mb-4 border border-emerald-200">
              ✓ {{ profileSavedMessage }}
            </div>
          }

          <form (ngSubmit)="saveProfile()" class="space-y-3.5">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nom complet</label>
              <input [(ngModel)]="profileForm.fullName" name="fullName" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Téléphone</label>
                <input [(ngModel)]="profileForm.phone" name="phone" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Niveau d'études / Poste</label>
                <input [(ngModel)]="profileForm.level" name="level" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">École / Université</label>
                <input [(ngModel)]="profileForm.school" name="school" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Spécialité / Filière</label>
                <input [(ngModel)]="profileForm.fieldOfStudy" name="fieldOfStudy" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nouveau mot de passe (optionnel)</label>
              <input [(ngModel)]="profileForm.newPassword" name="newPassword" type="password" placeholder="Laisser vide pour conserver l'actuel" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500">
            </div>

            <div class="flex justify-end gap-2 pt-3">
              <button type="button" (click)="showProfileModal = false" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
                Fermer
              </button>
              <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class NavbarComponent implements OnInit {
  showNotifications = false;
  showProfileModal = false;
  profileSavedMessage = '';

  notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      title: 'Signature en attente : CONVENTION',
      message: 'La convention de stage de Lina Tazi est en attente de validation RH.',
      category: 'DOCUMENT',
      severity: 'WARNING',
      route: '/espace-stagiaire',
      createdAt: '2026-11-04T10:00:00'
    },
    {
      id: 'notif-2',
      title: 'Entretien VIDEO planifié',
      message: 'Entretien technique avec Ayoub Chraibi (FST Fès) demain à 10h30.',
      category: 'INTERVIEW',
      severity: 'INFO',
      route: '/kanban',
      createdAt: '2026-11-05T10:30:00'
    },
    {
      id: 'notif-3',
      title: '3 nouvelles candidatures à qualifier',
      message: 'De nouveaux profils ont postulé aux offres FullStack et Design.',
      category: 'CANDIDATE',
      severity: 'SUCCESS',
      route: '/kanban',
      createdAt: '2026-11-04T09:15:00'
    }
  ];

  profileForm = {
    fullName: '',
    phone: '',
    school: '',
    fieldOfStudy: '',
    level: '',
    newPassword: ''
  };

  constructor(public auth: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    if (!this.auth.isLoggedIn()) return;
    this.api.getNotifications().subscribe({
      next: (list) => {
        if (list && list.length > 0) {
          this.notifications = list;
        }
      },
      error: () => {}
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.loadNotifications();
    }
  }

  goToNotification(n: NotificationItem) {
    this.showNotifications = false;
    this.router.navigate([n.route]);
  }

  openProfileModal() {
    const u = this.auth.currentUser();
    if (!u) return;
    this.profileForm = {
      fullName: u.fullName || '',
      phone: u.phone || '+212 600 10 20 30',
      school: u.school || 'Polytechnique / ENSIAS',
      fieldOfStudy: u.fieldOfStudy || 'Ingénierie Logicielle',
      level: u.level || 'Bac+5 / Master 2',
      newPassword: ''
    };
    this.profileSavedMessage = '';
    this.showProfileModal = true;
  }

  saveProfile() {
    this.auth.updateProfile(this.profileForm).subscribe({
      next: () => {
        this.profileSavedMessage = 'Profil mis à jour avec succès !';
      },
      error: () => {
        const cur = this.auth.currentUser();
        if (cur) {
          this.auth.setSession({
            ...cur,
            fullName: this.profileForm.fullName,
            phone: this.profileForm.phone,
            school: this.profileForm.school,
            fieldOfStudy: this.profileForm.fieldOfStudy,
            level: this.profileForm.level
          });
        }
        this.profileSavedMessage = 'Profil mis à jour !';
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/connexion']);
  }
}
