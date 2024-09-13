import { CommonModule } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { AirportViewModel, FlightViewModel, OptionForPackageViewModel, PackageViewModel, PassengerViewModel } from '../shared/models/flight-booking.model';
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

  flights: FlightViewModel[] = [];
  regularFlights: FlightViewModel[] = [];
  returnFlights: FlightViewModel[] = [];
  origin: AirportViewModel;
  optionsForPackage: { [key: number]: any[] } = {};
  selectedRegularFlight: FlightViewModel | null = null; 
  selectedReturnFlight: FlightViewModel | null = null;
  packages: PackageViewModel[] = [];
  packageForm: FormGroup;
  passengerForm: FormGroup;
  passengers: PassengerViewModel[] = [];


  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private flightBookingService: FlightBookingService){}

  ngOnInit(): void {

    this.flights = history.state.flights;
    this.initializeForm();
    this.getPackages();
    this.groupFlights();
  }

  initializeForm() {
    this.packageForm = this.formBuilder.group({
      package: ['', [Validators.required]]
    });

    this.passengerForm = this.formBuilder.group({
      firstName: ['', [Validators.required,Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  getPackages() {
    this.subscriptions.push(this.flightBookingService.getPackages().subscribe(res => {
      this.packages = res.content;

      for (const _package of this.packages) {
        this.getOptionsForPackage(_package);
      }
    }));

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
    console.log('Selected regular flight:', this.selectedRegularFlight);
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
    console.log('Selected return flight:', this.selectedReturnFlight);
}


  isFlightSelected(flight: FlightViewModel): boolean {
    return this.selectedRegularFlight === flight;
  }

  groupFlights() {
    // first flight is always the departure flight so we can just take the first flight and get the origin
    
    this.origin = this.flights[0].origin;
    console.log(this.flights[0] + 'first flight');
    this.flights.forEach(flight => {
      if (flight.origin.location.shortName === this.origin.location.shortName) {
        this.regularFlights.push(flight);
      } else {
        this.returnFlights.push(flight);
      }
     
    });
    console.log(JSON.stringify(this.regularFlights, null, 2) + 'regular flights');
    console.log('Return flights:', JSON.stringify(this.returnFlights, null, 2));
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

  
  getEmailControl() {
    return this.passengerForm.get('email');
  }

  hasEmailError(error: string): boolean {
    const control = this.getEmailControl();
    return control ? control.hasError(error) : false;
  }

  getFirstNameControl() {
    return this.passengerForm.get('firstName');
  }

  hasFirstNameError(error: string): boolean {
    const control = this.getFirstNameControl();
    return control ? control.hasError(error) : false;
  }

  getLastNameControl() {
    return this.passengerForm.get('lastName');
  }

  hasLastNameError(error: string): boolean {
    const control = this.getLastNameControl();
    return control ? control.hasError(error) : false;
  }

  addPackages() {
   // console.log('Selected package price:', this.selectedPackage.price);
  }


  addPassengers() {
  }

}
