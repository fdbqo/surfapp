import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@/app/services/api.service';
import { SurfSpotCardComponent } from '@/app/components/surf-spot-card/surf-spot-card.component';

@Component({
  selector: 'app-surf-spot-list',
  standalone: true,
  imports: [CommonModule, SurfSpotCardComponent],
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
}