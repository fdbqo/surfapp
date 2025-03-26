import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl = 'https://surfapi2.vercel.app/api';

  constructor(private http: HttpClient) {}

  // User methods
  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/user`)
  }

  // Surf spot methods
  getSpots(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/spots`)
  }

  getSpot(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/spots/${id}`)
  }

  createSpot(spotData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/spots`, spotData)
  }

  updateSpot(id: string, spotData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/spots/${id}`, spotData)
  }

  deleteSpot(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/spots/${id}`)
  }

  // Comment methods
  getComments(spotId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/comments?spotId=${spotId}`)
  }

  postComment(commentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/comments`, commentData)
  }

  updateComment(id: string, commentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/comments/${id}`, commentData)
  }

  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/comments/${id}`)
  }

  // Favorite methods
  getFavorites(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/favorites`)
  }

  toggleFavorite(spotId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/favorites`, { spotId })
  }
}

