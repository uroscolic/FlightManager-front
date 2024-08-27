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
import { OptionViewModel, PackageViewModel } from '../shared/models/flight-booking.model';

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



  displayedCouponColumns: string[] = ['couponCode', 'discount', 'active'];
  displayedOptionColumns: string[] = ['id', 'name', 'price'];
  displayedPackageColumns: string[] = ['id', 'name'];

  dataSourceCoupon: MatTableDataSource<CouponViewModel> = new MatTableDataSource<CouponViewModel>([]);
  dataSourceOption: MatTableDataSource<OptionViewModel> = new MatTableDataSource<OptionViewModel>([]);
  dataSourcePackage: MatTableDataSource<PackageViewModel> = new MatTableDataSource<PackageViewModel>([]);

  columnMappings: { [key: string]: string } = {
    couponCode: 'Coupon Code',
    discount: 'Discount (%)',
    active: 'Active',
    id: 'ID',
    name: 'Name',
    price: 'Price (€)'
  };

  itemConfig: { [key: string]: any } = {
    coupons: {
      itemName: 'Coupon',
      dataSource: this.dataSourceCoupon,
      action: () => this.addCoupon(),
      displayedColumns: ['couponCode', 'discount', 'active']
    },
    options: {
      itemName: 'Option',
      dataSource: this.dataSourceOption,
      action: () => this.addOption(),
      displayedColumns: ['id', 'name', 'price']
    },
    packages: {
      itemName: 'Package',
      dataSource: this.dataSourcePackage,
      action: () => this.addPackage(),
      displayedColumns: ['id', 'name']
    }
  };
  
  
  subscriptions: Subscription[] = [];
  selectedOption: string = 'coupons';

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  newCoupon: { couponCode: string; discount: number; active: boolean } = {
    couponCode: '',
    discount: 0,
    active: false
  };

  newOption: { id: number, name: string; price: number } = {
    id: -1,
    name: '',
    price: 0
  };

  newPackage: { id: number, name: string } = {
    id: -1,
    name: ''
  };


  couponForm: FormGroup;
  optionForm: FormGroup;
  packageForm: FormGroup;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private flightBookingService:FlightBookingService) {}

  ngOnInit(): void {

    this.initializeForms();

    this.getCoupons();
    this.getOptions();
    this.getPackages();
  }

  getForm() {
    switch (this.selectedOption) {
      case 'coupons':
        return this.couponForm;
      case 'options':
        return this.optionForm;
      case 'packages':
        return this.packageForm;
      default:
        return this.couponForm;
    }
  }


  initializeForms() {
    this.couponForm = this.formBuilder.group({
      couponCode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      //active: [false]
    });

    this.optionForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      price: ['', [Validators.required, Validators.min(0)]]
    });

    this.packageForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]]
    });
  }

  resetForms() {
    this.couponForm.reset();
    this.optionForm.reset();
    this.packageForm.reset();
  }

  getColumnLabel(column: string): string {
    return this.columnMappings[column] || column;
  }

  getItemName(): string {
    return this.itemConfig[this.selectedOption].itemName;
  }

  getDataSource() {
    return this.itemConfig[this.selectedOption].dataSource;
  }

  getAction() {
    this.itemConfig[this.selectedOption].action();
  }

  getDisplayedColumns() {
    return this.itemConfig[this.selectedOption].displayedColumns;
  }


  getCoupons() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      
      this.subscriptions.push(this.flightBookingService.getCoupons().subscribe(res => {
        this.dataSourceCoupon.data = res.content;
        this.dataSourceCoupon.paginator = this.paginator;
        this.dataSourceCoupon.sort = this.sort;
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
      else {
        this.getCoupons();
      }
    });
  }

  addCoupon() {
    if(this.couponForm.valid) {

      this.newCoupon.couponCode = this.couponForm.value.couponCode;
      this.newCoupon.discount = this.couponForm.value.discount;
      // this.newCoupon.active = this.couponForm.value.active;

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
                this.couponForm.reset();
              }
            },
            (error) => {
              console.log('Error adding coupon:', error);
              this.couponForm.reset();
            }
          ));
        }
      });
    }
    else {
      console.log(this.newCoupon);
      console.log(this.couponForm);
      console.error('Invalid form');
    }
    
  }

  addOption() {
    if(this.optionForm.valid) {

      this.newOption.name = this.optionForm.value.name;
      this.newOption.price = this.optionForm.value.price;

      this.dialog.open(GenericConfirmDialogComponent, {
        disableClose: true,
        data: {
          title: 'Confirm',
          message: `Are you sure you want to add this option?`
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.subscriptions.push(this.flightBookingService.addOption(this.newOption).subscribe(
            (res) => {
              if (res) {
                this.getOptions();
                this.optionForm.reset();
              }
            },
            (error) => {
              console.log('Error adding option:', error);
              this.optionForm.reset();
            }
          ));
        }
      });
    }
    
  }

  addPackage() {
    if(this.packageForm.valid) {

      this.newPackage.name = this.packageForm.value.name;

      this.dialog.open(GenericConfirmDialogComponent, {
        disableClose: true,
        data: {
          title: 'Confirm',
          message: `Are you sure you want to add this package?`
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.subscriptions.push(this.flightBookingService.addPackage(this.newPackage).subscribe(
            (res) => {
              if (res) {
                this.getPackages();
                this.packageForm.reset();
              }
            },
            (error) => {
              console.log('Error adding package:', error);
              this.packageForm.reset();
            }
          ));
        }
      });
    }
  }

  getOptions() {
    this.subscriptions.push(this.flightBookingService.getOptions().subscribe(res => {
      this.dataSourceOption.data = res.content;
      this.dataSourceOption.paginator = this.paginator;
      this.dataSourceOption.sort = this.sort;
    }));
  }

  getPackages() {
    this.subscriptions.push(this.flightBookingService.getPackages().subscribe(res => {
      this.dataSourcePackage.data = res.content;
      this.dataSourcePackage.paginator = this.paginator;
      this.dataSourcePackage.sort = this.sort;
    }));
  }

}
