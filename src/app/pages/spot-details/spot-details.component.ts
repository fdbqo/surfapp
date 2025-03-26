import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatChipsModule } from "@angular/material/chips"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatTabsModule } from "@angular/material/tabs"
import { ApiService } from "../../services/api.service"
import { CommentSectionComponent } from "../../components/comment-section/comment-section.component"
import { SpotMapComponent } from "../../components/spot-map/spot-map.component"
import { ForecastDisplayComponent } from "../../components/forecast-display/forecast-display.component"
import { StormglassService } from "../../services/stormglass.service"

@Component({
  selector: "app-spot-details",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    CommentSectionComponent,
    SpotMapComponent,
    ForecastDisplayComponent,
  ],
  templateUrl: "./spot-details.component.html",
  styleUrls: ["./spot-details.component.css"],
})
export class SpotDetailsComponent implements OnInit {
  spotId = ""
  spot: any = null
  loading = true
  error: string | null = null
  user: any = null
  isAdmin = false
  commentForm: FormGroup
  activeTab = 0
  forecastData: any = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private stormglassService: StormglassService,
  ) {
    this.commentForm = this.fb.group({
      text: ["", [Validators.required, Validators.minLength(3)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    })
  }

  ngOnInit(): void {
    this.spotId = this.route.snapshot.paramMap.get("id") || ""

    if (!this.spotId) {
      this.router.navigate(["/"])
      return
    }

    this.loadUser()
    this.loadSpotDetails()
  }

  loadUser(): void {
    this.api.getUser().subscribe({
      next: (data) => {
        this.user = data
        this.isAdmin = this.user?.role === "admin"
      },
      error: () => {
        this.user = null
        this.isAdmin = false
        // Redirect to login if not authenticated
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: `/spots/${this.spotId}` },
        })
      },
    })
  }

  loadSpotDetails(): void {
    this.loading = true
    this.error = null

    this.api.getSpot(this.spotId).subscribe({
      next: (data) => {
        this.spot = data
        this.loading = false
        this.processForecastData()
      },
      error: (err) => {
        console.error("Error loading spot details:", err)
        this.error = "Failed to load spot details. Please try again."
        this.loading = false
      },
    })
  }

  submitComment(): void {
    if (this.commentForm.invalid) {
      return
    }

    const comment = {
      ...this.commentForm.value,
      spotId: this.spotId,
    }

    this.api.postComment(comment).subscribe({
      next: (response) => {
        // Add the new comment to the spot's comments array
        if (!this.spot.comments) {
          this.spot.comments = []
        }

        this.spot.comments.unshift({
          ...response,
          user: this.user,
          createdAt: new Date().toISOString(),
        })

        // Reset the form
        this.commentForm.reset({
          text: "",
          rating: 5,
        })

        this.snackBar.open("Comment posted successfully!", "Close", {
          duration: 3000,
          panelClass: "success-snackbar",
        })
      },
      error: (err) => {
        console.error("Error posting comment:", err)
        this.snackBar.open("Failed to post comment. Please try again.", "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
      },
    })
  }

  deleteSpot(): void {
    if (confirm(`Are you sure you want to delete ${this.spot.name}?`)) {
      this.api.deleteSpot(this.spotId).subscribe({
        next: () => {
          this.snackBar.open("Surf spot deleted successfully!", "Close", {
            duration: 3000,
            panelClass: "success-snackbar",
          })
          this.router.navigate(["/"])
        },
        error: (err) => {
          console.error("Error deleting spot:", err)
          this.snackBar.open("Failed to delete spot. Please try again.", "Close", {
            duration: 3000,
            panelClass: "error-snackbar",
          })
        },
      })
    }
  }

  getStarRating(rating: number): string {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating))
  }

  setActiveTab(index: number): void {
    this.activeTab = index
  }

  // Forecast-related methods
  processForecastData(): void {
    if (this.spot && this.spot.forecast && this.spot.forecast.data) {
      this.forecastData = this.formatForecastData(this.spot.forecast.data)
    }
  }

  formatForecastData(rawData: any): any {
    if (!rawData || !rawData.hours) {
      return null
    }

    // Group data by day
    const dailyForecasts: Array<{ date: string; dayOfWeek: string; hours: Array<{ time: string; waveHeight?: number; wavePeriod?: number; windSpeed?: number; windDirection?: number; swellDirection?: number; waterTemperature?: number }> }> = []
    const days = new Map()

    rawData.hours.forEach((hour: any) => {
      const date = new Date(hour.time)
      const dayKey = date.toDateString()

      if (!days.has(dayKey)) {
        days.set(dayKey, {
          date: new Date(date).toLocaleDateString(),
          dayOfWeek: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
          hours: [],
        })
      }

      const hourData = {
        time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        waveHeight: hour.waveHeight?.noaa,
        wavePeriod: hour.wavePeriod?.noaa,
        windSpeed: hour.windSpeed?.noaa,
        windDirection: hour.windDirection?.noaa,
        swellDirection: hour.swellDirection?.noaa,
        waterTemperature: hour.waterTemperature?.noaa,
      }

      days.get(dayKey).hours.push(hourData)
    })

    // Convert map to array and sort by date
    days.forEach((day) => {
      dailyForecasts.push(day)
    })

    dailyForecasts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return {
      days: dailyForecasts,
      lastUpdated: this.spot.forecast.lastFetched || new Date(),
    }
  }

  getLastUpdatedText(): string {
    if (!this.spot || !this.spot.forecast || !this.spot.forecast.lastFetched) {
      return "Never"
    }

    const lastFetched = new Date(this.spot.forecast.lastFetched)
    const now = new Date()
    const diffMs = now.getTime() - lastFetched.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else {
      return `${diffDays} days ago`
    }
  }
}

