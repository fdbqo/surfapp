import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-surf-spot-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './surf-spot-card.component.html',
  styleUrls: ['./surf-spot-card.component.css']
})
export class SurfSpotCardComponent {
  @Input() spot: any = {
    name: '',
    region: '',
    country: '',
    description: '',
    difficulty: '',
    waveType: '',
    swellDirection: '',
    windDirection: '',
    tide: '',
    crowdFactor: '',
    season: [],
    imageUrl: '',
    rating: 0
  };
  
  @Input() isPreview: boolean = false;

  getStarRating(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }
}