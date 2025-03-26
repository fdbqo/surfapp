import {
  Component,
  Input,
  type AfterViewInit,
  type OnChanges,
  type SimpleChanges,
  type ElementRef,
  ViewChild,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import * as L from "leaflet"

@Component({
  selector: "app-spot-map",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./spot-map.component.html",
  styleUrls: ["./spot-map.component.css"],
})
export class SpotMapComponent implements AfterViewInit, OnChanges {
  @Input() latitude: number | null = null
  @Input() longitude: number | null = null
  @Input() spotName = "Surf Spot"

  @ViewChild("mapElement") mapElement!: ElementRef

  private map: L.Map | null = null
  private marker: L.Marker | null = null

  get hasCoordinates(): boolean {
    return (
      this.latitude !== null &&
      this.longitude !== null &&
      !isNaN(Number(this.latitude)) &&
      !isNaN(Number(this.longitude))
    )
  }

  ngAfterViewInit(): void {
    if (this.hasCoordinates) {
      this.initMap()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If coordinates change and map already exists, update the map
    if ((changes["latitude"] || changes["longitude"]) && this.map && this.hasCoordinates) {
      this.updateMapPosition()
    }
  }

  private initMap(): void {
    if (!this.hasCoordinates) return

    // Create map instance
    this.map = L.map(this.mapElement.nativeElement).setView([Number(this.latitude), Number(this.longitude)], 13)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map)

    // Create a simple HTML marker instead of using Leaflet's default icon
    const waveIcon = L.divIcon({
      html: '<div style="font-size: 24px; color: #1e88e5;">🏄</div>',
      className: "surf-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    })

    // Add marker for the surf spot with custom icon
    this.marker = L.marker([Number(this.latitude), Number(this.longitude)], {
      icon: waveIcon,
    })
      .addTo(this.map)
      .bindPopup(this.spotName)
      .openPopup()
  }

  private updateMapPosition(): void {
    if (!this.map || !this.hasCoordinates) return

    // Update map view
    this.map.setView([Number(this.latitude), Number(this.longitude)], 13)

    // Update or create marker
    if (this.marker) {
      this.marker.setLatLng([Number(this.latitude), Number(this.longitude)])
      this.marker.bindPopup(this.spotName)
    } else {
      // Create a simple HTML marker
      const waveIcon = L.divIcon({
        html: '<div style="font-size: 24px; color: #1e88e5;">🏄</div>',
        className: "surf-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      this.marker = L.marker([Number(this.latitude), Number(this.longitude)], {
        icon: waveIcon,
      })
        .addTo(this.map)
        .bindPopup(this.spotName)
        .openPopup()
    }
  }
}

