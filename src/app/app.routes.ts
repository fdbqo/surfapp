import { Routes } from '@angular/router';
import { SurfSpotListComponent } from './pages/surf-spot-list/surf-spot-list.component';
import { CreateSpotComponent } from './pages/create-spot/create-spot.component';
import { SpotDetailsComponent } from './pages/spot-details/spot-details.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: SurfSpotListComponent },
  { path: 'create', component: CreateSpotComponent, canActivate: [AuthGuard] },
  { path: 'spots/:id', canActivate: [AuthGuard], loadChildren: () => import('@/app/pages/spot-details/spot-details.component').then(m => m.SpotDetailsComponent) },
  { path: '**', redirectTo: '' }
];