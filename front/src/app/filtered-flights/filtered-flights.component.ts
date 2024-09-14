import { CommonModule } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { LoginComponent } from '../login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { AirportViewModel, Class, FlightViewModel, OptionForPackageViewModel, PackageViewModel, PassengerViewModel, TicketViewModel } from '../shared/models/flight-booking.model';
import { Subscription } from 'rxjs';
import { FlightBookingService } from '../shared/services/flight-booking.service';
import { FlightCardComponent } from '../flight-card/flight-card.component';


@Component({
  selector: 'app-filtered-flights',
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
    LoginComponent,
    MatInputModule,
    MatOptionModule,
    MatCardModule,
    MatSelectModule,
    FlightCardComponent
  ],
  templateUrl: './filtered-flights.component.html',
  styleUrl: './filtered-flights.component.css'
})
export class FilteredFlightsComponent implements OnInit{

  subscriptions: Subscription[] = [];
  @ViewChildren(FlightCardComponent) flightCards: QueryList<FlightCardComponent>;

  firstNames: string[] = [];
  lastNames: string[] = [];
  emails: string[] = [];
  ownerFirstName: string = '';
  ownerLastName: string = '';
  ownerEmail: string = '';
  tickets: TicketViewModel[] = [];
  selectedFlights: FlightViewModel[] = [];
  seatNumbers: number[] = [];
  passengerCount: number;
  class: Class;
  flights: FlightViewModel[] = [];
  regularFlights: FlightViewModel[] = [];
  returnFlights: FlightViewModel[] = [];
  origin: AirportViewModel;
  optionsForPackage: { [key: number]: any[] } = {};
  selectedRegularFlight: FlightViewModel | null = null; 
  selectedReturnFlight: FlightViewModel | null = null;
  packages: PackageViewModel[] = [];
  form: FormGroup;
  passengers: PassengerViewModel[] = [];


  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private flightBookingService: FlightBookingService){}

  ngOnInit(): void {

    this.ownerFirstName = sessionStorage.getItem('firstName') || localStorage.getItem('firstName') || '';
    this.ownerLastName = sessionStorage.getItem('lastName') || localStorage.getItem('lastName') || '';
    this.ownerEmail = sessionStorage.getItem('email') || localStorage.getItem('email') || '';

    this.passengerCount = history.state.passengerCount;
    this.class = history.state.class;
    this.flights = history.state.flights;

    this.initializeForm();
    this.getPackages();
    this.initializePassengerForms(this.passengerCount);
    this.groupFlights();

    this.passengersArray.at(0).patchValue({
      firstName: this.ownerFirstName,
      lastName: this.ownerLastName,
      email: this.ownerEmail
    });
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      package: ['', [Validators.required]],
      passengers: this.formBuilder.array([])  
    });
  }

  initializePassengerForms(numberOfPassengers: number) {
    const passengerArray = this.passengersArray;
    passengerArray.clear(); // Clear existing forms
  
    for (let i = 0; i < numberOfPassengers; i++) {
      passengerArray.push(this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
        lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
        email: ['', [Validators.required, Validators.email]],
      }));
    }
  }

  getPackages() {
    this.subscriptions.push(this.flightBookingService.getPackages().subscribe(res => {
      this.packages = res.content;

      for (const _package of this.packages) {
        this.getOptionsForPackage(_package);
      }
    }));

  }

  get passengersArray(): FormArray {
    return this.form.get('passengers') as FormArray;
  }
  

  selectRegularFlight(flightCard: FlightCardComponent) {
    this.flightCards.forEach(card => {
        if (card.flight === flightCard.flight && !card.isReturnFlight) {
            card.isSelected = true;
            this.selectedRegularFlight = flightCard.flight;
        } else if(card.flight !== flightCard.flight && !card.isReturnFlight){
            card.isSelected = false;
        }
    });
}

selectReturnFlight(flightCard: FlightCardComponent) {
    this.flightCards.forEach(card => {
        if (card.flight === flightCard.flight && card.isReturnFlight) {
            card.isSelected = true;
            this.selectedReturnFlight = flightCard.flight;
        } else if(card.flight !== flightCard.flight && card.isReturnFlight){ 
            card.isSelected = false;
        }
    });
}


  isFlightSelected(flight: FlightViewModel): boolean {
    return this.selectedRegularFlight === flight;
  }

  groupFlights() {
    // first flight is always the departure flight so we can just take the first flight and get the origin
    
    this.origin = this.flights[0].origin;
    this.flights.forEach(flight => {
      if (flight.origin.location.shortName === this.origin.location.shortName) {
        this.regularFlights.push(flight);
      } else {
        this.returnFlights.push(flight);
      }
     
    });
  }


  getOptionsForPackage(_package: PackageViewModel) {
    this.subscriptions.push(this.flightBookingService.getOptionsForPackage(_package).subscribe(
      res => {
        res.content.forEach((curr: OptionForPackageViewModel) => {
          const packageId = curr._package.id;

          if (!this.optionsForPackage[packageId]) {
            this.optionsForPackage[packageId] = [];
          }

          const existingOption = this.optionsForPackage[packageId].find(option => option.id === curr.option.id);
          if (!existingOption) {
            this.optionsForPackage[packageId].push(curr.option);
          }
        });
      },
      error => {
        console.error('Error fetching options for package:', error);
      }
    ));
  }

  getOptionsAsString(packageId: number): string {
    const options = this.optionsForPackage[packageId];
    return options ? options.map(option => option.name).join(', ') : '';
  }

  getFirstNameControl(index: number) {
    return this.passengersArray.at(index).get('firstName');
  }
  
  hasFirstNameError(index: number, error: string): boolean {
    const control = this.getFirstNameControl(index);
    return control ? control.hasError(error) : false;
  }
  
  getLastNameControl(index: number) {
    return this.passengersArray.at(index).get('lastName');
  }
  
  hasLastNameError(index: number, error: string): boolean {
    const control = this.getLastNameControl(index);
    return control ? control.hasError(error) : false;
  }
  
  getEmailControl(index: number) {
    return this.passengersArray.at(index).get('email');
  }
  
  hasEmailError(index: number, error: string): boolean {
    const control = this.getEmailControl(index);
    return control ? control.hasError(error) : false;
  }

  addPackages() {
    if(this.form.invalid) {
      return;
    }
    for (const flight of this.flights) {
      this.findSeats(flight);
    }
    for(let i = 0; i < this.passengerCount; i++) {
      var ticket = new TicketViewModel();
      ticket.id = 0;
      if(this.selectedRegularFlight !== null) {
        ticket.flight = this.selectedRegularFlight;
      }
      ticket._return = this.flights[1] ? true : false;
      ticket.owner = new PassengerViewModel(0, this.ownerFirstName, this.ownerLastName, this.ownerEmail);
      ticket._package = this.form.value.package;
      if(this.selectedReturnFlight !== null) {
        ticket.returnFlight = this.selectedReturnFlight;
      }
      ticket.totalPrice = this.form.value.package.price + ticket.flight.price + (ticket._return ? this.form.value.package.price + ticket.returnFlight?.price : 0);
      ticket.ticketClass = this.class;

      // this is different for every ticket
    
      ticket.passenger = this.passengersArray.value[i];
      ticket.seatNumber = this.seatNumbers[i];
      if(ticket._return) {
        ticket.returnSeatNumber = this.seatNumbers[this.seatNumbers.length / 2 + i];
      }
      this.tickets.push(ticket);
    }

    this.router.navigate(['/book-flight'], { state: { tickets: this.tickets}, replaceUrl: true });
  }



  private findSeats(flight: FlightViewModel) {
    const availableSeats = this.class === Class.ECONOMY ? flight.availableEconomySeats : this.class === Class.BUSINESS ? flight.availableBusinessSeats : flight.availableFirstClassSeats;
    const numberOfSeatsOnThePlane = this.class === Class.ECONOMY ? flight.plane.economySeats : this.class === Class.BUSINESS ? flight.plane.businessSeats : flight.plane.firstClassSeats;
    const firstAvailableSeat = numberOfSeatsOnThePlane - availableSeats + 1;
    for (let i = 0; i < this.passengerCount; i++) {
      this.seatNumbers.push(firstAvailableSeat + i);
    }
  }

 

}
