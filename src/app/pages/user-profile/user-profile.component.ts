import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatDividerModule } from "@angular/material/divider"
import { RouterModule } from "@angular/router"
import { ApiService } from "@/app/services/api.service"

@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    RouterModule,
  ],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  user: any = null
  loading = true
  editMode = false
  allSpots: any[] = []
  userReviews: any[] = []
  recentActivity: any[] = []

  // Skill levels for dropdown
  skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"]

  // Wave preferences for dropdown
  wavePreferences = ["Beach break", "Reef break", "Point break", "River mouth"]

  // Seasons for dropdown
  seasons = ["Spring", "Summer", "Fall", "Winter"]

  profileForm = new FormGroup({
    displayName: new FormControl("", [Validators.required]),
    bio: new FormControl(""),
    location: new FormControl(""),
    skillLevel: new FormControl(""),
    preferredWaveTypes: new FormControl<string[]>([]),
    preferredSeasons: new FormControl<string[]>([]),
    showEmail: new FormControl(false),
    notificationsEnabled: new FormControl(true),
  })

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadUserProfile()
  }

  loadUserProfile(): void {
    this.loading = true
    this.api.getUser().subscribe({
      next: (data) => {
        this.user = data
        this.loading = false
      },
      error: (err) => {
        console.error("Error loading user profile:", err)
        this.loading = false
      },
    })
  }

  initializeForm(): void {
    if (this.user) {
      this.profileForm.patchValue({
        displayName: this.user.displayName || "",
        bio: this.user.bio || "",
        location: this.user.location || "",
        skillLevel: this.user.skillLevel || "",
        preferredWaveTypes: this.user.preferredWaveTypes || [],
        preferredSeasons: this.user.preferredSeasons || [],
        showEmail: this.user.showEmail || false,
        notificationsEnabled: this.user.notificationsEnabled !== false,
      })
    }
  }

  loadSpots(): void {
    this.api.getSpots().subscribe({
      next: (spots) => {
        this.allSpots = spots
      },
      error: (err) => {
        console.error("Error loading spots:", err)
      },
    })
  }

  

  toggleEditMode(): void {
    this.editMode = !this.editMode
    if (!this.editMode) {
      this.initializeForm()
    }
  }

 

  formatDate(date: string): string {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
}

