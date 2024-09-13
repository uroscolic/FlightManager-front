import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NavigationComponent } from '../navigation/navigation.component';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { FlightViewModel } from '../shared/models/flight-booking.model';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    RouterOutlet,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NavigationComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatCard,
    MatNativeDateModule,
  ],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.css'
})
export class FlightCardComponent {
  
  @Input() flight: FlightViewModel;
  @Input() flightClass: string;
  @Input() isReturnFlight: boolean; 

  @Output() selectFlight = new EventEmitter<FlightCardComponent>();


  formattedDepartureTime: string;
  formattedArrivalTime: string;
  flightDuration: string;
  isSelected: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (this.flight?.departureTime && this.flight?.arrivalTime) {
      this.formattedDepartureTime = this.formatTime(this.flight.departureTime.toString());
      this.formattedArrivalTime = this.formatTime(this.flight.arrivalTime.toString());
      this.flightDuration = this.calculateDuration(this.flight.departureTime.toString(), this.flight.arrivalTime.toString());
    }
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  calculateDuration(departureTime: string, arrivalTime: string): string {
    const departureDate = new Date(departureTime);
    const arrivalDate = new Date(arrivalTime);
    var durationMs = arrivalDate.getTime() - departureDate.getTime();
    if(durationMs < 0) {
      durationMs += 24 * 60 * 60 * 1000;
    }
    const durationHrs = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMin = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${durationHrs}h ${durationMin}m`;
  }

  onSelect() {
    this.isSelected = !this.isSelected;
    this.selectFlight.emit(this);
  }

  getButtonClass() {
    return this.isSelected ? 'selected' : '';
  }
}