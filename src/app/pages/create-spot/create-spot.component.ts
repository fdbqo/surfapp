import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule, ActivatedRoute } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatChipsModule } from "@angular/material/chips"
import { MatIconModule } from "@angular/material/icon"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { MatTabsModule } from "@angular/material/tabs"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatDividerModule } from "@angular/material/divider"
import { SurfSpotCardComponent } from "@/app/components/surf-spot-card/surf-spot-card.component"
import { ApiService } from "@/app/services/api.service"

// Define user interface to fix the 'role' property error
interface User {
  _id: string
  name: string
  email: string
  image?: string
  role: string
}

@Component({
  selector: "app-create-spot",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    SurfSpotCardComponent,
  ],
  templateUrl: "./create-spot.component.html",
  styleUrls: ["./create-spot.component.css"],
})
export class CreateSpotComponent implements OnInit {
  spotForm: FormGroup
  seasons: string[] = ["Spring", "Summer", "Fall", "Winter"]
  selectedSeasons: string[] = []
  isEditMode = false
  spotId = ""
  pageTitle = "Create New Surf Spot"
  submitButtonText = "Create Spot"
  previewSpot: any = {}
  isSubmitting = false

  waveTypes = ["Beach break", "Reef break", "Point break", "River mouth"]
  swellDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  tides = ["Low", "Mid", "High", "All"]
  windDirections = ["Offshore", "Onshore", "Cross-shore"]
  difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"]
  crowdFactors = ["Low", "Medium", "High"]

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.spotForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      description: [""],
      imageUrl: [""],
      region: ["", Validators.required],
      country: ["", Validators.required],
      difficulty: ["Intermediate"],
      waveType: ["Beach break"],
      swellDirection: [""],
      windDirection: [""],
      tide: ["All"],
      crowdFactor: ["Medium"],
      location: this.fb.group({
        lat: [null],
        lng: [null],
      }),
    })
  }

  ngOnInit(): void {
    // Check if user is authenticated
    this.api.getUser().subscribe({
      next: (user: any) => {
        // Type assertion to fix the 'role' property error
        const typedUser = user as User

        // Check if user is admin for edit mode
        if (typedUser.role !== "admin") {
          this.snackBar.open("Only admins can edit surf spots", "Close", {
            duration: 5000,
            panelClass: "error-snackbar",
          })
          this.router.navigate(["/"])
        }
      },
      error: () => {
        // Redirect to login if not authenticated
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: this.isEditMode ? `/edit/${this.spotId}` : "/create-spot" },
        })
      },
    })

    // Check if we're in edit mode by looking for an ID in the route
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true
        this.spotId = params["id"]
        this.pageTitle = "Edit Surf Spot"
        this.submitButtonText = "Update Spot"
        this.loadSpotData()
      }
    })

    // Subscribe to form value changes to update preview
    this.spotForm.valueChanges.subscribe(() => {
      this.updatePreview()
    })
  }

  loadSpotData(): void {
    this.api.getSpot(this.spotId).subscribe({
      next: (spot) => {
        // Populate the form with the spot data
        this.spotForm.patchValue({
          name: spot.name,
          description: spot.description || "",
          imageUrl: spot.imageUrl || "",
          region: spot.region,
          country: spot.country,
          difficulty: spot.difficulty,
          waveType: spot.waveType,
          swellDirection: spot.swellDirection || "",
          windDirection: spot.windDirection || "",
          tide: spot.tide,
          crowdFactor: spot.crowdFactor,
          location: {
            lat: spot.location?.lat || null,
            lng: spot.location?.lng || null,
          },
        })

        // Set selected seasons
        this.selectedSeasons = spot.season || []

        // Update preview
        this.updatePreview()
      },
      error: (err: any) => {
        console.error("Error loading surf spot:", err)
        this.snackBar.open("Failed to load surf spot data", "Close", {
          duration: 5000,
          panelClass: "error-snackbar",
        })
        this.router.navigate(["/"])
      },
    })
  }

  toggleSeason(season: string): void {
    const index = this.selectedSeasons.indexOf(season)
    if (index === -1) {
      this.selectedSeasons.push(season)
    } else {
      this.selectedSeasons.splice(index, 1)
    }
    this.updatePreview()
  }

  isSeasonSelected(season: string): boolean {
    return this.selectedSeasons.includes(season)
  }

  updatePreview(): void {
    this.previewSpot = {
      ...this.spotForm.value,
      season: this.selectedSeasons,
    }
  }

  onSubmit(): void {
    if (this.spotForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.spotForm.controls).forEach((key) => {
        const control = this.spotForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    this.isSubmitting = true
    const spotData = {
      ...this.spotForm.value,
      season: this.selectedSeasons,
    }

    // Different API call based on whether we're creating or editing
    const apiCall = this.isEditMode ? this.api.updateSpot(this.spotId, spotData) : this.api.postSpot(spotData) // Changed from createSpot to postSpot to match your API service

    apiCall.subscribe({
      next: (response: any) => {
        this.isSubmitting = false
        const message = this.isEditMode ? "Surf spot updated successfully!" : "Surf spot created successfully!"

        this.snackBar.open(message, "Close", {
          duration: 3000,
          panelClass: "success-snackbar",
        })
        this.router.navigate(["/spots", response._id])
      },
      error: (err: any) => {
        this.isSubmitting = false
        console.error(this.isEditMode ? "Error updating surf spot:" : "Error creating surf spot:", err)
        this.snackBar.open(
          err.error?.error || `Failed to ${this.isEditMode ? "update" : "create"} surf spot. Please try again.`,
          "Close",
          {
            duration: 5000,
            panelClass: "error-snackbar",
          },
        )
      },
    })
  }
}

