import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, FormControl } from "@angular/forms"
import { MatExpansionModule } from "@angular/material/expansion"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatChipsModule } from "@angular/material/chips"
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
    MatCheckboxModule,
    MatChipsModule,
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

  filterForm: FormGroup
  panelOpenState = false
  activeFilterCount = 0

  difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"]
  waveTypes = ["Beach break", "Reef break", "Point break", "River mouth"]
  seasons = ["Spring", "Summer", "Fall", "Winter"]
  crowdFactors = ["Low", "Medium", "High"]

  // Direct references to form controls
  searchTermControl = new FormControl("")
  regionControl = new FormControl<string[]>([])
  countryControl = new FormControl<string[]>([])

  // Form groups for checkbox groups
  difficultyGroup: FormGroup
  waveTypeGroup: FormGroup
  seasonGroup: FormGroup
  crowdFactorGroup: FormGroup

  constructor(private fb: FormBuilder) {
    // Initialize checkbox form groups
    this.difficultyGroup = this.fb.group({
      Beginner: [false],
      Intermediate: [false],
      Advanced: [false],
      Expert: [false],
    })

    this.waveTypeGroup = this.fb.group({
      "Beach break": [false],
      "Reef break": [false],
      "Point break": [false],
      "River mouth": [false],
    })

    this.seasonGroup = this.fb.group({
      Spring: [false],
      Summer: [false],
      Fall: [false],
      Winter: [false],
    })

    this.crowdFactorGroup = this.fb.group({
      Low: [false],
      Medium: [false],
      High: [false],
    })

    // Create the main form group
    this.filterForm = this.fb.group({
      searchTerm: this.searchTermControl,
      difficulty: this.difficultyGroup,
      waveType: this.waveTypeGroup,
      region: this.regionControl,
      country: this.countryControl,
      season: this.seasonGroup,
      crowdFactor: this.crowdFactorGroup,
    })
  }

  ngOnInit(): void {
    // Subscribe to form value changes
    this.filterForm.valueChanges.subscribe(() => {
      this.updateFilters()
    })
  }

  updateFilters(): void {
    const formValues = this.filterForm.value

    // Process checkbox groups into arrays
    const difficultyValues = Object.keys(formValues.difficulty || {}).filter((key) => formValues.difficulty?.[key])
    const waveTypeValues = Object.keys(formValues.waveType || {}).filter((key) => formValues.waveType?.[key])
    const seasonValues = Object.keys(formValues.season || {}).filter((key) => formValues.season?.[key])
    const crowdFactorValues = Object.keys(formValues.crowdFactor || {}).filter((key) => formValues.crowdFactor?.[key])

    const filters: FilterOptions = {
      searchTerm: formValues.searchTerm || "",
      difficulty: difficultyValues.length > 0 ? difficultyValues : undefined,
      waveType: waveTypeValues.length > 0 ? waveTypeValues : undefined,
      region: formValues.region?.length > 0 ? formValues.region : undefined,
      country: formValues.country?.length > 0 ? formValues.country : undefined,
      season: seasonValues.length > 0 ? seasonValues : undefined,
      crowdFactor: crowdFactorValues.length > 0 ? crowdFactorValues : undefined,
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
    // Reset all form controls
    this.searchTermControl.setValue("")
    this.regionControl.setValue([])
    this.countryControl.setValue([])

    // Reset all checkbox groups
    this.difficulties.forEach((level) => {
      this.difficultyGroup.get(level)?.setValue(false)
    })

    this.waveTypes.forEach((type) => {
      this.waveTypeGroup.get(type)?.setValue(false)
    })

    this.seasons.forEach((season) => {
      this.seasonGroup.get(season)?.setValue(false)
    })

    this.crowdFactors.forEach((factor) => {
      this.crowdFactorGroup.get(factor)?.setValue(false)
    })

    this.updateFilters()
  }

  toggleFilterPanel(): void {
    this.panelOpenState = !this.panelOpenState
  }
}