import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms"
import { MatExpansionModule } from "@angular/material/expansion"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { MatTooltipModule } from "@angular/material/tooltip"

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
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: "./filter-panel.component.html",
  styleUrls: ["./filter-panel.component.css"],
})
export class FilterPanelComponent implements OnInit {
  @Input() allRegions: string[] = []
  @Input() allCountries: string[] = []
  @Output() filtersChanged = new EventEmitter<FilterOptions>()

  panelOpenState = false
  activeFilterCount = 0

  difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"]
  waveTypes = ["Beach break", "Reef break", "Point break", "River mouth"]
  seasons = ["Spring", "Summer", "Fall", "Winter"]
  crowdFactors = ["Low", "Medium", "High"]

  // Direct references to form controls
  searchTermControl = new FormControl("")
  difficultyControl = new FormControl<string[]>([])
  waveTypeControl = new FormControl<string[]>([])
  regionControl = new FormControl<string[]>([])
  countryControl = new FormControl<string[]>([])
  seasonControl = new FormControl<string[]>([])
  crowdFactorControl = new FormControl<string[]>([])

  constructor() {}

  ngOnInit(): void {
    this.searchTermControl.valueChanges.subscribe(() => this.updateFilters())
    this.difficultyControl.valueChanges.subscribe(() => this.updateFilters())
    this.waveTypeControl.valueChanges.subscribe(() => this.updateFilters())
    this.regionControl.valueChanges.subscribe(() => this.updateFilters())
    this.countryControl.valueChanges.subscribe(() => this.updateFilters())
    this.seasonControl.valueChanges.subscribe(() => this.updateFilters())
    this.crowdFactorControl.valueChanges.subscribe(() => this.updateFilters())
  }

  updateFilters(): void {
    const filters: FilterOptions = {
      searchTerm: this.searchTermControl.value || "",
      difficulty: this.difficultyControl.value?.length ? this.difficultyControl.value : undefined,
      waveType: this.waveTypeControl.value?.length ? this.waveTypeControl.value : undefined,
      region: this.regionControl.value?.length ? this.regionControl.value : undefined,
      country: this.countryControl.value?.length ? this.countryControl.value : undefined,
      season: this.seasonControl.value?.length ? this.seasonControl.value : undefined,
      crowdFactor: this.crowdFactorControl.value?.length ? this.crowdFactorControl.value : undefined,
    }

    // Count active filters (excluding searchTerm)
    this.activeFilterCount = Object.keys(filters).filter(
      (key) => key !== "searchTerm" && filters[key as keyof FilterOptions] !== undefined,
    ).length

    // Add searchTerm if it exists
    if (filters.searchTerm) {
      this.activeFilterCount++
    }

    this.filtersChanged.emit(filters)
  }

  clearFilters(): void {
    this.searchTermControl.setValue("")
    this.difficultyControl.setValue([])
    this.waveTypeControl.setValue([])
    this.regionControl.setValue([])
    this.countryControl.setValue([])
    this.seasonControl.setValue([])
    this.crowdFactorControl.setValue([])

    this.updateFilters()
  }

  toggleFilterPanel(): void {
    this.panelOpenState = !this.panelOpenState
  }
}

