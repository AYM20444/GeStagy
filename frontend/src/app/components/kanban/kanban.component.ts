import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from '../../services/api.service';
import { Candidate } from '../../models/types';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Pipeline de Recrutement</h1>
          <p class="text-sm text-slate-500">Glissez-déposez les candidats pour mettre à jour leur progression</p>
        </div>
        <div class="flex items-center gap-2 text-xs font-semibold">
          <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <span class="text-slate-600">Drag & Drop activé</span>
        </div>
      </div>

      <!-- Kanban Columns Container -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">

        <!-- Column: NEW -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col min-h-[500px]">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-sky-500"></span>
              Nouveau ({{ newCandidates.length }})
            </h3>
          </div>
          
          <div 
            cdkDropList 
            #newList="cdkDropList" 
            [cdkDropListData]="newCandidates"
            [cdkDropListConnectedTo]="[screeningList, interviewList, acceptedList]"
            (cdkDropListDropped)="drop($event, 'NEW')"
            class="flex-1 space-y-3">
            @for (c of newCandidates; track c.id) {
              <div cdkDrag class="bg-white p-4 rounded-xl shadow-xs border border-slate-200 hover:shadow-md cursor-grab active:cursor-grabbing transition">
                <div class="flex justify-between items-start mb-1">
                  <span class="text-[11px] font-bold text-indigo-600">{{ c.school }}</span>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Score: {{ c.score }}%</span>
                </div>
                <h4 class="text-sm font-bold text-slate-900">{{ c.fullName }}</h4>
                <p class="text-xs text-slate-500 line-clamp-1 mb-2">{{ c.offerTitle }}</p>
                <div class="text-[11px] text-slate-400">📞 {{ c.phone }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Column: SCREENING -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col min-h-[500px]">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              Présélection ({{ screeningCandidates.length }})
            </h3>
          </div>

          <div 
            cdkDropList 
            #screeningList="cdkDropList" 
            [cdkDropListData]="screeningCandidates"
            [cdkDropListConnectedTo]="[newList, interviewList, acceptedList]"
            (cdkDropListDropped)="drop($event, 'SCREENING')"
            class="flex-1 space-y-3">
            @for (c of screeningCandidates; track c.id) {
              <div cdkDrag class="bg-white p-4 rounded-xl shadow-xs border border-slate-200 hover:shadow-md cursor-grab active:cursor-grabbing transition">
                <div class="flex justify-between items-start mb-1">
                  <span class="text-[11px] font-bold text-amber-600">{{ c.school }}</span>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">Score: {{ c.score }}%</span>
                </div>
                <h4 class="text-sm font-bold text-slate-900">{{ c.fullName }}</h4>
                <p class="text-xs text-slate-500 line-clamp-1 mb-2">{{ c.offerTitle }}</p>
                <p class="text-[11px] text-slate-400">📞 {{ c.phone }}</p>
              </div>
            }
          </div>
        </div>

        <!-- Column: INTERVIEW -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col min-h-[500px]">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-purple-500"></span>
              Entretien ({{ interviewCandidates.length }})
            </h3>
          </div>

          <div 
            cdkDropList 
            #interviewList="cdkDropList" 
            [cdkDropListData]="interviewCandidates"
            [cdkDropListConnectedTo]="[newList, screeningList, acceptedList]"
            (cdkDropListDropped)="drop($event, 'INTERVIEW')"
            class="flex-1 space-y-3">
            @for (c of interviewCandidates; track c.id) {
              <div cdkDrag class="bg-white p-4 rounded-xl shadow-xs border border-slate-200 hover:shadow-md cursor-grab active:cursor-grabbing transition">
                <div class="flex justify-between items-start mb-1">
                  <span class="text-[11px] font-bold text-purple-600">{{ c.school }}</span>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">Score: {{ c.score }}%</span>
                </div>
                <h4 class="text-sm font-bold text-slate-900">{{ c.fullName }}</h4>
                <p class="text-xs text-slate-500 line-clamp-1 mb-2">{{ c.offerTitle }}</p>
                <p class="text-[11px] text-slate-400">📅 Entretien planifié</p>
              </div>
            }
          </div>
        </div>

        <!-- Column: ACCEPTED -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col min-h-[500px]">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              Accepté ({{ acceptedCandidates.length }})
            </h3>
          </div>

          <div 
            cdkDropList 
            #acceptedList="cdkDropList" 
            [cdkDropListData]="acceptedCandidates"
            [cdkDropListConnectedTo]="[newList, screeningList, interviewList]"
            (cdkDropListDropped)="drop($event, 'ACCEPTED')"
            class="flex-1 space-y-3">
            @for (c of acceptedCandidates; track c.id) {
              <div cdkDrag class="bg-white p-4 rounded-xl shadow-xs border border-emerald-200 hover:shadow-md cursor-grab active:cursor-grabbing transition">
                <div class="flex justify-between items-start mb-1">
                  <span class="text-[11px] font-bold text-emerald-600">{{ c.school }}</span>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">Stage Validé</span>
                </div>
                <h4 class="text-sm font-bold text-slate-900">{{ c.fullName }}</h4>
                <p class="text-xs text-slate-500 line-clamp-1 mb-2">{{ c.offerTitle }}</p>
                <p class="text-[11px] text-emerald-600 font-medium">✨ Convention en édition</p>
              </div>
            }
          </div>
        </div>

      </div>

    </div>
  `
})
export class KanbanComponent implements OnInit {
  newCandidates: Candidate[] = [];
  screeningCandidates: Candidate[] = [];
  interviewCandidates: Candidate[] = [];
  acceptedCandidates: Candidate[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.api.getAllCandidates().subscribe({
      next: (candidates) => {
        this.newCandidates = candidates.filter(c => c.status === 'NEW');
        this.screeningCandidates = candidates.filter(c => c.status === 'SCREENING');
        this.interviewCandidates = candidates.filter(c => c.status === 'INTERVIEW');
        this.acceptedCandidates = candidates.filter(c => c.status === 'ACCEPTED');
      },
      error: () => {
        // Jeu de données initial
        this.newCandidates = [
          { id: 1, offerId: 1, offerTitle: 'Stagiaire Développeur FullStack', departmentName: 'Tech', fullName: 'Sophia El Fassi', email: 'sophia@test.com', phone: '+212 600 112233', school: 'ENSIAS', status: 'NEW', score: 85, createdAt: '' },
          { id: 2, offerId: 1, offerTitle: 'Stagiaire Développeur FullStack', departmentName: 'Tech', fullName: 'Karim Haddad', email: 'karim@test.com', phone: '+212 611 223344', school: 'EMI', status: 'NEW', score: 78, createdAt: '' }
        ];
        this.screeningCandidates = [
          { id: 3, offerId: 1, offerTitle: 'Stagiaire Développeur FullStack', departmentName: 'Tech', fullName: 'Salma Bennani', email: 'salma@test.com', phone: '+212 622 334455', school: 'INPT', status: 'SCREENING', score: 88, createdAt: '' }
        ];
        this.interviewCandidates = [
          { id: 4, offerId: 1, offerTitle: 'Stagiaire Développeur FullStack', departmentName: 'Tech', fullName: 'Ayoub Chraibi', email: 'ayoub@test.com', phone: '+212 633 445566', school: 'FST Fès', status: 'INTERVIEW', score: 92, createdAt: '' }
        ];
        this.acceptedCandidates = [
          { id: 5, offerId: 1, offerTitle: 'Stagiaire Développeur FullStack', departmentName: 'Tech', fullName: 'Nour Alami', email: 'nour@test.com', phone: '+212 644 556677', school: 'EHTP', status: 'ACCEPTED', score: 95, createdAt: '' }
        ];
      }
    });
  }

  drop(event: CdkDragDrop<Candidate[]>, newStatus: 'NEW' | 'SCREENING' | 'INTERVIEW' | 'ACCEPTED') {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      item.status = newStatus;
      this.api.updateCandidateStatus(item.id, newStatus).subscribe({
        next: () => {},
        error: () => console.log('Statut mis à jour localement')
      });
    }
  }
}

