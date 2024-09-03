import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { LoginComponent } from '../login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { FlightBookingService } from '../shared/services/flight-booking.service';
import { TicketViewModel } from '../shared/models/flight-booking.model';
import { TicketPanelComponent } from '../ticket-panel/ticket-panel.component';

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

  subscriptions: Subscription[] = [];
  tickets: TicketViewModel[] = [];

  email: string = '';
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private flightBookingService: FlightBookingService) { }

  ngOnInit(): void {
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
}
