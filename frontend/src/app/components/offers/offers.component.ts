import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { InternshipOffer } from '../../models/types';
import {
  CountUpDirective,
  MagneticButtonDirective,
  RevealOnScrollDirective,
  Tilt3dDirective
} from '../../directives/tactile-3d.directives';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Tilt3dDirective,
    MagneticButtonDirective,
    CountUpDirective,
    RevealOnScrollDirective
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- 3D Glass Hero Banner -->
      <div
        tilt3d
        [tiltMaxAngle]="3"
        [tiltScale]="1.008"
        revealOnScroll
        class="card-3d-glass rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden mb-8">

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div class="lg:col-span-2">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">
              <span class="live-pulse-dot"></span>
              <span>LIVE CAMPAIGN • PFE &amp; STAGES 2026</span>
            </div>

            <h1 class="text-3xl sm:text-5xl font-black tracking-tight mb-3 leading-tight">
              Propulsez votre carrière dans l'univers <span class="text-cyber-gradient">GeStagy 3D</span>
            </h1>
            <p class="text-slate-300 text-sm sm:text-base mb-6 max-w-2xl leading-relaxed">
              Explorez nos sujets de stage à fort impact, testez instantanément votre compatibilité technique grâce au <strong>Smart Skill Matcher</strong> temps réel et postulez en un clic avec votre CV et lettre de motivation.
            </p>
            <div class="flex flex-wrap gap-2.5 text-xs font-bold text-slate-200">
              <span class="bg-white/5 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]"></span>
                Matching Compétences Temps Réel
              </span>
              <span class="bg-white/5 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                👨‍🏫 Mentorat Tech Lead dédié
              </span>
              <span class="bg-white/5 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                💼 <span [countUp]="75" countSuffix="%">75%</span> de pré-embauche CDI
              </span>
            </div>
          </div>

          <!-- Interactive Smart Skill Matcher 3D Widget -->
          <div class="bg-[#05050A]/80 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-sm font-black text-white flex items-center gap-2">
                🧠 Smart Skill Matcher
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  AI LIVE
                </span>
              </h3>
              @if (selectedUserSkills.length > 0) {
                <button (click)="selectedUserSkills = []" class="text-[11px] text-cyan-400 hover:underline font-bold">
                  Réinitialiser
                </button>
              }
            </div>
            <p class="text-[11px] text-slate-400 mb-3.5">
              Sélectionnez vos compétences pour calculer votre télémétrie de compatibilité sur chaque offre :
            </p>
            <div class="flex flex-wrap gap-1.5">
              @for (skill of allSkillsPool; track skill) {
                <button
                  magneticBtn
                  [magneticStrength]="0.2"
                  type="button"
                  (click)="toggleUserSkill(skill)"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                  [ngClass]="selectedUserSkills.includes(skill)
                    ? 'btn-3d-primary scale-105'
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:border-cyan-400/50 hover:text-white'">
                  {{ selectedUserSkills.includes(skill) ? '✓ ' : '+ ' }}{{ skill }}
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters Glass Bar -->
      <div
        revealOnScroll
        [revealDelay]="80"
        class="card-3d-glass rounded-2xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        <div class="lg:col-span-2">
          <input
            [(ngModel)]="searchQuery"
            placeholder="🔍 Rechercher par titre, technologie (ex: Angular, Spring, IA, Figma)..."
            class="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm outline-none">
        </div>
        <div>
          <select
            [(ngModel)]="selectedDepartment"
            class="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm outline-none">
            <option value="">🏢 Tous les départements</option>
            @for (dept of departmentsList; track dept) {
              <option [value]="dept">{{ dept }}</option>
            }
          </select>
        </div>
        <div>
          <select
            [(ngModel)]="selectedDuration"
            class="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm outline-none">
            <option value="">⏱️ Toutes les durées</option>
            <option value="3">3 mois</option>
            <option value="4">4 mois</option>
            <option value="6">6 mois (PFE)</option>
          </select>
        </div>
      </div>

      <!-- Offres Header with Live Counter -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-black text-white flex items-center gap-2.5">
            Offres de stage ouvertes
            <span class="live-pulse-dot"></span>
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">Survolez les cartes en 3D ou déposez votre dossier de candidature en quelques secondes</p>
        </div>
        <span class="text-xs font-black px-3.5 py-1.5 rounded-full bg-indigo-50 border flex items-center gap-1.5">
          <span [countUp]="filteredOffers.length"></span> offre(s) active(s)
        </span>
      </div>

      <!-- 3D Tilt Offres Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (offer of filteredOffers; track offer.id; let idx = $index) {
          <div
            tilt3d
            [tiltMaxAngle]="7"
            [tiltScale]="1.022"
            revealOnScroll
            [revealDelay]="idx * 70"
            class="card-3d-glass rounded-2xl p-6 flex flex-col justify-between relative">
            <div>
              <div class="flex justify-between items-start gap-2 mb-3">
                <span class="px-2.5 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-bold rounded-lg">
                  {{ offer.departmentName }}
                </span>

                <div class="flex items-center gap-1.5">
                  @if (selectedUserSkills.length > 0) {
                    <span
                      class="text-[11px] font-black px-2 py-0.5 rounded-md border"
                      [ngClass]="getMatchScore(offer) >= 60
                        ? 'bg-emerald-50 border-emerald-500/40'
                        : 'bg-amber-50 border-amber-500/40'">
                      ⚡ Match {{ getMatchScore(offer) }}%
                    </span>
                  }
                  <span class="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border">
                    <span class="live-pulse-dot" style="width:6px;height:6px;"></span>
                    {{ offer.status }}
                  </span>
                </div>
              </div>

              <h3
                (click)="detailOffer = offer"
                class="text-base font-extrabold text-white mb-2 leading-snug hover:text-cyan-400 cursor-pointer transition">
                {{ offer.title }}
              </h3>

              <p class="text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed">
                {{ offer.description }}
              </p>

              <!-- Skills Tags -->
              <div class="flex flex-wrap gap-1.5 mb-5">
                @for (skill of offer.skills; track skill) {
                  <span
                    class="text-[11px] font-semibold px-2.5 py-0.5 rounded-md transition border"
                    [ngClass]="selectedUserSkills.includes(skill)
                      ? 'bg-emerald-50 font-black shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                      : 'bg-indigo-50'">
                    {{ skill }}
                  </span>
                }
              </div>
            </div>

            <!-- Footer Card with 3D Tactile Buttons -->
            <div class="pt-4 border-t border-white/10 flex items-center justify-between">
              <div class="text-xs text-slate-400 font-medium">
                <span>📍 {{ offer.location }}</span>
                <span class="mx-1">•</span>
                <span>⏱️ {{ offer.durationMonths }} mois</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  magneticBtn
                  (click)="detailOffer = offer"
                  class="px-3 py-1.5 text-xs font-bold rounded-xl btn-3d-glass">
                  Détails
                </button>
                <button
                  magneticBtn
                  (click)="openApplyModal(offer)"
                  class="px-3.5 py-1.5 text-xs font-black rounded-xl btn-3d-primary">
                  Postuler →
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Modal 3D Détail de l'Offre -->
      @if (detailOffer) {
        <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div tilt3d [tiltMaxAngle]="4" class="card-3d-glass rounded-3xl max-w-xl w-full p-6 sm:p-8">
            <div class="flex justify-between items-start gap-4 mb-4">
              <div>
                <span class="px-2.5 py-1 bg-indigo-50 border text-xs font-bold rounded-lg">
                  {{ detailOffer.departmentName }}
                </span>
                <h3 class="text-xl font-black text-white mt-2">{{ detailOffer.title }}</h3>
              </div>
              <button (click)="detailOffer = null" class="text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            <div class="grid grid-cols-3 gap-3 bg-[#05050A]/80 p-3.5 rounded-2xl border border-white/10 mb-4 text-xs">
              <div>
                <span class="text-slate-400 block">Localisation</span>
                <strong class="text-white">📍 {{ detailOffer.location }}</strong>
              </div>
              <div>
                <span class="text-slate-400 block">Durée du stage</span>
                <strong class="text-white">⏱️ {{ detailOffer.durationMonths }} mois</strong>
              </div>
              <div>
                <span class="text-slate-400 block">Démarrage prévu</span>
                <strong class="text-white">📅 {{ detailOffer.startDate || 'Immédiat' }}</strong>
              </div>
            </div>

            <h4 class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Description &amp; Missions</h4>
            <p class="text-sm text-slate-200 leading-relaxed mb-4">{{ detailOffer.description }}</p>

            <h4 class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Compétences recherchées</h4>
            <div class="flex flex-wrap gap-1.5 mb-6">
              @for (s of detailOffer.skills; track s) {
                <span class="px-2.5 py-1 bg-indigo-50 border text-xs font-bold rounded-lg">{{ s }}</span>
              }
            </div>

            <div class="flex justify-end gap-2.5 pt-4 border-t border-white/10">
              <button magneticBtn (click)="detailOffer = null" class="px-4 py-2 rounded-xl text-xs font-bold btn-3d-glass">
                Fermer
              </button>
              <button
                magneticBtn
                (click)="openApplyModal(detailOffer); detailOffer = null"
                class="px-5 py-2 rounded-xl text-xs font-black btn-3d-primary">
                Postuler à cette offre →
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modal 3D de Candidature (avec Upload CV & Lettre de motivation) -->
      @if (selectedOffer) {
        <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div tilt3d [tiltMaxAngle]="3" class="card-3d-glass rounded-3xl max-w-lg w-full p-6 sm:p-8 my-8">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-xl font-black text-white">Déposer ma candidature</h3>
              <button (click)="selectedOffer = null" class="text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            <p class="text-xs font-bold mb-4 bg-indigo-50 p-2.5 rounded-xl border">
              🎯 Offre : {{ selectedOffer.title }} ({{ selectedOffer.departmentName }})
            </p>

            @if (applySuccess) {
              <div class="bg-emerald-50 p-4 rounded-2xl text-xs font-semibold mb-4 border">
                🎉 Votre candidature et vos pièces jointes ont bien été transmises ! Elle apparaît désormais dans la colonne <strong>Nouveau</strong> du Pipeline Kanban RH.
              </div>
            }

            @if (validationError) {
              <div class="bg-rose-50 p-3 rounded-xl text-xs font-semibold mb-4 border">
                ⚠️ {{ validationError }}
              </div>
            }

            <form (ngSubmit)="submitApplication()" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Nom &amp; Prénom *</label>
                <input [(ngModel)]="applyForm.fullName" name="fullName" required class="w-full px-3 py-2 rounded-xl text-sm outline-none" placeholder="Ex: Yasmine El Idrissi">
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-300 mb-1">Email *</label>
                  <input [(ngModel)]="applyForm.email" name="email" type="email" required class="w-full px-3 py-2 rounded-xl text-sm outline-none" placeholder="yasmine@ecole.ma">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-300 mb-1">Téléphone *</label>
                  <input [(ngModel)]="applyForm.phone" name="phone" required class="w-full px-3 py-2 rounded-xl text-sm outline-none" placeholder="+212 600 11 22 33">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">École / Université *</label>
                <input [(ngModel)]="applyForm.school" name="school" required class="w-full px-3 py-2 rounded-xl text-sm outline-none" placeholder="Ex: ENSIAS, EMI, INPT, FST, UM6P...">
              </div>

              <!-- Upload CV (PDF) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="border border-dashed border-cyan-500/40 rounded-xl p-3 bg-[#05050A]/60">
                  <label class="block text-xs font-bold text-cyan-300 mb-1">📄 Téléverser CV (PDF)</label>
                  <input type="file" accept=".pdf,.doc,.docx" (change)="onCvFileSelected($event)" class="text-[11px] text-slate-400 w-full">
                  @if (uploadingCv) {
                    <p class="text-[10px] text-cyan-400 font-semibold mt-1">Téléversement en cours...</p>
                  } @else if (applyForm.cvUrl) {
                    <p class="text-[10px] text-emerald-400 font-bold mt-1">✓ Fichier CV joint</p>
                  }
                </div>

                <div class="border border-dashed border-white/20 rounded-xl p-3 bg-[#05050A]/60">
                  <label class="block text-xs font-bold text-slate-300 mb-1">✉️ Lettre de motivation</label>
                  <input type="file" accept=".pdf,.doc,.docx" (change)="onCoverLetterSelected($event)" class="text-[11px] text-slate-400 w-full">
                  @if (applyForm.coverLetterUrl) {
                    <p class="text-[10px] text-emerald-400 font-bold mt-1">✓ Lettre jointe</p>
                  }
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Motivation / Lien Portfolio ou GitHub</label>
                <textarea [(ngModel)]="applyForm.notes" name="notes" rows="2" class="w-full px-3 py-2 rounded-xl text-xs outline-none" placeholder="Présentez brièvement vos projets ou collez votre lien GitHub / LinkedIn..."></textarea>
              </div>

              <div class="flex justify-end gap-2.5 pt-3">
                <button magneticBtn type="button" (click)="selectedOffer = null" class="px-4 py-2 rounded-xl text-xs font-bold btn-3d-glass">
                  Annuler
                </button>
                <button magneticBtn type="submit" class="px-5 py-2 rounded-xl text-xs font-black btn-3d-primary">
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
