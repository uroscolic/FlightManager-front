import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { Subscription } from 'rxjs';
import { FlightBookingService } from '../shared/services/flight-booking.service';
import { TicketViewModel } from '../shared/models/flight-booking.model';
import { TicketPanelComponent } from '../ticket-panel/ticket-panel.component';
import { UserService } from '../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { GenericConfirmDialogComponent } from '../shared/generic-confirm-dialog/generic-confirm-dialog.component';


const HOME = '/home';


@Component({
  selector: 'app-my-tickets',
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
    TicketPanelComponent,
  ],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.css'
})
export class MyTicketsComponent implements OnInit {

  currentRole: string = '';
  ticketIds: number[] = [];
  numberOfBookings: number = 0;
  subscriptions: Subscription[] = [];
  tickets: TicketViewModel[] = [];
  errorMessage!: string;  
  cancelingFailed: boolean = false;

  email: string = '';
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private flightBookingService: FlightBookingService, 
  private userService: UserService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const ids = params.get('ticketIds');
      if (ids) {
        this.ticketIds = ids.split(',').map(id => +id);
        console.log(this.ticketIds);
      }
    });

    this.currentRole = sessionStorage.getItem('roleType') || localStorage.getItem('roleType') || '';
    this.currentRole !== 'ROLE_CLIENT' ? this.router.navigate([HOME]) : null;

    if(isPlatformBrowser(this.platformId)) {
      if (!this.rememberMeChecked) {
        this.email = sessionStorage.getItem('email') || '';
      }
      else
        this.email = localStorage.getItem('email') || '';
    }
    this.getTickets();
  }

  getTickets() {
    if (typeof window !== 'undefined' && window.sessionStorage) {

      this.subscriptions.push(this.flightBookingService.getTickets(this.email).subscribe(res => {
        this.tickets = res.content;
      }));

      this.subscriptions.push(this.userService.getNumberOfBookingsByEmail(this.email).subscribe(res => {
        this.numberOfBookings = res.numberOfBookings;
      }));

    } else {
      console.error('sessionStorage is not available.');
    }
  }

  get rememberMeChecked(): boolean {
    return !!localStorage.getItem('rememberMe');
  }

  allTickets() : TicketViewModel[] {
    return this.tickets;
  }

  cancelTicket(id: number): void {

    this.dialog.open(GenericConfirmDialogComponent, {
      data: {
        title: 'Cancel Ticket',
        message: 'Are you sure you want to cancel this ticket?'
      }
    }).afterClosed().subscribe(result => {
      if(result) {
        this.subscriptions.push(this.flightBookingService.cancelTicket(id).subscribe(
          (res) => {
            if(res) {
            this.getTickets();

            }
        },
        (error) => {
          if (error.status === 500) {
            this.errorMessage = "You can't cancel a ticket less than 48 hours before the flight";
            
          } else {
            this.errorMessage = 'An error occurred while canceling ticket. Please try again.';
          }
          this.cancelingFailed = true;
        }
      ));
      }
    });

    
  }
}
