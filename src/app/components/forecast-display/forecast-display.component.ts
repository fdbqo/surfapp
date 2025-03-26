import { Component, Input, type OnChanges, type SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatTabsModule } from "@angular/material/tabs"
import { MatDividerModule } from "@angular/material/divider"
import { StormglassService } from "../../services/stormglass.service"

@Component({
  selector: "app-forecast-display",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTabsModule, MatDividerModule],
  templateUrl: "./forecast-display.component.html",
  styleUrls: ["./forecast-display.component.css"],
})
export class ForecastDisplayComponent implements OnChanges {
  @Input() forecastData: any
  @Input() lastUpdated: Date | string | null = null

  processedForecast: any = null
  selectedDayIndex = 0

  constructor(public stormglassService: StormglassService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["forecastData"] && this.forecastData) {
      this.processForecastData()
    }
  }

  processForecastData(): void {
    if (this.forecastData && this.forecastData.data) {
      this.processedForecast = this.stormglassService.processForecaseData(this.forecastData.data)
    } else {
      this.processedForecast = null
    }
  }

  selectDay(index: number): void {
    this.selectedDayIndex = index
  }

  getWindDirectionIcon(degrees: number): string {
    if (degrees === undefined || degrees === null) return "help_outline"

    // Round to nearest 45 degrees for 8 main directions
    const normalizedDegrees = Math.round(degrees / 45) * 45

    switch (normalizedDegrees) {
      case 0:
      case 360:
        return "arrow_upward" // N
      case 45:
        return "north_east" // NE
      case 90:
        return "arrow_forward" // E
      case 135:
        return "south_east" // SE
      case 180:
        return "arrow_downward" // S
      case 225:
        return "south_west" // SW
      case 270:
        return "arrow_back" // W
      case 315:
        return "north_west" // NW
      default:
        return "help_outline"
    }
  }

  getWindDirectionStyle(degrees: number): any {
    if (degrees === undefined || degrees === null) return {}

    return {
      transform: `rotate(${degrees}deg)`,
      display: "inline-block",
    }
  }
}

