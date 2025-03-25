import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spot-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container">
      <div #mapElement class="map-element"></div>
      <div *ngIf="!hasCoordinates" class="no-location">
        <p>No location data available for this spot.</p>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      width: 100%;
      height: 300px;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .map-element {
      width: 100%;
      height: 100%;
    }
    
    .no-location {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #1a1a1a;
      color: #6ba5c7;
    }
  `]
})
export class SpotMapComponent implements AfterViewInit {
  @Input() latitude: number | null = null;
  @Input() longitude: number | null = null;
  @Input() spotName: string = 'Surf Spot';
  
  @ViewChild('mapElement') mapElement!: ElementRef;
  
  private map: any = null;
  
  get hasCoordinates(): boolean {
    return this.latitude !== null && this.longitude !== null && 
           !isNaN(Number(this.latitude)) && !isNaN(Number(this.longitude));
  }
  
  ngAfterViewInit(): void {
    if (this.hasCoordinates) {
      this.initMap();
    }
  }
  
  private initMap(): void {
    // This is a placeholder for actual map implementation
    // In a real application, you would use Google Maps, Leaflet, or another mapping library
    
    // For demonstration purposes, we'll create a simple placeholder
    const mapDiv = this.mapElement.nativeElement;
    mapDiv.style.backgroundColor = '#1a1a1a';
    
    // Create a simple representation of a map
    const mapContent = document.createElement('div');
    mapContent.style.width = '100%';
    mapContent.style.height = '100%';
    mapContent.style.display = 'flex';
    mapContent.style.flexDirection = 'column';
    mapContent.style.justifyContent = 'center';
    mapContent.style.alignItems = 'center';
    mapContent.style.color = '#87cefa';
    
    const locationIcon = document.createElement('div');
    locationIcon.innerHTML = '📍';
    locationIcon.style.fontSize = '2rem';
    locationIcon.style.marginBottom = '0.5rem';
    
    const locationText = document.createElement('div');
    locationText.textContent = `${this.spotName}`;
    locationText.style.fontWeight = 'bold';
    
    const coordinatesText = document.createElement('div');
    coordinatesText.textContent = `Lat: ${this.latitude}, Lng: ${this.longitude}`;
    coordinatesText.style.fontSize = '0.8rem';
    coordinatesText.style.color = '#6ba5c7';
    coordinatesText.style.marginTop = '0.25rem';
    
    mapContent.appendChild(locationIcon);
    mapContent.appendChild(locationText);
    mapContent.appendChild(coordinatesText);
    
    mapDiv.appendChild(mapContent);
    
    // Note: In a real implementation, you would initialize your map library here
    // Example with Google Maps:
    // this.map = new google.maps.Map(mapDiv, {
    //   center: { lat: this.latitude, lng: this.longitude },
    //   zoom: 12
    // });
    // 
    // const marker = new google.maps.Marker({
    //   position: { lat: this.latitude, lng: this.longitude },
    //   map: this.map,
    //   title: this.spotName
    // });
  }
}