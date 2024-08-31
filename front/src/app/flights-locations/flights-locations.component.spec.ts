import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsLocationsComponent } from './flights-locations.component';

describe('FlightsLocationsComponent', () => {
  let component: FlightsLocationsComponent;
  let fixture: ComponentFixture<FlightsLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightsLocationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightsLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
