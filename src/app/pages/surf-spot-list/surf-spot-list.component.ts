import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@/app/services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-surf-spot-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatChipsModule, 
    MatButtonModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './surf-spot-list.component.html',
  styleUrls: ['./surf-spot-list.component.css']
})
export class SurfSpotListComponent implements OnInit {
  spots: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getSpots().subscribe({
      next: (data) => {
        this.spots = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching surf spots:', err);
        this.loading = false;
      }
    });
  }

  getStarRating(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }
}