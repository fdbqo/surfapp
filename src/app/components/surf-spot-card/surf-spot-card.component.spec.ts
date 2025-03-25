import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurfSpotCardComponent } from './surf-spot-card.component';

describe('SurfSpotCardComponent', () => {
  let component: SurfSpotCardComponent;
  let fixture: ComponentFixture<SurfSpotCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurfSpotCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurfSpotCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
