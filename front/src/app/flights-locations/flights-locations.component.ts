import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UploadImageComponent } from '../upload-image/upload-image.component';
import { AirportViewModel, FlightViewModel, LocationViewModel, PlaneViewModel } from '../shared/models/flight-booking.model';
import { MatDialog } from '@angular/material/dialog';
import { FlightBookingService } from '../shared/services/flight-booking.service';

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
    UploadImageComponent
  ],
  templateUrl: './flights-locations.component.html',
  styleUrl: './flights-locations.component.css'
})
export class FlightsLocationsComponent implements OnInit {

  displayedColumnsFlights: string[] = ['id', 'plane', 'origin', 'destination', 'gate', 'departureTime', 'arrivalTime', 'price', 'availableEconomySeats', 'availableBusinessSeats', 'availableFirstClassSeats', 'actions'];
  displayedColumnsLocations: string[] = ['id', 'country', 'city', 'shortName', 'imagePath', 'actions'];

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
    price: 'Price',
    availableEconomySeats: 'Available Economy Seats',
    availableBusinessSeats: 'Available Business Seats',
    availableFirstClassSeats: 'Available First Class Seats',
    country: 'Country',
    city: 'City',
    shortName: 'Short Name',
    imagePath: 'Image'

  };

  itemConfig: { [key: string]: any } = {
    flights: {
      itemName: 'Flight',
      dataSource: this.dataSourceFlights,
      displayedColumns: ['id', 'plane', 'origin', 'destination', 'gate', 'departureTime', 'arrivalTime', 'price', 'availableEconomySeats', 'availableBusinessSeats', 'availableFirstClassSeats', 'actions'],
      action: () =>  this.addFlight() 
    },
    locations: {
      itemName: 'Location', 
      dataSource: this.dataSourceLocations,
      displayedColumns: ['id', 'country', 'city', 'shortName', 'imagePath', 'actions'],
      action: () => this.addLocation()
    }
  };


  subscriptions: Subscription[] = [];
  selectedItem: string = 'flights';

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  newLocation: {id: number, country: string, city: string, shortName: string, imagePath: string } = { 
    id: -1,
    country: '', 
    city: '', 
    shortName: '', 
    imagePath: '' 
  };

  newFlight: {id: number, plane: PlaneViewModel, origin: AirportViewModel, destination: AirportViewModel, gate: string, departureTime: Date, arrivalTime: Date, price: number, availableEconomySeats: number, availableBusinessSeats: number, availableFirstClassSeats: number } = {
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
      shortName: '',
      imagePath: ''
      }
    },
    destination: {
      id: -1,
      name: '',
      location: {
      id: -1,
      country: '',
      city: '',
      shortName: '',
      imagePath: ''
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
    { name: 'Country', value: 'country' },
    { name: 'City', value: 'city' },
    { name: 'Short Name', value: 'shortName' },
    { name: 'Image Path', value: 'imagePath' }
  ];

  flightFields: [
    { name: 'Plane', value: 'plane' },
    { name: 'Origin', value: 'origin' },
    { name: 'Destination', value: 'destination' },
    { name: 'Gate', value: 'gate' },
    { name: 'Departure Time', value: 'departureTime' },
    { name: 'Arrival Time', value: 'arrivalTime' },
    { name: 'Price', value: 'price' },
    { name: 'Available Economy Seats', value: 'availableEconomySeats' },
    { name: 'Available Business Seats', value: 'availableBusinessSeats' },
    { name: 'Available First Class Seats', value: 'availableFirstClassSeats' }
  ];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  flightFrom: FormGroup;
  locationFrom: FormGroup;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private flightBookingService: FlightBookingService) { }

  ngOnInit(): void {
  }

  addFlight() {
    
  }

  addLocation() {
  }
}
