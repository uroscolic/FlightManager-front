import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsPassengersComponent } from './tickets-passengers.component';

describe('TicketsPassengersComponent', () => {
  let component: TicketsPassengersComponent;
  let fixture: ComponentFixture<TicketsPassengersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsPassengersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsPassengersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
