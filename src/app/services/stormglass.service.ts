import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: "root",
})
export class StormglassService {
  constructor(private http: HttpClient) {}

  /**
   * Process raw forecast data into a more usable format
   * @param rawData Raw forecast data from Stormglass API
   * @returns Processed forecast data
   */
  processForecaseData(rawData: any): any {
    if (!rawData || !rawData.hours) {
      return null
    }

    const dailyForecasts: { date: string; dayOfWeek: string; hours: any[] }[] = []
    const days = new Map()

    rawData.hours.forEach((hour: any) => {
      const date = new Date(hour.time)
      const dayKey = date.toDateString()

      if (!days.has(dayKey)) {
        days.set(dayKey, {
          date: dayKey,
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
    }
  }

  /**
   * Get a human-readable description of when forecast data was last updated
   * @param lastFetchedDate Date when forecast was last fetched
   * @returns Human-readable string
   */
  getLastUpdatedText(lastFetchedDate: Date | string | null): string {
    if (!lastFetchedDate) {
      return "Never"
    }

    const lastFetched = new Date(lastFetchedDate)
    const now = new Date()
    const diffMs = now.getTime() - lastFetched.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) {
      return "Just now"
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
    } else if (diffDays === 1) {
      return "Yesterday"
    } else {
      return `${diffDays} days ago`
    }
  }

  /**
   * Get a color class based on wave conditions
   * @param waveHeight Wave height in meters
   * @returns CSS class name
   */
  getConditionClass(waveHeight: number): string {
    if (!waveHeight) return "condition-unknown"

    if (waveHeight < 0.5) return "condition-poor"
    if (waveHeight < 1.0) return "condition-fair"
    if (waveHeight < 2.0) return "condition-good"
    return "condition-excellent"
  }

  /**
   * Get a human-readable description of wave conditions
   * @param waveHeight Wave height in meters
   * @returns Description string
   */
  getConditionDescription(waveHeight: number): string {
    if (!waveHeight) return "Unknown"

    if (waveHeight < 0.5) return "Poor"
    if (waveHeight < 1.0) return "Fair"
    if (waveHeight < 2.0) return "Good"
    return "Excellent"
  }

  /**
   * Convert wind direction in degrees to cardinal direction
   * @param degrees Wind direction in degrees
   * @returns Cardinal direction (N, NE, E, etc.)
   */
  degreesToCardinal(degrees: number): string {
    if (degrees === undefined || degrees === null) return "Unknown"

    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ]
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }
}

