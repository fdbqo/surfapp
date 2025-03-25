import { Routes } from '@angular/router';
import { SurfSpotListComponent } from './pages/surf-spot-list/surf-spot-list.component';
import { CreateSpotComponent } from './pages/create-spot/create-spot.component';

export const routes: Routes = [
  { path: '', component: SurfSpotListComponent },
  { path: 'create', component: CreateSpotComponent },
];
