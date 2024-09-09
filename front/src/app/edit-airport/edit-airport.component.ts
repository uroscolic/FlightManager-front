import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UploadImageComponent } from '../upload-image/upload-image.component';
import { FlightBookingService } from '../shared/services/flight-booking.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AirportUpdateModel, AirportViewModel, LocationViewModel } from '../shared/models/flight-booking.model';
import { GenericConfirmDialogComponent } from '../shared/generic-confirm-dialog/generic-confirm-dialog.component';


const AIRPORTS_PLANES = '/airports&planes';
const HOME = '/home';

@Component({
  selector: 'app-edit-airport',
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
  templateUrl: './edit-airport.component.html',
  styleUrl: './edit-airport.component.css'
})
export class EditAirportComponent implements OnInit {

  subscriptions: Subscription[] = [];
  currentRole: string = '';

  airportForm: FormGroup;
  airportForEditing!: AirportViewModel;


  newAirport: { oldName: string, newName: string, location: LocationViewModel } = {
    oldName: '',
    newName: '',
    location: {
      id: -1,
      country: '',
      city: '',
      shortName: ''
    }
  }


  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private flightBookingService: FlightBookingService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];

    this.currentRole = sessionStorage.getItem('roleType') || localStorage.getItem('roleType') || '';
    this.currentRole !== 'ROLE_ADMIN' ? this.router.navigate([HOME]) : null;


    this.getAirportById(id);
    this.initializeForm();
  }


  initializeForm() {

    this.airportForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]]
    });
  }

  editAirport() {
    if (this.airportForm.invalid) {
      return;
    }

    this.newAirport.newName = this.airportForm.value.name;
    console.log(this.newAirport);

    this.dialog.open(GenericConfirmDialogComponent, {
      data: {
        title: 'Edit Airport',
        message: `Are you sure you want to change the name of "${this.newAirport.oldName}"?`
      }
    }).afterClosed().subscribe((response) => {
      if (response) {
        this.subscriptions.push(this.flightBookingService.updateAirport(this.newAirport).subscribe(
          (res) => {
            if (res) {
              this.router.navigate([AIRPORTS_PLANES]);
            }

          },
          (error) => {
            console.log('Error adding plane:', error);
            this.airportForm.reset();
          }
        ));
      }
    });



  }

  getAirportById(id: number) {
    this.subscriptions.push(this.flightBookingService.getAirportById(id).subscribe((response) => {
      this.airportForEditing = response;
      this.airportForm.patchValue(this.airportForEditing);
      this.newAirport.oldName = this.airportForEditing.name;
      this.newAirport.location = this.airportForEditing.location;
    }));
  }


}
