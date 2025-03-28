import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { ApiService } from '@/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-surf-spot-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
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

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  getStarRating(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }

  viewDetails(event: Event): void {
    event.preventDefault()
    event.stopPropagation()

    this.api.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate(["/spots", this.spot._id])
        } else {
          this.snackBar
            .open("Please log in to view spot details", "Login", {
              duration: 5000,
              panelClass: ["warning-snackbar"],
              horizontalPosition: "center",
              verticalPosition: "bottom",
            })
            .onAction()
            .subscribe(() => {
              window.location.href = "https://surfapi2.vercel.app/api/auth/signin/google"
            })
        }
      },
      error: (err) => {
        console.error("Error checking user:", err)
        this.snackBar.open("Something went wrong", "Close", {
          duration: 3000,
          panelClass: ["error-snackbar"],
        })
      },
    })
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