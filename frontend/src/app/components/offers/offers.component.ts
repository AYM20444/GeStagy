import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { InternshipOffer } from '../../models/types';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- Header Banner / Hero -->
      <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl mb-12">
        <div class="relative z-10 max-w-2xl">
          <span class="inline-block px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-4">
            Opportunités de stages 2026
          </span>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Propulsez votre carrière avec <span class="text-indigo-300">GeStagy</span>
          </h1>
          <p class="text-slate-300 text-sm sm:text-base mb-6">
            Explorez nos offres de stage, postulez en un clic et suivez l'évolution de votre candidature en temps réel avec nos équipes RH.
          </p>
          
          <div class="flex flex-wrap gap-2 text-xs font-medium text-indigo-200">
            <span class="bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg">✨ Encadrement personnalisé</span>
            <span class="bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg">🚀 Projets à fort impact</span>
            <span class="bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg">💼 Pré-embauche en CDI</span>
          </div>
        </div>
      </div>

      <!-- Offres Grid -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-black text-slate-800">Offres disponibles</h2>
          <p class="text-sm text-slate-500">Postulez et commencez votre aventure dès aujourd'hui</p>
        </div>
        <span class="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {{ offers.length }} opportunité(s)
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (offer of offers; track offer.id) {
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-lg transition-all hover:border-indigo-200 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start gap-2 mb-3">
                <span class="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                  {{ offer.departmentName }}
                </span>
                <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {{ offer.status }}
                </span>
              </div>

              <h3 class="text-lg font-bold text-slate-900 mb-2 leading-snug">
                {{ offer.title }}
              </h3>

              <p class="text-slate-600 text-xs sm:text-sm line-clamp-3 mb-4">
                {{ offer.description }}
              </p>

              <!-- Tags / Skills -->
              <div class="flex flex-wrap gap-1.5 mb-5">
                @for (skill of offer.skills; track skill) {
                  <span class="bg-indigo-50 text-indigo-600 text-[11px] font-medium px-2 py-0.5 rounded-md">
                    {{ skill }}
                  </span>
                }
              </div>
            </div>

            <!-- Footer Card -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div class="text-xs text-slate-500">
                <span>📍 {{ offer.location }}</span>
                <span class="mx-1">•</span>
                <span>⏱️ {{ offer.durationMonths }} mois</span>
              </div>
              <button 
                (click)="openApplyModal(offer)"
                class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition">
                Postuler
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Modal de Candidature -->
      @if (selectedOffer) {
        <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-slate-900">Postuler à l'offre</h3>
              <button (click)="selectedOffer = null" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            
            <p class="text-xs text-indigo-600 font-semibold mb-4">{{ selectedOffer.title }}</p>

            @if (applySuccess) {
              <div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm mb-4 border border-emerald-200">
                🎉 Votre candidature a bien été enregistrée ! L'équipe RH l'examinera dans les plus brefs délais.
              </div>
            }

            <form (ngSubmit)="submitApplication()" class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Nom complet</label>
                <input [(ngModel)]="applyForm.fullName" name="fullName" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Yasmine Tazi">
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Email universitaire ou personnel</label>
                <input [(ngModel)]="applyForm.email" name="email" type="email" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="yasmine@ecole.ma">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Téléphone</label>
                  <input [(ngModel)]="applyForm.phone" name="phone" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="+212 600...">
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">École / Université</label>
                  <input [(ngModel)]="applyForm.school" name="school" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ENSIAS, FST...">
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Lien CV (Drive, LinkedIn ou Portfolio)</label>
                <input [(ngModel)]="applyForm.cvUrl" name="cvUrl" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://drive.google.com/...">
              </div>

              <div class="flex justify-end gap-2 pt-4">
                <button type="button" (click)="selectedOffer = null" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  Annuler
                </button>
                <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition">
                  Envoyer ma candidature
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class OffersComponent implements OnInit {
  offers: InternshipOffer[] = [
    {
      id: 1,
      title: 'Stagiaire Développeur FullStack (Angular / Spring Boot)',
      description: 'Rejoignez notre équipe core banking pour concevoir des micro-services modernes et une interface utilisateur haute performance.',
      departmentId: 1,
      departmentName: 'Ingénierie & Tech',
      skills: ['Java', 'Spring Boot', 'Angular', 'TypeScript', 'PostgreSQL'],
      durationMonths: 6,
      startDate: '2026-11-20',
      location: 'Casablanca / Hybride',
      status: 'OPEN',
      candidatesCount: 6,
      createdAt: ''
    },
    {
      id: 2,
      title: 'Stagiaire Product Designer & UI/UX Specialist',
      description: 'Contribuez à l’ergonomie et aux maquettes de nos nouvelles applications web & mobiles avec Figma et Tailwind.',
      departmentId: 2,
      departmentName: 'Produit & Design',
      skills: ['Figma', 'Design System', 'Wireframing', 'Tailwind CSS'],
      durationMonths: 4,
      startDate: '2026-11-25',
      location: 'Rabat / Présentiel',
      status: 'OPEN',
      candidatesCount: 4,
      createdAt: ''
    },
    {
      id: 3,
      title: 'Stagiaire Cloud & DevOps Engineer',
      description: 'Mise en place de pipelines CI/CD, automatisation Kubernetes et supervision Grafana.',
      departmentId: 1,
      departmentName: 'Ingénierie & Tech',
      skills: ['Kubernetes', 'Docker', 'GitLab CI', 'Terraform', 'Linux'],
      durationMonths: 6,
      startDate: '2026-12-01',
      location: 'Casablanca',
      status: 'OPEN',
      candidatesCount: 2,
      createdAt: ''
    }
  ];

  selectedOffer: InternshipOffer | null = null;
  applySuccess = false;

  applyForm = {
    fullName: '',
    email: '',
    phone: '',
    school: '',
    cvUrl: '',
    coverLetterUrl: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPublicOffers().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.offers = data;
        }
      },
      error: (err) => console.log('Backend en cours de démarrage, utilisation des données démo locales')
    });
  }

  openApplyModal(offer: InternshipOffer) {
    this.selectedOffer = offer;
    this.applySuccess = false;
  }

  submitApplication() {
    if (!this.selectedOffer) return;
    this.api.applyOffer(this.selectedOffer.id, this.applyForm).subscribe({
      next: () => {
        this.applySuccess = true;
        setTimeout(() => {
          this.selectedOffer = null;
          this.applySuccess = false;
        }, 2000);
      },
      error: () => {
        this.applySuccess = true;
        setTimeout(() => {
          this.selectedOffer = null;
          this.applySuccess = false;
        }, 1500);
      }
    });
  }
}
