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
import { AirportViewModel, Class, FlightViewModel, LocationViewModel, PackageViewModel, PassengerViewModel, PlaneViewModel, TicketViewModel } from '../shared/models/flight-booking.model';
import { MatDialog } from '@angular/material/dialog';
import { FlightBookingService } from '../shared/services/flight-booking.service';
import { GenericConfirmDialogComponent } from '../shared/generic-confirm-dialog/generic-confirm-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { ClientViewModel } from '../shared/models/user.model';

const LOGIN = '/login';
const TICKETS = '/tickets';

@Component({
  selector: 'app-booking-page',
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
    MatCardModule,
    DatePipe
  ],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css',
  providers: [DatePipe]
})
export class BookingPageComponent implements OnInit {

  ticketIds: number[] = [];
  subscribers: Subscription[] = [];
  currentRole: string = '';
  tickets: TicketViewModel[] = [];
  ticket: TicketViewModel = new TicketViewModel();
  ticket2: TicketViewModel = new TicketViewModel();
  applyCouponForm: FormGroup;
  discountPercentage: number;


  columnFormatters: { [key: string]: (element: any) => string } = {
    'departureTime': (element: any) => `${this.datePipe.transform(element.departureTime, 'dd-MM-yyyy HH:mm')}`,
    'arrivalTime': (element: any) => `${this.datePipe.transform(element.arrivalTime, 'dd-MM-yyyy HH:mm')}`,
  };


  constructor(private flightBookingService: FlightBookingService, private router: Router, private datePipe: DatePipe,
    private formBuilder: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {


    this.ticket.id = 3;
    this.ticket.totalPrice = 100;
    this.ticket._return = false;
    this.ticket.owner = new PassengerViewModel(1, 'Client', 'Client', 'client@gmail.com');
    this.ticket.passenger = new PassengerViewModel(5, 'Uros', 'Doe', 'urosdoe@gmail.com');
    this.ticket.seatNumber = 5;
    this.ticket.ticketClass = Class.ECONOMY;
    this.ticket._package = new PackageViewModel(1, 'Package 1', 10);
    this.ticket.flight = new FlightViewModel(1, new PlaneViewModel(1, 'Plane 1', 11, 11, 11), new AirportViewModel(1, 'Airport 1', new LocationViewModel(1, 'Serbia', 'Belgrade', 'SRB-BG')), new AirportViewModel(2, 'Airport 2', new LocationViewModel(2, 'Serbia', 'Novi Sad', 'SRB-NS')), 'A1', new Date('2024-10-11 18:30:49.476908'), new Date('2024-10-11 19:30:49.476908'), 100, 11, 11, 11);
    console.log(this.ticket);
    // this.ticket.returnFlight = new FlightViewModel(2, new PlaneViewModel(1, 'Plane 1', 11, 11, 11), new AirportViewModel(2, 'Airport 2', new LocationViewModel(2, 'Serbia', 'Novi Sad', 'SRB-NS')), new AirportViewModel(1, 'Airport 1', new LocationViewModel(1, 'Serbia', 'Belgrade', 'SRB-BG')), 'Gate 1', new Date(	), new Date(), 100, 100, 100, 100);

    // this.ticket2.id = 1;
    // this.ticket2.totalPrice = 100;
    // this.ticket2._return = false;
    // this.ticket2.owner = new PassengerViewModel(0, 'Dusan', 'Doe', 'johndoe@gmail.com');
    // this.ticket2.passenger = new PassengerViewModel(0, 'Dusan', 'Doe', 'johndoe@gmail.com');
    // this.ticket2.seatNumber = 1;
    // this.ticket2.ticketClass = Class.Economy;
    // this.ticket2._package = new PackageViewModel(0, 'Package 1', 100);
    // this.ticket2.flight = new FlightViewModel(3, new PlaneViewModel(1, 'Plane 1', 10, 10, 10), new AirportViewModel(0, 'Airport 1', new LocationViewModel(1, 'Serbia', 'Novi Sad', 'SRB-NS')), new AirportViewModel(0, 'Airport 2', new LocationViewModel(2, 'Serbia', 'Belgrade', 'SRB-BG')), 'Gate 1', new Date(), new Date(), 100, 100, 100, 100);


    this.tickets.push(this.ticket);
    this.tickets.push(this.ticket);

    this.currentRole = sessionStorage.getItem('roleType') || localStorage.getItem('roleType') || '';
    this.currentRole !== 'ROLE_CLIENT' ? this.router.navigate([LOGIN]) : null;

    this.initializeForm();


  }

  getColumnValue(element: any, column: string): string {
    const formatter = this.columnFormatters[column];
    if (formatter) {
      return formatter(element);
    }
    return element[column];
  }

  initializeForm() {
    this.applyCouponForm = this.formBuilder.group({
      couponCode: ['', Validators.pattern('^[a-zA-Z0-9-]*$')]
    });
  }

  getCouponFromCouponCode(couponCode: string, ticket: TicketViewModel): void {
    this.subscribers.push(this.flightBookingService.getCouponByCouponCode(couponCode).subscribe(
      (res) => {
        if (res) {
          this.discountPercentage = res.discount;
          this.ticket.totalPrice = this.ticket.totalPrice - this.ticket.totalPrice * this.discountPercentage / 100;
        }
      }
    ));
  }

  applyCoupon(ticket: TicketViewModel) {
    if (this.applyCouponForm.value.couponCode) {
      this.getCouponFromCouponCode(this.applyCouponForm.value.couponCode, ticket);
    }
    this.applyCouponForm.reset();
  }

  bookTickets() {
    this.dialog.open(GenericConfirmDialogComponent, {
      disableClose: true,
      data: {
        title: 'Purchase Tickets',
        message: 'Are you sure you want to purchase these tickets?',
        action: 'Purchase'
      }
    }).afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        let ticketsProcessed = 0;
  
        this.tickets.forEach(ticket => {
          this.subscribers.push(this.flightBookingService.addPassenger(ticket.passenger).subscribe(
            (passengerRes) => {
              if (passengerRes) {
                ticket.passenger.id = passengerRes.id;
                this.bookTicket(ticket, () => {
                  ticketsProcessed++;
                  this.checkAndNavigate(ticketsProcessed);
                });
              }
            },
            (error) => {
              const email = ticket.passenger.email;
              if (email) {
                this.subscribers.push(this.flightBookingService.getPassengerByEmail(email).subscribe(
                  (res) => {
                    if (res) {
                      ticket.passenger.id = res.id;
                      this.bookTicket(ticket, () => {
                        ticketsProcessed++;
                        this.checkAndNavigate(ticketsProcessed);
                      });
                    }
                  }
                ));
              }
            }
          ));
        });
      }
    });
  }
  
  bookTicket(ticket: TicketViewModel, callback: () => void) {
    this.subscribers.push(this.flightBookingService.addTicket(ticket).subscribe(
      (res) => {
        if (res) {
          ticket.id = res.id;
          this.ticketIds.push(res.id);
          console.log('TicketIds:', this.ticketIds);
          callback();
        }
      }
    ));
  }
  
  checkAndNavigate(ticketsProcessed: number) {
    if (ticketsProcessed === this.tickets.length) {
      this.router.navigate([TICKETS], { queryParams: { ticketIds: this.ticketIds.join(',') } });
    }
  }
  
}
