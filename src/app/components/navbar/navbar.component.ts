import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  user: any = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getUser().subscribe({
      next: (data) => this.user = data,
      error: () => this.user = null
    });
  }

  login() {
    window.location.href = 'https://surfapi2.vercel.app/api/auth/signin/google?callbackUrl=https://surf-frontend.vercel.app';
  }
  

  logout() {
    this.api.logout().subscribe(() => window.location.reload());
  }
}
