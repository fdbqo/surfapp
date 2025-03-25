import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-surf-spot-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule
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
  @Input() isAdmin: boolean = false;
  
  @Output() deleteSpot = new EventEmitter<string>();

  constructor(private dialog: MatDialog) {}

  getStarRating(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }
  
  confirmDelete(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '350px',
      data: { spotName: this.spot.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteSpot.emit(this.spot._id);
      }
    });
  }
}