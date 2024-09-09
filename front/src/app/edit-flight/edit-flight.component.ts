import { Component, OnInit } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NavigationComponent } from '../navigation/navigation.component';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FlightBookingService } from '../shared/services/flight-booking.service';
import { Subscription } from 'rxjs';
import { FlightViewModel } from '../shared/models/flight-booking.model';
import { GenericConfirmDialogComponent } from '../shared/generic-confirm-dialog/generic-confirm-dialog.component';

const FLIGHTS_LOCATIONS = '/flights&locations';
const HOME = '/home';

@Component({
  selector: 'app-edit-flight',
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
    EditFlightComponent,
    GenericConfirmDialogComponent
  ],
  templateUrl: './edit-flight.component.html',
  styleUrl: './edit-flight.component.css',
  providers: [DatePipe]
})
export class EditFlightComponent implements OnInit {


  subscriptions: Subscription[] = [];
  flightForm: FormGroup;
  flightForEditing!: FlightViewModel;
  newFlight: { newPrice: number, newDepartureTime: Date, newArrivalTime: Date, newGate: string } = {
    newPrice: 0,
    newDepartureTime: new Date(),
    newArrivalTime: new Date(),
    newGate: ''
  };

  editFailed: boolean = false;
  errorMessage: string = '';
  currentRole: string = '';

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private flightBookingService: FlightBookingService,
    private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    
    this.currentRole = sessionStorage.getItem('roleType') || localStorage.getItem('roleType') || '';
    this.currentRole !== 'ROLE_ADMIN' ? this.router.navigate([HOME]) : null;

    const id = this.route.snapshot.params['id'];
    this.editFailed = false;
    this.errorMessage = '';
    this.getFlightById(id);
    this.initializeForm();
  }


  initializeForm() {

    this.flightForm = this.formBuilder.group({
      price: ['', [Validators.required, Validators.min(0)]],
      departureTime: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      gate: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]]
    });
  }

  editFlight() {
    if (this.flightForm.invalid) {
      return;
    }


    this.newFlight.newPrice = this.flightForm.value.price;
    this.newFlight.newDepartureTime = this.flightForm.value.departureTime;
    this.newFlight.newArrivalTime = this.flightForm.value.arrivalTime;
    this.newFlight.newGate = this.flightForm.value.gate;

    const now = new Date();
    const departure = new Date(this.newFlight.newDepartureTime);
    const arrival = new Date(this.newFlight.newArrivalTime);

    if (departure >= arrival) {
      this.editFailed = true;
      this.errorMessage = 'Departure time must be before arrival time';
      return;
    }

    if (departure <= now) {
      this.editFailed = true;
      this.errorMessage = 'Departure time must be in the future';
      return;
    }

    if (arrival <= now) {
      this.editFailed = true;
      this.errorMessage = 'Arrival time must be in the future';
      return;
    }

    console.log(this.newFlight);

    this.dialog.open(GenericConfirmDialogComponent, {
      data: {
        title: 'Edit Flight',
        message: 'Are you sure you want to edit this flight?'
      }
    }).afterClosed().subscribe((response) => {
      if (response) {
        this.subscriptions.push(this.flightBookingService.updateFlight(this.flightForEditing.id, this.newFlight).subscribe(
          (res) => {
            if (res) {

              this.router.navigate([FLIGHTS_LOCATIONS]);
            }
          },
          (error) => {
            console.log('Error editing flight:', error);
            this.flightForm.reset();
          }
        ));
      }
    });

  }




  getFlightById(id: number) {
    this.subscriptions.push(
      this.flightBookingService.getFlightById(id).subscribe((response) => {
        this.flightForEditing = response;

        const formattedDepartureTime = this.formatDateForInput(this.flightForEditing.departureTime);
        const formattedArrivalTime = this.formatDateForInput(this.flightForEditing.arrivalTime);

        this.flightForm.patchValue({
          ...this.flightForEditing,
          departureTime: formattedDepartureTime,
          arrivalTime: formattedArrivalTime
        });
      })
    );
  }

  formatDateForInput(date: Date): string {
    return new Date(date).toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  }

}
