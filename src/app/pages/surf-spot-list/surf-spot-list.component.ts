import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@/app/services/api.service';
import { SurfSpotCardComponent } from '../../components/surf-spot-card/surf-spot-card.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-surf-spot-list',
  standalone: true,
  imports: [CommonModule, SurfSpotCardComponent, MatSnackBarModule],
  templateUrl: './surf-spot-list.component.html',
  styleUrls: ['./surf-spot-list.component.css']
})
export class SurfSpotListComponent implements OnInit {
  spots: any[] = [];
  loading = true;
  user: any = null;
  isAdmin = false;

  constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadUser();
    this.loadSpots();
  }

  loadUser() {
    this.api.getUser().subscribe({
      next: (data) => {
        this.user = data;
        this.isAdmin = this.user?.role === 'admin';
      },
      error: () => {
        this.user = null;
        this.isAdmin = false;
      }
    });
  }

  loadSpots() {
    this.loading = true;
    this.api.getSpots().subscribe({
      next: (data) => {
        this.spots = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching surf spots:', err);
        this.loading = false;
        this.snackBar.open('Failed to load surf spots', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  onDeleteSpot(spotId: string) {
    this.api.deleteSpot(spotId).subscribe({
      next: () => {
        this.spots = this.spots.filter(spot => spot._id !== spotId);
        this.snackBar.open('Surf spot deleted successfully', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      },
      error: (err) => {
        console.error('Error deleting surf spot:', err);
        this.snackBar.open('Failed to delete surf spot', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }
}