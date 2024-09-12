import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UploadImageComponent } from '../upload-image/upload-image.component';
import { AirportViewModel, FlightViewModel, LocationViewModel, PlaneViewModel } from '../shared/models/flight-booking.model';
import { MatDialog } from '@angular/material/dialog';
import { FlightBookingService } from '../shared/services/flight-booking.service';
import { GenericConfirmDialogComponent } from '../shared/generic-confirm-dialog/generic-confirm-dialog.component';

const HOME = '/home';

@Component({
  selector: 'app-flights-locations',
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
    UploadImageComponent,
  ],
  templateUrl: './flights-locations.component.html',
  styleUrl: './flights-locations.component.css',
  providers: [DatePipe]
})
export class FlightsLocationsComponent implements OnInit, AfterViewInit {

  displayedColumnsFlights: string[] = ['id', 'plane', 'origin', 'destination', 'gate', 'departureTime', 'arrivalTime', 'price', 'availableEconomySeats', 'availableBusinessSeats', 'availableFirstClassSeats', 'actions'];
  displayedColumnsLocations: string[] = ['id', 'country', 'city', 'shortName'];

  dataSourceFlights: MatTableDataSource<FlightViewModel> = new MatTableDataSource<FlightViewModel>();
  dataSourceLocations: MatTableDataSource<LocationViewModel> = new MatTableDataSource<LocationViewModel>();

  columnMappings: { [key: string]: string } = {
    id: 'Id',
    plane: 'Plane',
    origin: 'Origin',
    destination: 'Destination',
    gate: 'Gate',
    departureTime: 'Departure Time',
    arrivalTime: 'Arrival Time',
    price: 'Price ($)',
    availableEconomySeats: 'Available Economy Seats',
    availableBusinessSeats: 'Available Business Seats',
    availableFirstClassSeats: 'Available First Class Seats',
    country: 'Country',
    city: 'City',
    shortName: 'Short Name',
    actions: 'Actions'

  };

  columnFormatters: { [key: string]: (element: any) => string } = {
    'plane': (element: any) => `${element.plane.name}`,
    'origin': (element: any) => `${element.origin.name} - ${element.origin.location.city}, ${element.origin.location.country} (${element.origin.location.shortName})`,
    'destination': (element: any) => `${element.destination.name} - ${element.destination.location.city}, ${element.destination.location.country} (${element.destination.location.shortName})`,
    'departureTime': (element: any) => `${this.datePipe.transform(element.departureTime, 'medium')}`,
    'arrivalTime': (element: any) => `${this.datePipe.transform(element.arrivalTime, 'medium')}`,
  };

  itemConfig: { [key: string]: any } = {
    flights: {
      itemName: 'Flight',
      dataSource: this.dataSourceFlights,
      displayedColumns: ['id', 'plane', 'origin', 'destination', 'gate', 'departureTime', 'arrivalTime', 'price', 'availableEconomySeats', 'availableBusinessSeats', 'availableFirstClassSeats', 'actions'],
      action: () => this.addFlight()
    },
    locations: {
      itemName: 'Location',
      dataSource: this.dataSourceLocations,
      displayedColumns: ['id', 'country', 'city', 'shortName'],
      action: () => this.addLocation()
    }
  };


  subscriptions: Subscription[] = [];
  selectedItem: string = 'flights';
  errorMessage!: string;
  addingFailed: boolean = false;
  planeForNewFlight: PlaneViewModel;
  originForNewFlight: AirportViewModel;
  destinationForNewFlight: AirportViewModel;
  currentRole: string = '';



  newLocation: { id: number, country: string, city: string, shortName: string } = {
    id: -1,
    country: '',
    city: '',
    shortName: ''
  };

  newFlight: { id: number, plane: PlaneViewModel, origin: AirportViewModel, destination: AirportViewModel, gate: string, departureTime: Date, arrivalTime: Date, price: number, availableEconomySeats: number, availableBusinessSeats: number, availableFirstClassSeats: number } = {
    id: -1,
    plane: {
      id: -1,
      name: '',
      economySeats: 0,
      businessSeats: 0,
      firstClassSeats: 0
    },
    origin:
    {
      id: -1,
      name: '',
      location: {
        id: -1,
        country: '',
        city: '',
        shortName: ''
      }
    },
    destination: {
      id: -1,
      name: '',
      location: {
        id: -1,
        country: '',
        city: '',
        shortName: ''
      }
    },
    gate: '',
    departureTime: new Date(),
    arrivalTime: new Date(),
    price: 0,
    availableEconomySeats: 0,
    availableBusinessSeats: 0,
    availableFirstClassSeats: 0
  };

  locationFields: [
    { label: 'Country', name: 'country', type: 'text' },
    { label: 'City', name: 'city', type: 'text' },
    { label: 'Short Name', name: 'shortName', type: 'text' }
  ];

  flightFields: [
    { label: 'Plane', name: 'plane', type: 'text' },
    { label: 'Origin', name: 'origin', type: 'text' },
    { label: 'Destination', name: 'destination', type: 'text' },
    { label: 'Gate', name: 'gate', type: 'text' },
    { label: 'Departure Time', name: 'departureTime', type: 'text' },
    { label: 'Arrival Time', name: 'arrivalTime', type: 'text' },
    { label: 'Price', name: 'price', type: 'number' },
    { label: 'Available Economy Seats', name: 'availableEconomySeats', type: 'number' },
    { label: 'Available Business Seats', name: 'availableBusinessSeats', type: 'number' },
    { label: 'Available First Class Seats', name: 'availableFirstClassSeats', type: 'number' }
  ];


  @ViewChild(MatPaginator, { static: false }) paginatorLocation: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) paginatorFlight: MatPaginator;
  @ViewChild(MatSort, { static: false }) sortFlight: MatSort;
  @ViewChild(MatSort, { static: false }) sortLocation: MatSort;

  planes: PlaneViewModel[] = [];
  airports: AirportViewModel[] = [];

  // @ViewChild(MatPaginator, {static: false})
  // set paginatorLocation(value: MatPaginator) {
  //   if (this.dataSourceLocations){
  //     this.dataSourceLocations.paginator = value;
  //   }
  // }
  // @ViewChild(MatPaginator, {static: false})
  // set paginatorFlight(value: MatPaginator) {
  //   if (this.dataSourceFlights){
  //     this.dataSourceFlights.paginator = value;
  //   }
  // }
  // @ViewChild(MatSort, {static: false})
  // set sortFlight(value: MatSort) {
  //   if (this.dataSourceFlights){
  //     this.dataSourceFlights.sort = value;
  //   }
  // }
  // @ViewChild(MatSort, {static: false})
  // set sortLocation(value: MatSort) {
  //   if (this.dataSourceLocations){
  //     this.dataSourceLocations.sort = value;
  //   }
  // }

  flightForm: FormGroup;
  locationForm: FormGroup;


  constructor(private datePipe: DatePipe, private router : Router, private formBuilder: FormBuilder, private dialog: MatDialog, private flightBookingService: FlightBookingService) { }

  ngOnInit(): void {
    this.currentRole = sessionStorage.getItem('roleType') || localStorage.getItem('roleType') || '';
    this.currentRole !== 'ROLE_ADMIN' && this.currentRole !== 'ROLE_MANAGER' ? this.router.navigate([HOME]) : null;

    this.initializeForms();

    this.getLocations();
    this.getFlights();
    this.getPlanes();
    this.getAirports();
  }

  ngAfterViewInit(): void {
    // setTimeout(() => this.dataSource.paginator = this.paginator);

    // this.dataSourceFlights.paginator = this.paginatorFlight;
    // this.dataSourceFlights.sort = this.sortFlight;
    // this.dataSourceLocations.paginator = this.paginatorLocation;
    // this.dataSourceLocations.sort = this.sortLocation;
    // console.log('PaginatorLocation reference:', this.paginatorLocation);
    // if (this.paginatorLocation) {
    //   this.dataSourceLocations.paginator = this.paginatorLocation;
    //   this.dataSourceLocations.sort = this.sortLocation;
    // } else {
    //   console.error('PaginatorLocation is not available.');
    // }
    // console.log(this.dataSourceLocations.paginator);
    // console.log(this.dataSourceFlights.paginator);




  }

  getColumnValue(element: any, column: string): string {
    const formatter = this.columnFormatters[column];
    if (formatter) {
      return formatter(element);
    }
    return element[column];
  }

  getForm() {
    switch (this.selectedItem) {
      case 'flights':
        return this.flightForm;
      case 'locations':
        return this.locationForm;
      default:
        return this.flightForm;
    }
  }

  initializeForms() {
    this.flightForm = this.formBuilder.group({
      plane: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      gate: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9- ]*$')]],
      departureTime: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
    });

    this.locationForm = this.formBuilder.group({
      country: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      shortName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9-]*$')]]
    });
  }

  resetForms() {
    this.flightForm.reset();
    this.locationForm.reset();
    this.resetFlightForm();
  }

  resetFlightForm() {
    this.flightForm.reset();
    this.planeForNewFlight = {
      id: -1,
      name: '',
      economySeats: 0,
      businessSeats: 0,
      firstClassSeats: 0
    };
    this.originForNewFlight = {
      id: -1,
      name: '',
      location: {
        id: -1,
        country: '',
        city: '',
        shortName: ''
      }
    };
    this.destinationForNewFlight = {
      id: -1,
      name: '',
      location: {
        id: -1,
        country: '',
        city: '',
        shortName: ''
      }
    };
  }


  getColumnLabel(column: string): string {
    return this.columnMappings[column] || column;
  }

  editFlight(flight: FlightViewModel) {
    this.router.navigate(['edit-flight', flight.id]);
  }

  getItemName(): string {
    return this.itemConfig[this.selectedItem].itemName;
  }

  getDataSource() {
    return this.itemConfig[this.selectedItem].dataSource;
  }

  getAction() {
    this.itemConfig[this.selectedItem].action();
  }

  getDisplayedColumns() {
    return this.itemConfig[this.selectedItem].displayedColumns;
  }

  addFlight() {

    if (this.flightForm.valid) {
      this.addingFailed = false;
      this.newFlight.gate = this.flightForm.value.gate;
      this.newFlight.departureTime = this.flightForm.value.departureTime;
      this.newFlight.arrivalTime = this.flightForm.value.arrivalTime;
      this.newFlight.price = this.flightForm.value.price;
      this.newFlight.plane = this.flightForm.value.plane;
      this.newFlight.origin = this.flightForm.value.origin;
      this.newFlight.destination = this.flightForm.value.destination;

      if (this.newFlight.departureTime >= this.newFlight.arrivalTime) {
        this.errorMessage = 'Departure time must be before arrival time.';
        this.addingFailed = true;
        return;
      }

      const now = new Date();
      const departure = new Date(this.newFlight.departureTime);
      const arrival = new Date(this.newFlight.arrivalTime);

      if (arrival <= now) {
        this.errorMessage = 'Arrival time must be in the future.';
        this.addingFailed = true;
        return;
      }

      if (departure <= now) {
        this.errorMessage = 'Departure time must be in the future.';
        this.addingFailed = true;
        return;
      }

      if (this.newFlight.origin.id === this.newFlight.destination.id) {
        this.errorMessage = 'Origin and destination must be different.';
        this.addingFailed = true;
        return;
      }


      console.log(this.newFlight);
      this.dialog.open(GenericConfirmDialogComponent, {
        disableClose: true,
        data: {
          title: 'Add Flight',
          message: 'Are you sure you want to add this flight?',
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.subscriptions.push(this.flightBookingService.addFlight(this.newFlight).subscribe(
            (res) => {
              if (res) {
                this.getFlights();
                this.resetFlightForm();
              }
            },
            (error) => {
              if (error.status === 500) {
                this.errorMessage = 'Flight with these gate, origin and departure time already exists.';
              } else {
                this.errorMessage = 'An error occurred during adding flight. Please try again.';
              }
              this.resetFlightForm();
              this.addingFailed = true;
            }
          ));
        }
      });
    }
  }



  addLocation() {
    if (this.locationForm.valid) {
      this.addingFailed = false;
      this.newLocation.country = this.locationForm.value.country;
      this.newLocation.city = this.locationForm.value.city;
      this.newLocation.shortName = this.locationForm.value.shortName;
      this.dialog.open(GenericConfirmDialogComponent, {
        disableClose: true,
        data: {
          title: 'Add Location',
          message: 'Are you sure you want to add this location?',
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.subscriptions.push(this.flightBookingService.addLocation(this.newLocation).subscribe(
            (res) => {
              if (res) {
                this.getLocations();
                this.locationForm.reset();
              }
            },
            (error) => {
              if (error.status === 500) {
                this.errorMessage = 'Location with this short name already exists.';
              } else {
                this.errorMessage = 'An error occurred during adding location. Please try again.';
              }
              this.locationForm.reset();
              this.addingFailed = true;
            }
          ));
        }
      });

    }
    else {
      this.errorMessage = 'Please fill in all required fields.';

    }
  }

  // onFileChanged(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.locationForm.get('imagePath')?.setValue(e.target.result); 
  //       console.log(this.locationForm.get('imagePath')?.value);
  //     };
  //     reader.readAsDataURL(file);
  //     console.log(this.locationForm.get('imagePath')?.value);
  //   }
  // }

  getLocations() {
    this.subscriptions.push(this.flightBookingService.getLocations().subscribe(res => {
      this.dataSourceLocations.data = res.content;
      this.dataSourceLocations.paginator = this.paginatorLocation;
      this.dataSourceLocations.sort = this.sortLocation;
    }));
  }

  getFlights() {
    this.subscriptions.push(this.flightBookingService.getFlights().subscribe(res => {
      this.dataSourceFlights.data = res.content;
      this.dataSourceFlights.paginator = this.paginatorFlight;
      this.dataSourceFlights.sort = this.sortFlight;
    }));
  }

  getPlanes() {
    this.subscriptions.push(this.flightBookingService.getPlanes().subscribe(res => {
      this.planes = res.content;
    }));
  }

  getAirports() {
    this.subscriptions.push(this.flightBookingService.getAirports().subscribe(res => {
      this.airports = res.content;
    }));
  }


}
