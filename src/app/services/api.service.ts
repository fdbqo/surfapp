import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"

@Injectable({ providedIn: "root" })
export class ApiService {
  private baseUrl = "https://surfapi2.vercel.app/api"

  constructor(private http: HttpClient) {}

  getSpots() {
    return this.http.get<any[]>(`${this.baseUrl}/spots`, { withCredentials: true })
  }

  getSpot(id: string) {
    return this.http.get<any>(`${this.baseUrl}/spots/${id}`, { withCredentials: true })
  }

  postSpot(data: any) {
    return this.http.post(`${this.baseUrl}/spots`, data, { withCredentials: true })
  }

  updateSpot(id: string, data: any, skipForecastUpdate = false): Observable<any> {
    // skipForecastUpdate as a query parameter
    let params = new HttpParams()
    if (skipForecastUpdate) {
      params = params.set("skipForecastUpdate", "true")
    }

    return this.http.put<any>(`${this.baseUrl}/spots/${id}`, data, {
      withCredentials: true,
      params: params,
    })
  }

  deleteSpot(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/spots/${id}`, { withCredentials: true })
  }

  postComment(data: any) {
    return this.http.post(`${this.baseUrl}/comments`, data, { withCredentials: true })
  }

  updateComment(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/comments/${id}`, data, { withCredentials: true })
  }

  deleteComment(id: string) {
    return this.http.delete(`${this.baseUrl}/comments/${id}`, { withCredentials: true })
  }

  getUser() {
    return this.http.get(`${this.baseUrl}/user`, { withCredentials: true })
  }

  logout() {
    return this.http.post(`${this.baseUrl}/auth/signout`, {}, { withCredentials: true })
  }
}

