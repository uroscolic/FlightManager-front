import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { FlightViewModel, OptionForPackageViewModel, PackageViewModel } from '../shared/models/flight-booking.model';
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
  flights: FlightViewModel[] = [];
  flightIds: number[] = [];
  departureDate: Date;
  returnDate: Date;
  optionsForPackage: { [key: number]: any[] } = {};
  selectedPackage: PackageViewModel;


  packages: PackageViewModel[] = [];
  packageForm: FormGroup;


  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private flightBookingService: FlightBookingService){}

  ngOnInit(): void {

    this.initializeForm();
    this.getParams();
    this.getPackages();
  }

  initializeForm() {
    this.packageForm = this.formBuilder.group({
      packages: ['', [Validators.required]]
    });
  }

  getParams() {
    this.route.queryParamMap.subscribe(params => {
      const ids = params.get('flights');
      if (ids) {
        this.flightIds = ids.split(',').map(id => +id);
        this.getFlights();
        console.log(this.flights);
      }
    });
  }

  getFlights(){
    this.flightIds.forEach(id => {
      this.getFlightById(id);
    });
  }

  getFlightById(id: number) { 
    this.subscriptions.push(this.flightBookingService.getFlightById(id).subscribe(
      (res: FlightViewModel) => {
        this.flights.push(res);
      }
    ));
  }

  getPackages() {
    this.subscriptions.push(this.flightBookingService.getPackages().subscribe(res => {
      this.packages = res.content;

      for (const _package of this.packages) {
        this.getOptionsForPackage(_package);
      }
    }));

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


  addPackages() {
    console.log('Selected package price:', this.selectedPackage.price);
  }


}
