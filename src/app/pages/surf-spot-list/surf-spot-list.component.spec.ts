import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurfSpotListComponent } from './surf-spot-list.component';

describe('SurfSpotListComponent', () => {
  let component: SurfSpotListComponent;
  let fixture: ComponentFixture<SurfSpotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurfSpotListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurfSpotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
