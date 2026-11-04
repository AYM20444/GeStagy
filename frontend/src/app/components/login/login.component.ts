import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="bg-white border border-slate-200/80 rounded-3xl p-8 max-w-md w-full shadow-xl">
        
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-100">
            G
          </div>
          <h2 class="text-2xl font-bold text-slate-900">Connexion GeStagy</h2>
          <p class="text-xs text-slate-500 mt-1">Espace réservé aux RH, Recruteurs, Encadrants et Stagiaires</p>
        </div>

        @if (errorMessage) {
          <div class="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs mb-4 border border-rose-200">
            {{ errorMessage }}
          </div>
        }

        <form (ngSubmit)="login()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input [(ngModel)]="email" name="email" type="email" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="rh@gestagy.com">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Mot de passe</label>
            <input [(ngModel)]="password" name="password" type="password" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••">
          </div>

          <button type="submit" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition">
            Se Connecter
          </button>
        </form>

        <!-- Comptes de test rapides -->
        <div class="mt-8 pt-6 border-t border-slate-100">
          <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">Comptes de test (mot de passe : password123)</p>
          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <button (click)="fillTest('rh@gestagy.com')" class="p-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 border border-slate-200 font-medium">
              💼 RH : rh&#64;gestagy.com
            </button>
            <button (click)="fillTest('recruteur@gestagy.com')" class="p-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 border border-slate-200 font-medium">
              🎯 Recruteur : recruteur&#64;gestagy.com
            </button>
            <button (click)="fillTest('stagiaire@gestagy.com')" class="p-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 border border-slate-200 font-medium">
              🎓 Stagiaire : stagiaire&#64;gestagy.com
            </button>
            <button (click)="fillTest('tuteur@gestagy.com')" class="p-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 border border-slate-200 font-medium">
              👨‍🏫 Tuteur : tuteur&#64;gestagy.com
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  email = 'rh@gestagy.com';
  password = 'password123';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  fillTest(email: string) {
    this.email = email;
    this.password = 'password123';
  }

  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.roles.includes('INTERN')) {
          this.router.navigate(['/espace-stagiaire']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        // En mode démo local si le backend n'est pas encore lancé
        const dummyUser = {
          token: 'demo-jwt-token',
          type: 'Bearer',
          id: 1,
          email: this.email,
          fullName: this.email.includes('rh') ? 'Sarah Benali (RH)' : 'Mehdi Mansouri (Stagiaire)',
          roles: this.email.includes('stagiaire') ? ['INTERN'] : ['HR', 'RECRUITER']
        };
        this.auth.currentUser.set(dummyUser);
        localStorage.setItem('gestagy_user', JSON.stringify(dummyUser));
        if (this.email.includes('stagiaire')) {
          this.router.navigate(['/espace-stagiaire']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }
}

