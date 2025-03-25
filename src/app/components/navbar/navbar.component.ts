import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { ApiService } from '@/app/services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  user: any = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getUser().subscribe({
      next: (data) => (this.user = data),
      error: () => (this.user = null),
    });
  }

  login() {
    window.location.href =
      'https://surfapi2.vercel.app/api/auth/signin/google';
  }

  logout() {
    window.location.href =
      'https://surfapi2.vercel.app/api/auth/signout?callbackUrl=https://surfapp2.vercel.app';
  }
}
