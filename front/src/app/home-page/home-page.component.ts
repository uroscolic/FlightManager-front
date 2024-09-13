import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NavigationComponent } from '../navigation/navigation.component';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { AirportViewModel, Class, FlightSearchModel, FlightViewModel, LocationViewModel } from '../shared/models/flight-booking.model';
import { Subscription } from 'rxjs';
import { FlightBookingService } from '../shared/services/flight-booking.service';
import { MatSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home-page',
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
    MatNativeDateModule,
    MatSpinner
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  
  flightSearchForm: FormGroup;
  isReturn = false;
  airports: AirportViewModel[] = []
  subscriptions: Subscription[] = [];
  from: AirportViewModel = new AirportViewModel(0, '', new LocationViewModel(0, '', '', ''));
  to: AirportViewModel = new AirportViewModel(0, '', new LocationViewModel(0, '', '', ''));
  fromDate: Date = new Date();
  toDate: Date = new Date();
  class: Class = Class.ECONOMY;
  passengers: number = 1;
  flightDoesntExist: boolean = false;
  flightsForReturn: FlightViewModel[] = [];


  constructor(private fb: FormBuilder, private flightBookingService: FlightBookingService, private router: Router) { }

  ngOnInit(): void {
    this.getAirports();
    this.flightSearchForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      passengers: [1, [Validators.required, Validators.min(1)]],
      flightDate: ['', [Validators.required, this.futureDateValidator]],
      returnDate: ['', this.futureDateValidator],
      class: ['', Validators.required],
    }, { validator: this.validateReturnDate('flightDate', 'returnDate') });


  }

  toggleReturn(): void {
    this.isReturn = !this.isReturn;
    if (this.isReturn) {
      this.flightSearchForm.get('returnDate')?.setValidators([Validators.required, this.futureDateValidator]);
    } else {
      this.flightSearchForm.get('returnDate')?.clearValidators();
      this.flightSearchForm.get('returnDate')?.reset();
    }
    this.flightSearchForm.get('returnDate')?.updateValueAndValidity();
  }

  futureDateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    return selectedDate > today ? null : { invalidDate: true };
  }

  validateReturnDate(departure: string, returnDate: string) {
    return (formGroup: FormGroup) => {
      const departureDateControl = formGroup.controls[departure];
      const returnDateControl = formGroup.controls[returnDate];

      if (returnDateControl.value && returnDateControl.value < departureDateControl.value) {
        returnDateControl.setErrors({ returnBeforeDeparture: true });
      } else {
        returnDateControl.setErrors(null);
      }
    };
  }

  

  getAirports() {
    this.subscriptions.push(this.flightBookingService.getAirports().subscribe(res => {
      this.airports = res.content;
      console.log(this.airports);
    }));
  }

  getClasses() {
    return Object.keys(Class);
  }

  onSearch(): Promise<FlightViewModel[]> {
    return new Promise((resolve, reject) => {
      if (this.flightSearchForm.valid) {
        this.from = this.flightSearchForm.get('from')?.value as AirportViewModel;
        this.to = this.flightSearchForm.get('to')?.value as AirportViewModel;
        this.fromDate = this.flightSearchForm.get('flightDate')?.value;
        this.toDate = this.flightSearchForm.get('returnDate')?.value;
        this.class = this.flightSearchForm.get('class')?.value as Class;
        this.passengers = this.flightSearchForm.get('passengers')?.value;
          
        const flightSearchModel = new FlightSearchModel(this.from, this.to, this.fromDate, this.class, this.passengers, null);
  
        this.subscriptions.push(
          this.flightBookingService.getFilteredFlights(flightSearchModel).subscribe(res => {
  
            if (res.content.length === 0) {
              this.flightDoesntExist = true;
              this.flightsForReturn = [];
            } else {
              this.flightDoesntExist = false;
              this.flightsForReturn = res.content;
            }
  
            
            if (this.isReturn) {
              const flightSearchModelReturn = new FlightSearchModel(this.to, this.from, null, this.class, this.passengers, this.toDate);
  
              this.subscriptions.push(
                this.flightBookingService.getFilteredFlights(flightSearchModelReturn).subscribe(returnRes => {
  
                  if (returnRes.content.length === 0) {
                    this.flightDoesntExist = true;
                    this.flightsForReturn = [];
                  } else {
                    this.flightDoesntExist = false;
                    this.flightsForReturn.push(...returnRes.content);
                  }
                  
                  resolve(this.flightsForReturn);
                  if(this.flightsForReturn.length > 1){
                    this.router.navigate(['/filtered-flights'], { state: { flights: this.flightsForReturn } });
                  }
                  
                }, error => {
                  reject(error); 
                })
              );
            } else {
              resolve(this.flightsForReturn);
              if(this.flightsForReturn.length > 0){
                this.router.navigate(['/filtered-flights'], { state: { flights: this.flightsForReturn } });
              }
            }
          }, error => {
            reject(error); 
          })
        );
      } else {
        console.log("Invalid form");
        resolve([]);
      }
    });
  }
  
  
  onReset(): void {
    this.flightSearchForm.reset();
    this.isReturn = false;
    this.flightDoesntExist = false;
  }
}