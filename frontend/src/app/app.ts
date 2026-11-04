import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between">
      <div>
        <app-navbar></app-navbar>
        <main>
          <router-outlet></router-outlet>
        </main>
      </div>
      
      <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© 2026 <strong>GeStagy (InternHub)</strong> — Plateforme FullStack de gestion des stages (Angular + Spring Boot + PostgreSQL)</p>
      </footer>
    </div>
  `
})
export class App {}
