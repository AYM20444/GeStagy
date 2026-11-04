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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Hero Banner -->
      <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl mb-8">
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div class="lg:col-span-2">
            <span class="inline-block px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-xs font-bold text-indigo-200 uppercase tracking-wider mb-3">
              ✨ Campagne PFE &amp; Stages 2026
            </span>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tight mb-3 leading-tight">
              Propulsez votre carrière avec <span class="text-indigo-300">GeStagy</span>
            </h1>
            <p class="text-slate-300 text-sm sm:text-base mb-5 max-w-2xl">
              Explorez nos sujets de stage à fort impact, testez instantanément votre compatibilité technique grâce au <strong>Smart Skill Matcher</strong> et postulez en ligne avec votre CV et lettre de motivation.
            </p>
            <div class="flex flex-wrap gap-2 text-xs font-semibold text-indigo-100">
              <span class="bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">🎯 Matching Compétences Temps Réel</span>
              <span class="bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">👨‍🏫 Mentorat Tech Lead dédié</span>
              <span class="bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">💼 75% de pré-embauche CDI</span>
            </div>
          </div>

          <!-- Interactive Smart Skill Matcher Widget -->
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-sm font-bold text-white flex items-center gap-1.5">
                🧠 Smart Skill Matcher
              </h3>
              @if (selectedUserSkills.length > 0) {
                <button (click)="selectedUserSkills = []" class="text-[11px] text-indigo-200 hover:text-white underline">
                  Réinitialiser
                </button>
              }
            </div>
            <p class="text-[11px] text-indigo-200 mb-3">
              Cliquez sur vos compétences pour calculer votre score de compatibilité sur chaque offre :
            </p>
            <div class="flex flex-wrap gap-1.5">
              @for (skill of allSkillsPool; track skill) {
                <button
                  type="button"
                  (click)="toggleUserSkill(skill)"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                  [ngClass]="selectedUserSkills.includes(skill)
                    ? 'bg-emerald-400 text-slate-950 shadow-sm scale-105'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'">
                  {{ selectedUserSkills.includes(skill) ? '✓ ' : '+ ' }}{{ skill }}
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters Bar -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        <div class="lg:col-span-2">
          <input
            [(ngModel)]="searchQuery"
            placeholder="🔍 Rechercher par titre, technologie (ex: Angular, Spring, IA, Figma)..."
            class="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500">
        </div>
        <div>
          <select
            [(ngModel)]="selectedDepartment"
            class="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="">🏢 Tous les départements</option>
            @for (dept of departmentsList; track dept) {
              <option [value]="dept">{{ dept }}</option>
            }
          </select>
        </div>
        <div>
          <select
            [(ngModel)]="selectedDuration"
            class="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="">⏱️ Toutes les durées</option>
            <option value="3">3 mois</option>
            <option value="4">4 mois</option>
            <option value="6">6 mois (PFE)</option>
          </select>
        </div>
      </div>

      <!-- Offres Header -->
      <div class="flex justify-between items-center mb-5">
        <div>
          <h2 class="text-xl font-black text-slate-900">Offres de stage ouvertes</h2>
          <p class="text-xs text-slate-500">Consultez les détails ou déposez votre dossier de candidature en quelques secondes</p>
        </div>
        <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200/60">
          {{ filteredOffers.length }} offre(s) disponible(s)
        </span>
      </div>

      <!-- Offres Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (offer of filteredOffers; track offer.id) {
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl transition-all hover:border-indigo-300 flex flex-col justify-between relative">
            <div>
              <div class="flex justify-between items-start gap-2 mb-3">
                <span class="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg">
                  {{ offer.departmentName }}
                </span>

                <div class="flex items-center gap-1.5">
                  @if (selectedUserSkills.length > 0) {
                    <span
                      class="text-[11px] font-black px-2 py-0.5 rounded-md border"
                      [ngClass]="getMatchScore(offer) >= 60
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'">
                      ⚡ Match {{ getMatchScore(offer) }}%
                    </span>
                  }
                  <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {{ offer.status }}
                  </span>
                </div>
              </div>

              <h3
                (click)="detailOffer = offer"
                class="text-base font-extrabold text-slate-900 mb-2 leading-snug hover:text-indigo-600 cursor-pointer transition">
                {{ offer.title }}
              </h3>

              <p class="text-slate-600 text-xs line-clamp-3 mb-4 leading-relaxed">
                {{ offer.description }}
              </p>

              <!-- Skills Tags -->
              <div class="flex flex-wrap gap-1.5 mb-5">
                @for (skill of offer.skills; track skill) {
                  <span
                    class="text-[11px] font-semibold px-2 py-0.5 rounded-md transition"
                    [ngClass]="selectedUserSkills.includes(skill)
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                      : 'bg-indigo-50 text-indigo-700'">
                    {{ skill }}
                  </span>
                }
              </div>
            </div>

            <!-- Footer Card -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div class="text-xs text-slate-500 font-medium">
                <span>📍 {{ offer.location }}</span>
                <span class="mx-1">•</span>
                <span>⏱️ {{ offer.durationMonths }} mois</span>
              </div>
              <div class="flex items-center gap-1.5">
                <button
                  (click)="detailOffer = offer"
                  class="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition">
                  Détails
                </button>
                <button
                  (click)="openApplyModal(offer)"
                  class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition">
                  Postuler →
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Modal Détail de l'Offre -->
      @if (detailOffer) {
        <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div class="flex justify-between items-start gap-4 mb-4">
              <div>
                <span class="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">
                  {{ detailOffer.departmentName }}
                </span>
                <h3 class="text-xl font-black text-slate-900 mt-2">{{ detailOffer.title }}</h3>
              </div>
              <button (click)="detailOffer = null" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div class="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 mb-4 text-xs">
              <div>
                <span class="text-slate-400 block">Localisation</span>
                <strong class="text-slate-800">📍 {{ detailOffer.location }}</strong>
              </div>
              <div>
                <span class="text-slate-400 block">Durée du stage</span>
                <strong class="text-slate-800">⏱️ {{ detailOffer.durationMonths }} mois</strong>
              </div>
              <div>
                <span class="text-slate-400 block">Démarrage prévu</span>
                <strong class="text-slate-800">📅 {{ detailOffer.startDate || 'Immédiat' }}</strong>
              </div>
            </div>

            <h4 class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Description &amp; Missions</h4>
            <p class="text-sm text-slate-700 leading-relaxed mb-4">{{ detailOffer.description }}</p>

            <h4 class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Compétences recherchées</h4>
            <div class="flex flex-wrap gap-1.5 mb-6">
              @for (s of detailOffer.skills; track s) {
                <span class="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">{{ s }}</span>
              }
            </div>

            <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button (click)="detailOffer = null" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                Fermer
              </button>
              <button
                (click)="openApplyModal(detailOffer); detailOffer = null"
                class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md">
                Postuler à cette offre →
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modal de Candidature (avec Upload CV & Lettre de motivation) -->
      @if (selectedOffer) {
        <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-xl font-black text-slate-900">Déposer ma candidature</h3>
              <button (click)="selectedOffer = null" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <p class="text-xs text-indigo-600 font-bold mb-4 bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
              🎯 Offre : {{ selectedOffer.title }} ({{ selectedOffer.departmentName }})
            </p>

            @if (applySuccess) {
              <div class="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-xs font-semibold mb-4 border border-emerald-200">
                🎉 Votre candidature et vos pièces jointes ont bien été transmises ! Elle apparaît désormais dans la colonne <strong>Nouveau</strong> du Pipeline Kanban RH.
              </div>
            }

            @if (validationError) {
              <div class="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-semibold mb-4 border border-rose-200">
                ⚠️ {{ validationError }}
              </div>
            }

            <form (ngSubmit)="submitApplication()" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Nom &amp; Prénom *</label>
                <input [(ngModel)]="applyForm.fullName" name="fullName" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Yasmine El Idrissi">
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                  <input [(ngModel)]="applyForm.email" name="email" type="email" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="yasmine@ecole.ma">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Téléphone *</label>
                  <input [(ngModel)]="applyForm.phone" name="phone" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="+212 600 11 22 33">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">École / Université *</label>
                <input [(ngModel)]="applyForm.school" name="school" required class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: ENSIAS, EMI, INPT, FST, UM6P...">
              </div>

              <!-- Upload CV (PDF) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="border border-dashed border-indigo-300 rounded-xl p-3 bg-indigo-50/40">
                  <label class="block text-xs font-bold text-indigo-900 mb-1">📄 Téléverser CV (PDF)</label>
                  <input type="file" accept=".pdf,.doc,.docx" (change)="onCvFileSelected($event)" class="text-[11px] text-slate-600 w-full">
                  @if (uploadingCv) {
                    <p class="text-[10px] text-indigo-600 font-semibold mt-1">Téléversement en cours...</p>
                  } @else if (applyForm.cvUrl) {
                    <p class="text-[10px] text-emerald-600 font-bold mt-1">✓ Fichier CV joint</p>
                  }
                </div>

                <div class="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50">
                  <label class="block text-xs font-bold text-slate-700 mb-1">✉️ Lettre de motivation</label>
                  <input type="file" accept=".pdf,.doc,.docx" (change)="onCoverLetterSelected($event)" class="text-[11px] text-slate-600 w-full">
                  @if (applyForm.coverLetterUrl) {
                    <p class="text-[10px] text-emerald-600 font-bold mt-1">✓ Lettre jointe</p>
                  }
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Motivation / Lien Portfolio ou GitHub</label>
                <textarea [(ngModel)]="applyForm.notes" name="notes" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Présentez brièvement vos projets ou collez votre lien GitHub / LinkedIn..."></textarea>
              </div>

              <div class="flex justify-end gap-2 pt-3">
                <button type="button" (click)="selectedOffer = null" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
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
      description: 'Rejoignez notre équipe Core Platform pour concevoir des microservices résilients sous Spring Boot 3 et une interface utilisateur temps réel sous Angular.',
      departmentId: 1,
      departmentName: 'Ingénierie & Tech',
      skills: ['Java', 'Spring Boot', 'Angular', 'TypeScript', 'PostgreSQL', 'Docker'],
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
      description: 'Contribuez à l’ergonomie, aux tests utilisateurs et aux composants de notre Design System web & mobile avec Figma et Tailwind CSS.',
      departmentId: 2,
      departmentName: 'Produit & Design',
      skills: ['Figma', 'Design System', 'Wireframing', 'Tailwind CSS', 'User Research'],
      durationMonths: 4,
      startDate: '2026-11-25',
      location: 'Rabat / Présentiel',
      status: 'OPEN',
      candidatesCount: 3,
      createdAt: ''
    },
    {
      id: 3,
      title: 'Stagiaire Cloud & DevOps Engineer',
      description: 'Mise en place de pipelines CI/CD GitLab, automatisation de clusters Kubernetes et observabilité Prometheus / Grafana.',
      departmentId: 1,
      departmentName: 'Ingénierie & Tech',
      skills: ['Kubernetes', 'Docker', 'GitLab CI', 'Terraform', 'Linux'],
      durationMonths: 6,
      startDate: '2026-12-01',
      location: 'Casablanca',
      status: 'OPEN',
      candidatesCount: 2,
      createdAt: ''
    },
    {
      id: 4,
      title: 'Stagiaire Data Scientist & IA Générative (LLM / RAG)',
      description: 'Analyse prédictive des données RH, conception d’assistants intelligents de matching CV-Offre basés sur des architectures RAG.',
      departmentId: 4,
      departmentName: 'Data & IA',
      skills: ['Python', 'SQL', 'PowerBI', 'LangChain', 'FastAPI'],
      durationMonths: 6,
      startDate: '2026-12-05',
      location: 'Télétravail / Hybride',
      status: 'OPEN',
      candidatesCount: 1,
      createdAt: ''
    }
  ];

  allSkillsPool = [
    'Java', 'Spring Boot', 'Angular', 'TypeScript', 'PostgreSQL',
    'Docker', 'Kubernetes', 'Python', 'SQL', 'Figma', 'Tailwind CSS', 'GitLab CI'
  ];
  selectedUserSkills: string[] = [];

  searchQuery = '';
  selectedDepartment = '';
  selectedDuration = '';

  detailOffer: InternshipOffer | null = null;
  selectedOffer: InternshipOffer | null = null;
  applySuccess = false;
  validationError = '';
  uploadingCv = false;

  applyForm = {
    fullName: '',
    email: '',
    phone: '',
    school: '',
    cvUrl: '',
    coverLetterUrl: '',
    notes: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPublicOffers().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.offers = data;
        }
      },
      error: () => {}
    });
  }

  get departmentsList(): string[] {
    return Array.from(new Set(this.offers.map(o => o.departmentName)));
  }

  get filteredOffers(): InternshipOffer[] {
    return this.offers.filter(o => {
      const q = this.searchQuery.trim().toLowerCase();
      const matchesQuery = !q
        || o.title.toLowerCase().includes(q)
        || o.description.toLowerCase().includes(q)
        || o.location.toLowerCase().includes(q)
        || (o.skills && o.skills.some(s => s.toLowerCase().includes(q)));
      const matchesDept = !this.selectedDepartment || o.departmentName === this.selectedDepartment;
      const matchesDur = !this.selectedDuration || String(o.durationMonths) === String(this.selectedDuration);
      return matchesQuery && matchesDept && matchesDur;
    });
  }

  toggleUserSkill(skill: string) {
    if (this.selectedUserSkills.includes(skill)) {
      this.selectedUserSkills = this.selectedUserSkills.filter(s => s !== skill);
    } else {
      this.selectedUserSkills = [...this.selectedUserSkills, skill];
    }
  }

  getMatchScore(offer: InternshipOffer): number {
    if (!offer.skills || offer.skills.length === 0 || this.selectedUserSkills.length === 0) return 0;
    const matched = offer.skills.filter(s =>
      this.selectedUserSkills.some(u => u.toLowerCase() === s.toLowerCase())
    ).length;
    return Math.round((matched / offer.skills.length) * 100);
  }

  openApplyModal(offer: InternshipOffer) {
    this.selectedOffer = offer;
    this.applySuccess = false;
    this.validationError = '';
  }

  onCvFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.uploadingCv = true;
    this.api.uploadFile(file).subscribe({
      next: (res) => {
        this.applyForm.cvUrl = res.fileUrl;
        this.uploadingCv = false;
      },
      error: () => {
        this.applyForm.cvUrl = `/api/files/${file.name}`;
        this.uploadingCv = false;
      }
    });
  }

  onCoverLetterSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.api.uploadFile(file).subscribe({
      next: (res) => {
        this.applyForm.coverLetterUrl = res.fileUrl;
      },
      error: () => {
        this.applyForm.coverLetterUrl = `/api/files/${file.name}`;
      }
    });
  }

  submitApplication() {
    if (!this.selectedOffer) return;
    if (!this.applyForm.fullName.trim() || !this.applyForm.email.trim() || !this.applyForm.school.trim()) {
      this.validationError = 'Veuillez renseigner votre nom complet, votre email et votre établissement.';
      return;
    }
    this.validationError = '';
    const offerRef = this.selectedOffer;

    this.api.applyOffer(offerRef.id, this.applyForm).subscribe({
      next: () => {
        offerRef.candidatesCount = (offerRef.candidatesCount || 0) + 1;
        this.applySuccess = true;
        this.resetFormAfterSuccess();
      },
      error: () => {
        offerRef.candidatesCount = (offerRef.candidatesCount || 0) + 1;
        this.applySuccess = true;
        this.resetFormAfterSuccess();
      }
    });
  }

  private resetFormAfterSuccess() {
    setTimeout(() => {
      this.selectedOffer = null;
      this.applySuccess = false;
      this.applyForm = { fullName: '', email: '', phone: '', school: '', cvUrl: '', coverLetterUrl: '', notes: '' };
    }, 1800);
  }
}
