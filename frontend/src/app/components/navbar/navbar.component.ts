import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          
          <!-- Logo & Brand -->
          <div class="flex items-center space-x-3 cursor-pointer" routerLink="/">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-200 text-white font-black text-xl">
              G
            </div>
            <div>
              <span class="text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">GeStagy</span>
              <span class="text-xs ml-1.5 px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/50">Pro</span>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center space-x-1">
            <a routerLink="/offres" routerLinkActive="bg-indigo-50 text-indigo-700 font-semibold" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
              Offres de stage
            </a>

            @if (auth.isLoggedIn()) {
              @if (auth.hasRole('HR') || auth.hasRole('ADMIN') || auth.hasRole('RECRUITER')) {
                <a routerLink="/dashboard" routerLinkActive="bg-indigo-50 text-indigo-700 font-semibold" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
                  Dashboard RH
                </a>
                <a routerLink="/kanban" routerLinkActive="bg-indigo-50 text-indigo-700 font-semibold" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
                  Pipeline Recrutement
                </a>
              }

              @if (auth.hasRole('INTERN') || auth.hasRole('TUTOR')) {
                <a routerLink="/espace-stagiaire" routerLinkActive="bg-indigo-50 text-indigo-700 font-semibold" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
                  Mon Espace Stage
                </a>
              }
            }
          </nav>

          <!-- User actions / Login button -->
          <div class="flex items-center space-x-3">
            @if (auth.isLoggedIn()) {
              <div class="flex items-center space-x-3 bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-200">
                <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  {{ auth.currentUser()?.fullName?.charAt(0) || 'U' }}
                </div>
                <div class="hidden sm:block text-left">
                  <p class="text-xs font-semibold text-slate-800 leading-none">{{ auth.currentUser()?.fullName }}</p>
                  <p class="text-[10px] text-slate-500 capitalize">{{ auth.currentUser()?.roles?.[0] || 'User' }}</p>
                </div>
                <button (click)="auth.logout()" class="text-xs text-rose-500 hover:text-rose-700 font-medium pl-1">
                  Déconnexion
                </button>
              </div>
            } @else {
              <a routerLink="/connexion" class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition">
                Espace Pro & Connexion
              </a>
            }
          </div>

        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}

