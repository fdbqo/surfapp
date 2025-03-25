import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-surf-spot-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './surf-spot-list.component.html',
})
export class SurfSpotListComponent implements OnInit {
  spots: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getSpots().subscribe((data) => this.spots = data);
  }
}
