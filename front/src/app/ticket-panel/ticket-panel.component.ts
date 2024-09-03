import { Component, Inject, Input } from '@angular/core';
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
export class TicketPanelComponent {
  @Input() ticket!: TicketViewModel;

  
}
