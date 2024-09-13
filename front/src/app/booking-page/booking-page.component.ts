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
import { CapitalizePipe } from '../shared/pipes/capitalize/capitalize.pipe';

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
    DatePipe,
    CapitalizePipe
  ],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css',
  providers: [DatePipe]
})
export class BookingPageComponent implements OnInit {

  bookedTickets: TicketViewModel[] = [];
  subscriptions: Subscription[] = [];
  currentRole: string = '';
  tickets: TicketViewModel[] = [];
  ticket: TicketViewModel = new TicketViewModel();
  applyCouponForm: FormGroup;
  discountPercentage: number;


  columnFormatters: { [key: string]: (element: any) => string } = {
    'departureTime': (element: any) => `${this.datePipe.transform(element.departureTime, 'dd-MM-yyyy HH:mm')}`,
    'arrivalTime': (element: any) => `${this.datePipe.transform(element.arrivalTime, 'dd-MM-yyyy HH:mm')}`,
  };


  constructor(private flightBookingService: FlightBookingService, private router: Router, private datePipe: DatePipe,
    private formBuilder: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.currentRole = sessionStorage.getItem('roleType') || localStorage.getItem('roleType') || '';
    this.currentRole !== 'ROLE_CLIENT' ? this.router.navigate([LOGIN]) : null;

    const receivedTickets = history.state.tickets;
    for(let receivedTicket of receivedTickets) {
      this.ticket.id = receivedTicket.id;
      this.ticket.totalPrice = receivedTicket.totalPrice;
      this.ticket._return = receivedTicket._return;
      this.ticket.owner = receivedTicket.owner;
      this.ticket.passenger = receivedTicket.passenger;
      this.ticket.seatNumber = receivedTicket.seatNumber;
      this.ticket.ticketClass = receivedTicket.ticketClass;
      this.ticket._package = receivedTicket._package;
      this.ticket.flight = receivedTicket.flight;
      this.ticket.returnFlight = receivedTicket.returnFlight;
      this.tickets.push(this.ticket);
    }
    

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
    this.subscriptions.push(this.flightBookingService.getCouponByCouponCode(couponCode).subscribe(
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
          this.subscriptions.push(this.flightBookingService.addPassenger(ticket.passenger).subscribe(
            (passengerRes) => {
              if (passengerRes) {
                ticket.passenger.id = passengerRes.id;
                if(ticket.owner.email === ticket.passenger.email) {
                  ticket.owner.id = ticket.passenger.id;
                }
                this.bookTicket(ticket, () => {
                  ticketsProcessed++;
                  this.checkAndNavigate(ticketsProcessed);
                });
              }
            },
            (error) => {
              const email = ticket.passenger.email;
              if (email) {
                this.subscriptions.push(this.flightBookingService.getPassengerByEmail(email).subscribe(
                  (res) => {
                    if (res) {
                      ticket.passenger.id = res.id;
                      if(ticket.owner.email === ticket.passenger.email) {
                        ticket.owner.id = ticket.passenger.id;
                      }

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
    console.log("ticket: ", ticket);
    this.subscriptions.push(this.flightBookingService.addTicket(ticket).subscribe(
      (res) => {
        if (res) {
          ticket.id = res.id;
          this.bookedTickets.push(ticket);
          console.log("bookedTickets: ", this.bookedTickets); 
          callback();
        }
      }
    ));
  }
  
  checkAndNavigate(ticketsProcessed: number) {
    if (ticketsProcessed === this.tickets.length) {
      this.router.navigate([TICKETS], { state: { bookedTickets: this.bookedTickets }, replaceUrl: true  });
    }
  }
  
}
