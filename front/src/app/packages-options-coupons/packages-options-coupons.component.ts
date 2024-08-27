import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationComponent } from "../navigation/navigation.component";
import { Subscription } from 'rxjs';
import { FlightBookingService } from '../shared/services/flight-booking.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CouponViewModel } from '../shared/models/coupon.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GenericConfirmDialogComponent } from '../shared/generic-confirm-dialog/generic-confirm-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-packages-options-coupons',
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
    MatOptionModule
  
  ],
  templateUrl: './packages-options-coupons.component.html',
  styleUrl: './packages-options-coupons.component.css'
})
export class PackagesOptionsCouponsComponent implements OnInit {


  //TODO - kad se klikne cancel za promenu statusa, da se vrati na prethodno stanje

  displayedColumns: string[] = ['couponCode', 'discount', 'active'];
  dataSource: MatTableDataSource<CouponViewModel> = new MatTableDataSource<CouponViewModel>([]);
  subscriptions: Subscription[] = [];
  selectedOption: string = 'coupons';

  newCoupon: { couponCode: string; discount: number; active: boolean } = {
    couponCode: '',
    discount: 0,
    active: false
  };
  newCouponForm!: FormGroup;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private flightBookingService:FlightBookingService) {}

  ngOnInit(): void {

    this.newCouponForm = this.formBuilder.group({
      couponCode: ['', Validators.required],
      discount: ['', Validators.required],
      // active: ['']
    });

    this.getCoupons();
  }

  getCoupons() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem('token');
      
      this.subscriptions.push(this.flightBookingService.getCoupons().subscribe(res => {
        this.dataSource.data = res.content;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }));
    } else {
      console.error('sessionStorage is not available.');
    }
  }

  toggleCouponStatus(coupon: CouponViewModel) {
    this.dialog.open(GenericConfirmDialogComponent, {
      disableClose: true,
      data: {
        title: 'Confirm',
        message: `Are you sure you want to ${coupon.active ? 'deactivate' : 'activate'} this coupon?`
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.subscriptions.push(this.flightBookingService.toggleCouponStatus(coupon).subscribe(
          (res) => {
            if (res) {
              this.getCoupons();
            }
          },
          (error) => {
            console.log('Error changing coupon status:', error);
          }
        ));
      }
    });
  }

  addCoupon() {
    if(this.newCouponForm.valid) {

      this.newCoupon.couponCode = this.newCouponForm.value.couponCode;
      this.newCoupon.discount = this.newCouponForm.value.discount;
      // this.newCoupon.active = this.newCouponForm.value.active;

      this.dialog.open(GenericConfirmDialogComponent, {
        disableClose: true,
        data: {
          title: 'Confirm',
          message: `Are you sure you want to add this coupon?`
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.subscriptions.push(this.flightBookingService.addCoupon(this.newCoupon).subscribe(
            (res) => {
              if (res) {
                this.getCoupons();
              }
            },
            (error) => {
              console.log('Error adding coupon:', error);
            }
          ));
        }
      });
    }
    else {
      console.log(this.newCoupon);
      console.log(this.newCouponForm);
      console.error('Invalid form');
    }
  }

  getOptions() {
    // Get options
  }

  getPackages() {
    // Get packages
  }

}
