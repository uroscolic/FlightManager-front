import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportsPlanesComponent } from './airports-planes.component';

describe('AirportsPlanesComponent', () => {
  let component: AirportsPlanesComponent;
  let fixture: ComponentFixture<AirportsPlanesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirportsPlanesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirportsPlanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
