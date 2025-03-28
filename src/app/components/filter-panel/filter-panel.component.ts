import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from "@angular/forms"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatBadgeModule } from "@angular/material/badge"
import { MatRippleModule } from "@angular/material/core"

export interface FilterOptions {
  searchTerm?: string
  difficulty?: string[]
  waveType?: string[]
  region?: string[]
  country?: string[]
  season?: string[]
  crowdFactor?: string[]
}

@Component({
  selector: "app-filter-panel",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatBadgeModule,
    MatRippleModule,
  ],
  templateUrl: "./filter-panel.component.html",
  styleUrls: ["./filter-panel.component.css"],
})
export class FilterPanelComponent implements OnInit {
  @Input() allRegions: string[] = []
  @Input() allCountries: string[] = []
  @Output() filtersChanged = new EventEmitter<FilterOptions>()

  filterExpanded = false
  activeFilterCount = 0
  mobileView = false

  difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"]
  waveTypes = ["Beach break", "Reef break", "Point break", "River mouth"]
  seasons = ["Spring", "Summer", "Fall", "Winter"]
  crowdFactors = ["Low", "Medium", "High"]

  filterForm = new FormGroup({
    searchTerm: new FormControl(""),
    difficulty: new FormControl<string[]>([]),
    waveType: new FormControl<string[]>([]),
    region: new FormControl<string[]>([]),
    country: new FormControl<string[]>([]),
    season: new FormControl<string[]>([]),
    crowdFactor: new FormControl<string[]>([]),
  })

  constructor() {
    // Check if mobile view on init and window resize
    this.checkMobileView()
    window.addEventListener("resize", () => {
      this.checkMobileView()
    })
  }

  ngOnInit(): void {
    // Subscribe to form value changes
    this.filterForm.valueChanges.subscribe(() => {
      this.updateFilters()
    })
  }

  checkMobileView(): void {
    this.mobileView = window.innerWidth < 768
  }

  updateFilters(): void {
    const formValues = this.filterForm.value

    const filters: FilterOptions = {
      searchTerm: formValues.searchTerm || "",
      difficulty: formValues.difficulty?.length ? formValues.difficulty : undefined,
      waveType: formValues.waveType?.length ? formValues.waveType : undefined,
      region: formValues.region?.length ? formValues.region : undefined,
      country: formValues.country?.length ? formValues.country : undefined,
      season: formValues.season?.length ? formValues.season : undefined,
      crowdFactor: formValues.crowdFactor?.length ? formValues.crowdFactor : undefined,
    }

    // Count active filters (excluding empty searchTerm)
    this.activeFilterCount = Object.keys(filters).filter(
      (key) => key !== "searchTerm" && filters[key as keyof FilterOptions] !== undefined,
    ).length

    // Add searchTerm if it exists and is not empty
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      this.activeFilterCount++
    }

    this.filtersChanged.emit(filters)
  }

  clearFilters(): void {
    this.filterForm.reset({
      searchTerm: "",
      difficulty: [],
      waveType: [],
      region: [],
      country: [],
      season: [],
      crowdFactor: [],
    })

    this.updateFilters()
  }

  toggleFilterPanel(): void {
    this.filterExpanded = !this.filterExpanded
  }

  getActiveCount(filterName: string): number {
    const value = this.filterForm.get(filterName)?.value
    return Array.isArray(value) ? value.length : 0
  }
}

