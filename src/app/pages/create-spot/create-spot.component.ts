import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ApiService } from "../../services/api.service"
import { Router } from "@angular/router"
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatTabsModule } from "@angular/material/tabs"
import { MatDividerModule } from "@angular/material/divider"
import { SurfSpotCardComponent } from "../../components/surf-spot-card/surf-spot-card.component"

@Component({
  selector: "app-create-spot",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    SurfSpotCardComponent,
  ],
  templateUrl: "./create-spot.component.html",
  styleUrls: ["./create-spot.component.css"],
})
export class CreateSpotComponent {
  form = this.fb.group({
    name: ["", Validators.required],
    description: [""],
    country: [""],
    region: [""],
    waveType: [""],
    swellDirection: [""],
    tide: [""],
    windDirection: [""],
    difficulty: ["Intermediate"],
    season: [[]],
    crowdFactor: ["Medium"],
    lat: [0],
    lng: [0],
    imageUrl: [""],
  })

  previewSpot: any = {}
  isSubmitting = false

  waveTypes = ["Reef break", "Beach break", "Point break"]
  swellDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  tides = ["Low", "Mid", "High"]
  windDirections = ["Offshore", "Onshore", "Cross-shore"]
  difficulties = ["Beginner", "Intermediate", "Advanced"]
  crowdFactors = ["Low", "Medium", "High"]
  seasons = ["Spring", "Summer", "Fall", "Winter"]

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
  ) {
    // Initialize preview with form values
    this.updatePreview()

    // Subscribe to form value changes to update preview
    this.form.valueChanges.subscribe(() => {
      this.updatePreview()
    })
  }

  updatePreview() {
    this.previewSpot = {
      ...this.form.value,
      location: {
        lat: this.form.value.lat,
        lng: this.form.value.lng,
      },
    }
  }

  submit() {
    if (this.form.valid) {
      this.isSubmitting = true

      const spot = {
        ...this.form.value,
        location: {
          lat: this.form.value.lat,
          lng: this.form.value.lng,
        },
      }

      // Log the data being sent to help with debugging
      console.log("Submitting spot data:", spot)

      this.api.postSpot(spot).subscribe({
        next: (response) => {
          this.isSubmitting = false
          console.log("Spot created successfully:", response)
          alert("Surf spot created successfully!")
          this.router.navigateByUrl("/")
        },
        error: (error) => {
          this.isSubmitting = false
          console.error("Error creating surf spot:", error)
          alert(`Failed to create surf spot: ${error.error?.error || "Unknown error"}`)
        },
      })
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched()
      })
    }
  }
}

