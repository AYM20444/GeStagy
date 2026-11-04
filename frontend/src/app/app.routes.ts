import { Routes } from '@angular/router';
import { OffersComponent } from './components/offers/offers.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { InternSpaceComponent } from './components/intern-space/intern-space.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', component: OffersComponent },
  { path: 'offres', component: OffersComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'kanban', component: KanbanComponent },
  { path: 'espace-stagiaire', component: InternSpaceComponent },
  { path: 'connexion', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
