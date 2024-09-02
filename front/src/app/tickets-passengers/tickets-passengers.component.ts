import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PassengerViewModel, TicketViewModel } from '../shared/models/flight-booking.model';
import { FlightBookingService } from '../shared/services/flight-booking.service';
import { MatDialog } from '@angular/material/dialog';
import { TicketPanelComponent } from '../ticket-panel/ticket-panel.component';
import { Subscription } from 'rxjs';
import { get } from 'http';

@Component({
  selector: 'app-tickets-passengers',
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
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    TicketPanelComponent
  ],
  templateUrl: './tickets-passengers.component.html',
  styleUrl: './tickets-passengers.component.css'
})
export class TicketsPassengersComponent implements OnInit {

  dataSourcePassengers: MatTableDataSource<PassengerViewModel> = new MatTableDataSource<PassengerViewModel>();
  dataSourceTickets: MatTableDataSource<TicketViewModel> = new MatTableDataSource<TicketViewModel>();

  columnMappings: { [key: string]: string } = {
    'id': 'ID',
    'firstName': 'First Name',
    'lastName': 'Last Name',
    'email': 'Email',
    'owner': 'Owner',
    'passenger': 'Passenger',
    'seatNumber': 'Seat Number',
    'class': 'Class',
    'isReturn': 'Is Return',
    'package': 'Package',
    'flightId': 'Flight ID',
    'returnFlightId': 'Return Flight ID',
    'totalPrice': 'Total Price'
  };

  itemConfig: { [key: string]: any } = {
    passengers: {
      itemName: 'Passenger',
      dataSource: this.dataSourcePassengers,
      displayedColumns: ['id', 'firstName', 'lastName', 'email']
    },
    tickets: {
      itemName: 'Ticket',
      dataSource: this.dataSourceTickets,
      displayedColumns: ['id', 'owner', 'passenger', 'seatNumber', 'class', 'isReturn', 'package', 'flightId', 'returnFlightId', 'totalPrice']
    },

  };

  columnFormatters: { [key: string]: (element: any) => string } = {
    'owner': (element: any) => `${element.owner.firstName} ${element.owner.lastName}`,
    'passenger': (element: any) => `${element.passenger.firstName} ${element.passenger.lastName}`,
    'isReturn': (element: any) => element.isReturn ? 'Yes' : 'No',
    'package': (element: any) => element._package.name,
    'flightId': (element: any) => element.flight.id,
    'returnFlightId': (element: any) => element.returnFlight? element.returnFlight.id : 'N/A',  
    'class': (element: any) => element.ticketClass === 'ECONOMY' ? 'Economy' :  element.ticketClass === 'BUSINESS' ? 'Business' : 'First Class' 
  };


  subscriptions: Subscription[] = [];
  selectedItem: string = 'passengers';

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private flightBookingService: FlightBookingService) { }


  ngOnInit(): void {
    this.getTickets();
    this.getPassengers();
  }

  getColumnLabel(column: string): string {
    return this.columnMappings[column] || column;
  }

  getDataSource() {
    return this.itemConfig[this.selectedItem].dataSource;
  }

  getDisplayedColumns() {
    return this.itemConfig[this.selectedItem].displayedColumns;
  }

  getColumnValue(element: any, column: string): string {
    const formatter = this.columnFormatters[column];
    if (formatter) {
      return formatter(element);
    }
    return element[column];
  }

  getTikets() : TicketViewModel[] {
    return this.dataSourceTickets.data;
  }

  getTickets() {
    if (typeof window !== 'undefined' && window.sessionStorage) {

      this.subscriptions.push(this.flightBookingService.getTickets().subscribe(res => {
        this.dataSourceTickets.data = res.content;
        console.log(this.dataSourceTickets.data);
        this.dataSourceTickets.paginator = this.paginator;
        this.dataSourceTickets.sort = this.sort;
      }));
    } else {
      console.error('sessionStorage is not available.');
    }
  }

  getPassengers() {
    if (typeof window !== 'undefined' && window.sessionStorage) {

      this.subscriptions.push(this.flightBookingService.getPassengers().subscribe(res => {
        this.dataSourcePassengers.data = res.content;
        this.dataSourcePassengers.paginator = this.paginator;
        this.dataSourcePassengers.sort = this.sort;
      }));
    } else {
      console.error('sessionStorage is not available.');
    }
  }
}
