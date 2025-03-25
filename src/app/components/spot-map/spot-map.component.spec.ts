import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotMapComponent } from './spot-map.component';

describe('SpotMapComponent', () => {
  let component: SpotMapComponent;
  let fixture: ComponentFixture<SpotMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpotMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
