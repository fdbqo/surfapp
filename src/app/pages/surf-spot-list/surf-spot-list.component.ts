import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { ApiService } from "@/app/services/api.service"
import { SurfSpotCardComponent } from "../../components/surf-spot-card/surf-spot-card.component"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { FilterPanelComponent, type FilterOptions } from "../../components/filter-panel/filter-panel.component"

@Component({
  selector: "app-surf-spot-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SurfSpotCardComponent,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    FilterPanelComponent,
  ],
  templateUrl: "./surf-spot-list.component.html",
  styleUrls: ["./surf-spot-list.component.css"],
})
export class SurfSpotListComponent implements OnInit {
  allSpots: any[] = []
  filteredSpots: any[] = []
  loading = true
  user: any = null
  isAdmin = false

  // For filter component
  allRegions: string[] = []
  allCountries: string[] = []

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadUser()
    this.loadSpots()
  }

  loadUser() {
    this.api.getUser().subscribe({
      next: (data) => {
        this.user = data
        this.isAdmin = this.user?.role === "admin"
      },
      error: () => {
        this.user = null
        this.isAdmin = false
      },
    })
  }

  loadSpots() {
    this.loading = true
    this.api.getSpots().subscribe({
      next: (data) => {
        this.allSpots = data
        this.filteredSpots = [...data]
        this.extractFilterOptions()
        this.loading = false
      },
      error: (err) => {
        console.error("Error fetching surf spots:", err)
        this.loading = false
        this.snackBar.open("Failed to load surf spots", "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
      },
    })
  }

  extractFilterOptions() {
    // Extract unique regions and countries for filter dropdowns
    const regions = new Set<string>()
    const countries = new Set<string>()

    this.allSpots.forEach((spot) => {
      if (spot.region) regions.add(spot.region)
      if (spot.country) countries.add(spot.country)
    })

    this.allRegions = Array.from(regions).sort()
    this.allCountries = Array.from(countries).sort()
  }

  applyFilters(filters: FilterOptions) {
    // Start with all spots
    let result = [...this.allSpots]

    // Apply search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      result = result.filter(
        (spot) =>
          spot.name.toLowerCase().includes(searchTerm) ||
          (spot.description && spot.description.toLowerCase().includes(searchTerm)),
      )
    }

    // Apply difficulty filter
    if (filters.difficulty && filters.difficulty.length > 0) {
      result = result.filter((spot) => spot.difficulty && filters.difficulty?.includes(spot.difficulty))
    }

    // Apply wave type filter
    if (filters.waveType && filters.waveType.length > 0) {
      result = result.filter((spot) => spot.waveType && filters.waveType?.includes(spot.waveType))
    }

    // Apply region filter
    if (filters.region && filters.region.length > 0) {
      result = result.filter((spot) => spot.region && filters.region?.includes(spot.region))
    }

    // Apply country filter
    if (filters.country && filters.country.length > 0) {
      result = result.filter((spot) => spot.country && filters.country?.includes(spot.country))
    }

    // Apply minimum rating filter
    if (filters.minRating !== undefined && filters.minRating > 0) {
      result = result.filter((spot) => spot.rating && spot.rating >= (filters.minRating ?? 0))
    }

    // Apply season filter
    if (filters.season && filters.season.length > 0) {
      result = result.filter((spot) => spot.season && spot.season.some((s: string) => filters.season?.includes(s)))
    }

    // Apply crowd factor filter
    if (filters.crowdFactor && filters.crowdFactor.length > 0) {
      result = result.filter((spot) => spot.crowdFactor && filters.crowdFactor?.includes(spot.crowdFactor))
    }

    this.filteredSpots = result
  }

  onDeleteSpot(spotId: string) {
    this.api.deleteSpot(spotId).subscribe({
      next: () => {
        // Remove from both arrays
        this.allSpots = this.allSpots.filter((spot) => spot._id !== spotId)
        this.filteredSpots = this.filteredSpots.filter((spot) => spot._id !== spotId)

        this.snackBar.open("Surf spot deleted successfully", "Close", {
          duration: 3000,
          panelClass: "success-snackbar",
        })
      },
      error: (err) => {
        console.error("Error deleting surf spot:", err)
        this.snackBar.open("Failed to delete surf spot", "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
      },
    })
  }

  refreshSpots() {
    this.loadSpots()
    this.snackBar.open("Surf spots refreshed", "Close", {
      duration: 3000,
    })
  }
}

