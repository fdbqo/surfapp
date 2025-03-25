import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://surfapi2.vercel.app/api';

  constructor(private http: HttpClient) {}

  getSpots() {
    return this.http.get<any[]>(`${this.baseUrl}/spots`);
  }

  postSpot(data: any) {
    return this.http.post(`${this.baseUrl}/spots`, data, { withCredentials: true });
  }

  postComment(data: any) {
    return this.http.post(`${this.baseUrl}/comments`, data, { withCredentials: true });
  }

  getUser() {
    return this.http.get(`${this.baseUrl}/user`, { withCredentials: true });
  }

  logout() {
    return this.http.post(`${this.baseUrl}/auth/signout`, {}, { withCredentials: true });
  }
}
