import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { NotificationItem } from '../../models/types';
import { MagneticButtonDirective, Tilt3dDirective } from '../../directives/tactile-3d.directives';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    MagneticButtonDirective,
    Tilt3dDirective
  ],
  template: `
    <header class="bg-[#0E0E16]/85 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-[0_10px_30px_rgba(0,0,0,0.65)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">

          <!-- Logo & Live Status Badge -->
          <div class="flex items-center space-x-3 cursor-pointer group" routerLink="/">
            <div magneticBtn class="w-10 h-10 rounded-xl btn-3d-primary flex items-center justify-center text-xl font-black">
              G
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xl font-black text-cyber-gradient tracking-tight">GeStagy</span>
                <span class="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  <span class="live-pulse-dot" style="width:6px;height:6px;"></span>
                  LIVE 3D
                </span>
              </div>
              <p class="text-[10px] text-slate-400 hidden sm:block leading-none mt-0.5">Tactile Talent &amp; Internship Telemetry</p>
            </div>
          </div>

          <!-- Navigation Links with Magnetic 3D Micro-Interactions -->
          <nav class="hidden md:flex items-center space-x-1.5">
            <a
              magneticBtn
              [magneticStrength]="0.18"
              routerLink="/offres"
              routerLinkActive="bg-white/10 text-white border-white/20 shadow-[0_0_16px_var(--accent-glow)]"
              class="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-transparent hover:border-white/15 transition">
              🎯 Portail Offres
            </a>

            @if (auth.isLoggedIn()) {
              @if (auth.hasAnyRole(['ADMIN', 'HR', 'RECRUITER', 'TUTOR'])) {
                <a
                  magneticBtn
                  [magneticStrength]="0.18"
                  routerLink="/dashboard"
                  routerLinkActive="bg-white/10 text-white border-white/20 shadow-[0_0_16px_var(--accent-glow)]"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-transparent hover:border-white/15 transition">
                  📊 Dashboard &amp; Offres
                </a>
                <a
                  magneticBtn
                  [magneticStrength]="0.18"
                  routerLink="/kanban"
                  routerLinkActive="bg-white/10 text-white border-white/20 shadow-[0_0_16px_var(--accent-glow)]"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-transparent hover:border-white/15 transition">
                  🗂️ Kanban &amp; Entretiens
                </a>
              }

              <a
                magneticBtn
                [magneticStrength]="0.18"
                routerLink="/espace-stagiaire"
                routerLinkActive="bg-white/10 text-white border-white/20 shadow-[0_0_16px_var(--accent-glow)]"
                class="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-transparent hover:border-white/15 transition">
                🎓 Suivi Stage &amp; Évaluations
              </a>

              @if (auth.hasAnyRole(['ADMIN', 'HR'])) {
                <a
                  magneticBtn
                  [magneticStrength]="0.18"
                  routerLink="/admin"
                  routerLinkActive="bg-white/10 text-white border-white/20 shadow-[0_0_16px_var(--accent-glow)]"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-transparent hover:border-white/15 transition">
                  ⚙️ Administration
                </a>
              }
            }
          </nav>

          <!-- Right Actions: Accent Palette Switcher, Notifications, Profile & Auth -->
          <div class="flex items-center space-x-2.5">

            <!-- Curated 3D Accent Palette Switcher (Option A / B / C) -->
            <div class="hidden lg:flex items-center gap-1.5 bg-[#05050A]/90 px-2.5 py-1.5 rounded-xl border border-white/10" title="Changer la palette néon 3D">
              <button
                type="button"
                (click)="setAccentTheme('cyan')"
                class="w-4 h-4 rounded-full bg-[#00F0FF] transition-transform"
                [class.scale-125]="activeTheme === 'cyan'"
                [class.ring-2]="activeTheme === 'cyan'"
                style="box-shadow: 0 0 10px #00F0FF"
                title="Option A: Cyber Cyan (#00F0FF)">
              </button>
              <button
                type="button"
                (click)="setAccentTheme('violet')"
                class="w-4 h-4 rounded-full bg-[#B829FF] transition-transform"
                [class.scale-125]="activeTheme === 'violet'"
                [class.ring-2]="activeTheme === 'violet'"
                style="box-shadow: 0 0 10px #B829FF"
                title="Option B: Neon Violet (#B829FF)">
              </button>
              <button
                type="button"
                (click)="setAccentTheme('emerald')"
                class="w-4 h-4 rounded-full bg-[#00FF9D] transition-transform"
                [class.scale-125]="activeTheme === 'emerald'"
                [class.ring-2]="activeTheme === 'emerald'"
                style="box-shadow: 0 0 10px #00FF9D"
                title="Option C: Emerald Laser (#00FF9D)">
              </button>
            </div>

            @if (auth.isLoggedIn()) {
              <!-- Notification Bell -->
              <div class="relative">
                <button
                  magneticBtn
                  (click)="toggleNotifications()"
                  class="relative p-2 rounded-xl btn-3d-glass text-sm"
                  title="Notifications et Rappels Live">
                  🔔
                  @if (notifications.length > 0) {
                    <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-black flex items-center justify-center shadow-[0_0_10px_#EF4444]">
                      {{ notifications.length }}
                    </span>
                  }
                </button>

                @if (showNotifications) {
                  <div class="absolute right-0 mt-3 w-80 sm:w-96 card-3d-glass rounded-2xl p-4 z-50">
                    <div class="flex justify-between items-center pb-2.5 mb-2.5 border-b border-white/10">
                      <span class="text-xs font-extrabold text-white flex items-center gap-2">
                        <span class="live-pulse-dot"></span>
                        Télémétrie &amp; Rappels ({{ notifications.length }})
                      </span>
                      <button (click)="showNotifications = false" class="text-xs text-slate-400 hover:text-white">✕</button>
                    </div>
                    <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      @for (n of notifications; track n.id) {
                        <div
                          (click)="goToNotification(n)"
                          class="p-3 rounded-xl border border-white/10 bg-[#05050A]/60 hover:border-cyan-400/50 cursor-pointer transition">
                          <div class="flex items-center justify-between mb-1">
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                              [ngClass]="{
                                'bg-amber-50 text-amber-400': n.severity === 'WARNING',
                                'bg-indigo-50 text-cyan-300': n.severity === 'INFO',
                                'bg-emerald-50 text-emerald-400': n.severity === 'SUCCESS'
                              }">
                              {{ n.category }}
                            </span>
                          </div>
                          <p class="text-xs font-bold text-white">{{ n.title }}</p>
                          <p class="text-[11px] text-slate-400 mt-0.5">{{ n.message }}</p>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- User Profile Pill -->
              <div class="flex items-center space-x-2.5 bg-[#05050A]/80 py-1.5 px-3 rounded-xl border border-white/10">
                <button
                  magneticBtn
                  [magneticStrength]="0.15"
                  (click)="openProfileModal()"
                  class="flex items-center space-x-2 text-left hover:opacity-90 transition"
                  title="Modifier mon profil">
                  <div class="w-8 h-8 rounded-lg btn-3d-primary font-black flex items-center justify-center text-xs">
                    {{ auth.currentUser()?.fullName?.charAt(0) || 'U' }}
                  </div>
                  <div class="hidden sm:block">
                    <p class="text-xs font-bold text-white leading-none">{{ auth.currentUser()?.fullName }}</p>
                    <p class="text-[10px] font-bold uppercase mt-0.5" style="color: var(--accent-primary)">
                      {{ auth.currentUser()?.roles?.join(' • ') }}
                    </p>
                  </div>
                </button>
                <button
                  magneticBtn
                  (click)="logout()"
                  class="text-xs text-[#EF4444] hover:text-rose-400 font-bold pl-2 border-l border-white/10">
                  Quitter
                </button>
              </div>
            } @else {
              <a
                magneticBtn
                routerLink="/connexion"
                class="inline-flex items-center justify-center px-4 py-2 text-xs font-black rounded-xl btn-3d-primary">
                🔐 Connexion / Inscription
              </a>
            }
          </div>

        </div>

        <!-- Mobile Navigation Bar -->
        @if (auth.isLoggedIn()) {
          <div class="flex md:hidden items-center gap-1.5 overflow-x-auto py-2 border-t border-white/10 text-xs">
            <a routerLink="/offres" routerLinkActive="bg-white/10 text-white font-bold" class="px-2.5 py-1 rounded-lg text-slate-300 whitespace-nowrap">Offres</a>
            @if (auth.hasAnyRole(['ADMIN', 'HR', 'RECRUITER', 'TUTOR'])) {
              <a routerLink="/dashboard" routerLinkActive="bg-white/10 text-white font-bold" class="px-2.5 py-1 rounded-lg text-slate-300 whitespace-nowrap">Dashboard</a>
              <a routerLink="/kanban" routerLinkActive="bg-white/10 text-white font-bold" class="px-2.5 py-1 rounded-lg text-slate-300 whitespace-nowrap">Kanban</a>
            }
            <a routerLink="/espace-stagiaire" routerLinkActive="bg-white/10 text-white font-bold" class="px-2.5 py-1 rounded-lg text-slate-300 whitespace-nowrap">Stage</a>
            @if (auth.hasAnyRole(['ADMIN', 'HR'])) {
              <a routerLink="/admin" routerLinkActive="bg-white/10 text-white font-bold" class="px-2.5 py-1 rounded-lg text-slate-300 whitespace-nowrap">Admin</a>
            }
          </div>
        }
      </div>
    </header>

    <!-- Modal 3D : Gérer mon profil -->
    @if (showProfileModal) {
      <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
        <div tilt3d [tiltMaxAngle]="4" class="card-3d-glass rounded-3xl max-w-lg w-full p-6 sm:p-8">
          <div class="flex justify-between items-center mb-5">
            <div>
              <h3 class="text-lg font-black text-white">Mon Profil Utilisateur</h3>
              <p class="text-xs text-slate-400">{{ auth.currentUser()?.email }} • Rôle : {{ auth.currentUser()?.roles?.join(', ') }}</p>
            </div>
            <button (click)="showProfileModal = false" class="text-slate-400 hover:text-white">✕</button>
          </div>

          @if (profileSavedMessage) {
            <div class="bg-emerald-50 p-3 rounded-xl text-xs font-semibold mb-4 border">
              ✓ {{ profileSavedMessage }}
            </div>
          }

          <form (ngSubmit)="saveProfile()" class="space-y-3.5">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Nom complet</label>
              <input [(ngModel)]="profileForm.fullName" name="fullName" required class="w-full px-3 py-2 rounded-xl text-sm outline-none">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Téléphone</label>
                <input [(ngModel)]="profileForm.phone" name="phone" class="w-full px-3 py-2 rounded-xl text-sm outline-none">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Niveau d'études / Poste</label>
                <input [(ngModel)]="profileForm.level" name="level" class="w-full px-3 py-2 rounded-xl text-sm outline-none">
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">École / Université</label>
                <input [(ngModel)]="profileForm.school" name="school" class="w-full px-3 py-2 rounded-xl text-sm outline-none">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Spécialité / Filière</label>
                <input [(ngModel)]="profileForm.fieldOfStudy" name="fieldOfStudy" class="w-full px-3 py-2 rounded-xl text-sm outline-none">
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Nouveau mot de passe (optionnel)</label>
              <input [(ngModel)]="profileForm.newPassword" name="newPassword" type="password" placeholder="Laisser vide pour conserver l'actuel" class="w-full px-3 py-2 rounded-xl text-sm outline-none">
            </div>

            <div class="flex justify-end gap-2 pt-3">
              <button magneticBtn type="button" (click)="showProfileModal = false" class="px-4 py-2 rounded-xl text-xs font-bold btn-3d-glass">
                Fermer
              </button>
              <button magneticBtn type="submit" class="px-5 py-2 rounded-xl text-xs font-bold btn-3d-primary">
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
  activeTheme: 'cyan' | 'violet' | 'emerald' = 'cyan';

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

  setAccentTheme(theme: 'cyan' | 'violet' | 'emerald') {
    this.activeTheme = theme;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
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
