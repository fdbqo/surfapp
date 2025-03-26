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
// Import only what we need from Leaflet
import { Map, TileLayer, Marker, Icon, LatLng } from "leaflet"

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

  private map: Map | null = null
  private marker: Marker | null = null

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

    // Fix for Leaflet icon issue
    this.fixLeafletIconPath()

    // Create map instance
    this.map = new Map(this.mapElement.nativeElement).setView([Number(this.latitude), Number(this.longitude)], 13)

    // Add OpenStreetMap tiles
    new TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map)

    // Add marker for the surf spot
    this.marker = new Marker(new LatLng(Number(this.latitude), Number(this.longitude)))
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
      this.marker.setLatLng(new LatLng(Number(this.latitude), Number(this.longitude)))
      this.marker.bindPopup(this.spotName)
    } else {
      this.marker = new Marker(new LatLng(Number(this.latitude), Number(this.longitude)))
        .addTo(this.map)
        .bindPopup(this.spotName)
        .openPopup()
    }
  }

  private fixLeafletIconPath(): void {
    // Fix for Leaflet icon paths issue
    const iconRetinaUrl = "assets/marker-icon-2x.png"
    const iconUrl = "assets/marker-icon.png"
    const shadowUrl = "assets/marker-shadow.png"

    // Set default icon options
    Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    })
  }
}

