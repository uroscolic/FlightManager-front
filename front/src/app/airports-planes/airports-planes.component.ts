import { Component, OnInit } from '@angular/core';
import { FlightBookingService } from '../shared/services/flight-booking.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { get } from 'http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GenericConfirmDialogComponent } from '../shared/generic-confirm-dialog/generic-confirm-dialog.component';
import { NavigationComponent } from "../navigation/navigation.component";
import { PlaneViewModel } from '../shared/models/plane.model';

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
    NavigationComponent
    
  ],
  templateUrl: './airports-planes.component.html',
  styleUrl: './airports-planes.component.css'
})
export class AirportsPlanesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'economySeats', 'businessSeats', 'firstClassSeats'];
  dataSource: MatTableDataSource<PlaneViewModel> = new MatTableDataSource<PlaneViewModel>([]);
  subscriptions: Subscription[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private flightBookingService:FlightBookingService) {}

  ngOnInit(): void {
    this.getPlanes();
  }
  getPlanes() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem('token');
      
      this.subscriptions.push(this.flightBookingService.getPlanes().subscribe(res => {
        this.dataSource.data = res.content;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }));
    } else {
      console.error('sessionStorage is not available.');
    }
  }
}
