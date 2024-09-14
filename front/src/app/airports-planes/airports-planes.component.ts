import { Component, OnInit } from '@angular/core';
import { FlightBookingService } from '../shared/services/flight-booking.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { get } from 'http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Router, RouterOutlet } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GenericConfirmDialogComponent } from '../shared/generic-confirm-dialog/generic-confirm-dialog.component';
import { NavigationComponent } from "../navigation/navigation.component";
import { PlaneViewModel, AirportViewModel, LocationViewModel } from '../shared/models/flight-booking.model';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UploadImageComponent } from '../upload-image/upload-image.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { error } from 'console';


const HOME = '/home';

@Component({
  selector: 'app-airports-planes',
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
  templateUrl: './airports-planes.component.html',
  styleUrl: './airports-planes.component.css'
})
export class AirportsPlanesComponent implements OnInit {
  displayedPlaneColumns: string[] = ['id', 'name', 'economySeats', 'businessSeats', 'firstClassSeats'];
  displayedAirportColumns: string[] = ['id', 'name', 'city', 'country', 'actions'];

  currentRole: string = '';

  dataSourcePlane: MatTableDataSource<PlaneViewModel> = new MatTableDataSource<PlaneViewModel>([]);
  dataSourceAirport: MatTableDataSource<AirportViewModel> = new MatTableDataSource<AirportViewModel>([]);
  locations: LocationViewModel[] = [];

  columnMappings: { [key: string]: string } = {
    id: 'Id',
    name: 'Name',
    economySeats: 'Economy Seats',
    businessSeats: 'Business Seats',
    firstClassSeats: 'First Class Seats',
    city: 'City',
    country: 'Country',
    actions: 'Actions'
  };

  itemConfig: { [key: string]: any } = {
    planes: {
      itemName: 'Plane',
      displayedColumns: ['id', 'name', 'economySeats', 'businessSeats', 'firstClassSeats'],
      dataSource: this.dataSourcePlane,
      action: () => this.addPlane(),
    },
    airports: {
      itemName: 'Airport',
      displayedColumns: ['id', 'name', 'location.city', 'location.country', 'actions'],
      dataSource: this.dataSourceAirport,
      action: () => this.addAirport(),
    }
  };



  subscriptions: Subscription[] = [];
  selectedItem: string = 'planes';

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  newPlane: { id: number, name: string, economySeats: number, businessSeats: number, firstClassSeats: number } = {
    id: -1,
    name: '',
    economySeats: 0,
    businessSeats: 0,
    firstClassSeats: 0
  };

  newAirport: { id: number, name: string, location: LocationViewModel } = {
    id: -1,
    name: '',
    location: {
      id: -1,
      country: '',
      city: '',
      shortName: ''
    }
  };

  planeFields = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Economy Seats', name: 'economySeats', type: 'number' },
    { label: 'Business Seats', name: 'businessSeats', type: 'number' },
    { label: 'First Class Seats', name: 'firstClassSeats', type: 'number' }
  ];

  airportFields = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'City', name: 'city', type: 'text' },
    { label: 'Country', name: 'country', type: 'text' },
  ];



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  planeForm: FormGroup;
  airportForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private flightBookingService: FlightBookingService, private router: Router) { }


  ngOnInit(): void {
    
    this.currentRole = sessionStorage.getItem('roleType') || localStorage.getItem('roleType') || '';
    this.currentRole !== 'ROLE_ADMIN' && this.currentRole !== 'ROLE_MANAGER' ? this.router.navigate([HOME]) : null;

    this.initializeForms();

    this.getPlanes();
    this.getAirports();
    this.getLocations();
  }

  getForm() {
    switch (this.selectedItem) {
      case 'planes':
        return this.planeForm;
      case 'airports':
        return this.airportForm;
      default:
        return this.planeForm;
    }
  }

  initializeForms() {
    this.planeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      economySeats: ['', [Validators.required, Validators.min(0)]],
      businessSeats: ['', [Validators.required, Validators.min(0)]],
      firstClassSeats: ['', [Validators.required, Validators.min(0)]]
    });

    this.airportForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      location: ['', [Validators.required]]
    });
  }

  getValueFromPath(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o ? o[p] : null, obj);
  }

  getColumnDisplayName(column: string): string {
    const columnDisplayNames: { [key: string]: string } = {
      'location.city': 'City',
      'location.country': 'Country',
      'id': 'ID',
      'name': 'Name',
      'economySeats': 'Economy Seats',
      'businessSeats': 'Business Seats',
      'firstClassSeats': 'First Class Seats',
      'actions': 'Actions'
    };
    return columnDisplayNames[column] || column;
  }

  resetForms() {
    this.planeForm.reset();
    this.airportForm.reset();
  }

  editAirport(airport: AirportViewModel) {
    this.router.navigate(['/edit-airport', airport.id]);
  }

  getColumnLabel(column: string): string {
    return this.columnMappings[column] || column;
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

  addPlane() {
    if (this.planeForm.valid) {

      this.newPlane.name = this.planeForm.value.name;
      this.newPlane.economySeats = this.planeForm.value.economySeats;
      this.newPlane.businessSeats = this.planeForm.value.businessSeats;
      this.newPlane.firstClassSeats = this.planeForm.value.firstClassSeats;
      this.dialog.open(GenericConfirmDialogComponent, {
        data: {
          title: 'Confirm',
          message: 'Are you sure you want to add this plane?',
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.subscriptions.push(this.flightBookingService.addPlane(this.newPlane).subscribe(
            (res) => {
              if (res) {
                this.getPlanes();
                this.planeForm.reset();
              }
            },
            (error) => {
              console.log('Error adding plane:', error);
              this.planeForm.reset();
            }
          ));
        }
      });
    }
    else {
      console.log("error");
      console.error('Invalid form');
    }

  }

  addAirport() {

    if (this.airportForm.valid) {
      this.newAirport.name = this.airportForm.value.name;
      this.newAirport.location = this.airportForm.value.location;

      this.dialog.open(GenericConfirmDialogComponent, {
        data: {
          title: 'Confirm',
          message: 'Are you sure you want to add this airport?',
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.subscriptions.push(this.flightBookingService.addAirport(this.newAirport).subscribe(
            (res) => {
              if (res) {
                this.getAirports();
                this.airportForm.reset();
              }
            },
            (error) => {
              console.log('Error adding airport:', error);
              this.airportForm.reset();
            }
          ));
        }
      });
    }
    else {
      console.error('Invalid form');
    }
  }

  getPlanes() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem('token');

      this.subscriptions.push(this.flightBookingService.getPlanes().subscribe(res => {
        this.dataSourcePlane.data = res.content;
        this.dataSourcePlane.paginator = this.paginator;
        this.dataSourcePlane.sort = this.sort;
      }));
    } else {
      console.error('sessionStorage is not available.');
    }
  }

  getLocations() {
    this.subscriptions.push(this.flightBookingService.getLocations().subscribe(res => {
      this.locations = res.content;
    }));
  }

  getAirports() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem('token');

      this.subscriptions.push(this.flightBookingService.getAirports().subscribe(res => {
        this.dataSourceAirport.data = res.content;
        this.dataSourceAirport.paginator = this.paginator;
        this.dataSourceAirport.sort = this.sort;
      }));
    } else {
      console.error('sessionStorage is not available.');
    }
  }

}
