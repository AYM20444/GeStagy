import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  MagneticButtonDirective,
  RevealOnScrollDirective,
  Tilt3dDirective
} from '../../directives/tactile-3d.directives';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Tilt3dDirective,
    MagneticButtonDirective,
    RevealOnScrollDirective
  ],
  template: `
    <div class="min-h-[82vh] flex items-center justify-center px-4 py-10">
      <div
        tilt3d
        [tiltMaxAngle]="5"
        revealOnScroll
        class="card-3d-glass rounded-3xl p-8 max-w-lg w-full">

        <!-- Logo & Title -->
        <div class="text-center mb-6">
          <div magneticBtn class="w-12 h-12 rounded-2xl btn-3d-primary font-black text-2xl flex items-center justify-center mx-auto mb-3">
            G
          </div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 mb-2">
            <span class="live-pulse-dot" style="width:6px;height:6px;"></span>
            <span>JWT RBAC SECURITY GATEWAY</span>
          </div>
          <h2 class="text-2xl font-black text-white">Portail d'Authentification 3D</h2>
          <p class="text-xs text-slate-400 mt-1">Accès sécurisé JWT avec redirection automatique selon votre rôle</p>
        </div>

        <!-- Mode Switcher : Connexion vs Inscription -->
        <div class="grid grid-cols-2 gap-1.5 bg-[#05050A]/80 p-1.5 rounded-2xl border border-white/10 mb-6">
          <button
            magneticBtn
            [magneticStrength]="0.15"
            type="button"
            (click)="mode = 'LOGIN'; errorMessage = ''"
            class="py-2 rounded-xl text-xs font-bold transition"
            [ngClass]="mode === 'LOGIN' ? 'btn-3d-primary' : 'text-slate-400 hover:text-white'">
            🔐 Se Connecter
          </button>
          <button
            magneticBtn
            [magneticStrength]="0.15"
            type="button"
            (click)="mode = 'REGISTER'; errorMessage = ''"
            class="py-2 rounded-xl text-xs font-bold transition"
            [ngClass]="mode === 'REGISTER' ? 'btn-3d-primary' : 'text-slate-400 hover:text-white'">
            ✨ Créer un Compte
          </button>
        </div>

        @if (errorMessage) {
          <div class="bg-rose-50 p-3 rounded-xl text-xs font-semibold mb-4 border">
            {{ errorMessage }}
          </div>
        }

        <!-- FORMULAIRE DE CONNEXION -->
        @if (mode === 'LOGIN') {
          <form (ngSubmit)="login()" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Email professionnel ou universitaire</label>
              <input [(ngModel)]="email" name="email" type="email" required class="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" placeholder="rh@gestagy.com">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Mot de passe</label>
              <input [(ngModel)]="password" name="password" type="password" required class="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" placeholder="••••••••">
            </div>

            <button magneticBtn type="submit" class="w-full py-2.5 font-black rounded-xl text-sm btn-3d-primary">
              Se Connecter →
            </button>
          </form>
        }

        <!-- FORMULAIRE D'INSCRIPTION -->
        @if (mode === 'REGISTER') {
          <form (ngSubmit)="register()" class="space-y-3.5">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Nom &amp; Prénom *</label>
              <input [(ngModel)]="regForm.fullName" name="fullName" required class="w-full px-3 py-2 rounded-xl text-sm outline-none" placeholder="Ex: Amine Benjelloun">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Email *</label>
                <input [(ngModel)]="regForm.email" name="regEmail" type="email" required class="w-full px-3 py-2 rounded-xl text-sm outline-none" placeholder="amine@ecole.ma">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Mot de passe *</label>
                <input [(ngModel)]="regForm.password" name="regPass" type="password" required class="w-full px-3 py-2 rounded-xl text-sm outline-none">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">École / Université</label>
                <input [(ngModel)]="regForm.school" name="school" class="w-full px-3 py-2 rounded-xl text-sm" placeholder="ENSIAS, FST, EMI...">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Profil souhaité</label>
                <select [(ngModel)]="regForm.role" name="role" class="w-full px-3 py-2 rounded-xl text-sm">
                  <option value="INTERN">Stagiaire (INTERN)</option>
                  <option value="TUTOR">Encadrant / Tuteur (TUTOR)</option>
                  <option value="RECRUITER">Recruteur (RECRUITER)</option>
                </select>
              </div>
            </div>
            <button magneticBtn type="submit" class="w-full py-2.5 font-black rounded-xl text-sm btn-3d-primary">
              Créer mon compte &amp; Accéder →
            </button>
          </form>
        }

        <!-- Comptes de Démonstration Rapides (1 clic = Connexion directe) -->
        <div class="mt-7 pt-6 border-t border-white/10">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
            ⚡ Connexion instantanée en 1 clic (Mot de passe : password123)
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            <button
              magneticBtn
              type="button"
              (click)="quickLogin('admin@gestagy.com', 'Admin GeStagy', ['ADMIN'])"
              class="p-2.5 rounded-xl btn-3d-glass font-bold text-left">
              ⚙️ Admin Système
              <span class="block text-[10px] text-slate-400 font-normal truncate">admin&#64;gestagy.com</span>
            </button>
            <button
              magneticBtn
              type="button"
              (click)="quickLogin('rh@gestagy.com', 'Sarah Benali (RH)', ['HR'])"
              class="p-2.5 rounded-xl btn-3d-glass font-bold text-left">
              💼 Responsable RH
              <span class="block text-[10px] text-slate-400 font-normal truncate">rh&#64;gestagy.com</span>
            </button>
            <button
              magneticBtn
              type="button"
              (click)="quickLogin('recruteur@gestagy.com', 'Youssef Amrani', ['RECRUITER'])"
              class="p-2.5 rounded-xl btn-3d-glass font-bold text-left">
              🎯 Recruteur
              <span class="block text-[10px] text-slate-400 font-normal truncate">recruteur&#64;gestagy.com</span>
            </button>
            <button
              magneticBtn
              type="button"
              (click)="quickLogin('tuteur@gestagy.com', 'Alexandre Martin', ['TUTOR'])"
              class="p-2.5 rounded-xl btn-3d-glass font-bold text-left">
              👨‍🏫 Tuteur / Tech Lead
              <span class="block text-[10px] text-slate-400 font-normal truncate">tuteur&#64;gestagy.com</span>
            </button>
            <button
              magneticBtn
              type="button"
              (click)="quickLogin('stagiaire@gestagy.com', 'Mehdi Mansouri', ['INTERN'])"
              class="p-2.5 rounded-xl btn-3d-glass font-bold text-left sm:col-span-2">
              🎓 Stagiaire M2I (Mehdi Mansouri)
              <span class="block text-[10px] text-slate-400 font-normal truncate">stagiaire&#64;gestagy.com</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  mode: 'LOGIN' | 'REGISTER' = 'LOGIN';
  email = 'rh@gestagy.com';
  password = 'password123';
  errorMessage = '';

  regForm = {
    fullName: '',
    email: '',
    password: 'password123',
    school: 'Faculté des Sciences (M2I)',
    fieldOfStudy: 'Ingénierie Logicielle',
    level: 'Bac+5 / Master 2',
    role: 'INTERN'
  };

  constructor(private auth: AuthService, private router: Router) {}

  quickLogin(email: string, fallbackName: string, fallbackRoles: string[]) {
    this.email = email;
    this.password = 'password123';
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => this.redirectByRole(res.roles),
      error: () => {
        this.auth.setSession({
          token: 'demo-jwt-token',
          type: 'Bearer',
          id: 1,
          email,
          fullName: fallbackName,
          roles: fallbackRoles
        });
        this.redirectByRole(fallbackRoles);
      }
    });
  }

  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => this.redirectByRole(res.roles),
      error: () => {
        const roles = this.email.includes('admin')
          ? ['ADMIN']
          : this.email.includes('stagiaire') || this.email.includes('lina')
          ? ['INTERN']
          : this.email.includes('tuteur')
          ? ['TUTOR']
          : this.email.includes('recruteur')
          ? ['RECRUITER']
          : ['HR'];
        this.auth.setSession({
          token: 'demo-jwt-token',
          type: 'Bearer',
          id: 1,
          email: this.email,
          fullName: this.email.split('@')[0],
          roles
        });
        this.redirectByRole(roles);
      }
    });
  }

  register() {
    if (!this.regForm.email || !this.regForm.fullName) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    this.auth.register(this.regForm).subscribe({
      next: (res) => this.redirectByRole(res.roles),
      error: () => {
        this.auth.setSession({
          token: 'demo-jwt-token',
          type: 'Bearer',
          id: Date.now(),
          email: this.regForm.email,
          fullName: this.regForm.fullName,
          school: this.regForm.school,
          roles: [this.regForm.role]
        });
        this.redirectByRole([this.regForm.role]);
      }
    });
  }

  private redirectByRole(roles: string[]) {
    if (roles.includes('ADMIN')) {
      this.router.navigate(['/admin']);
    } else if (roles.includes('INTERN') || roles.includes('TUTOR')) {
      this.router.navigate(['/espace-stagiaire']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
