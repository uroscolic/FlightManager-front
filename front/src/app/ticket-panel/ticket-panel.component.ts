import { Component, Inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TicketViewModel, Class } from '../shared/models/flight-booking.model';
import { MatExpansionModule } from '@angular/material/expansion';  // Import MatExpansionModule
import { MatFormFieldModule } from '@angular/material/form-field';  // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input';  // Import MatInp
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-ticket-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
  ],
  templateUrl: './ticket-panel.component.html',
  styleUrl: './ticket-panel.component.css'
})
export class TicketPanelComponent implements OnInit {
  @Input() ticket!: TicketViewModel;
  @Input() newTicketIds: number[] = [];
  @Output() cancelTicket = new EventEmitter<number>();
  highlightedTicketIds: number[] = [];


  ngOnInit(): void {
    this.highlightTickets();
  }
  
  onCancelTicket(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.cancelTicket.emit(id);
  }

  highlightTickets(): void {
    this.highlightedTicketIds = [...this.newTicketIds];
  
    setTimeout(() => {
      this.highlightedTicketIds = [];
    }, 2000);
  }
  
  isTicketHighlighted(ticketId: number): boolean {
    return this.highlightedTicketIds.includes(ticketId);
  }
}
