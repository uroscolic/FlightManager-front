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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OptionForPackageViewModel, OptionViewModel, PackageViewModel } from '../shared/models/flight-booking.model';
import { get } from 'http';


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
    MatOptionModule,
    MatCheckboxModule 
  
  ],
  templateUrl: './packages-options-coupons.component.html',
  styleUrl: './packages-options-coupons.component.css'
})
export class PackagesOptionsCouponsComponent implements OnInit {



  displayedCouponColumns: string[] = ['couponCode', 'discount', 'active'];
  displayedOptionColumns: string[] = ['id', 'name', 'price'];
  displayedPackageColumns: string[] = ['id', 'name', 'price', 'options'];

  dataSourceCoupon: MatTableDataSource<CouponViewModel> = new MatTableDataSource<CouponViewModel>([]);
  dataSourceOption: MatTableDataSource<OptionViewModel> = new MatTableDataSource<OptionViewModel>([]);
  dataSourcePackage: MatTableDataSource<PackageViewModel> = new MatTableDataSource<PackageViewModel>([]);

  columnMappings: { [key: string]: string } = {
    couponCode: 'Coupon Code',
    discount: 'Discount (%)',
    active: 'Active',
    id: 'ID',
    name: 'Name',
    price: 'Price (€)',
    options: 'Options'
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
      displayedColumns: ['id', 'name', 'price', 'options']
    }
  };
  
  
  subscriptions: Subscription[] = [];
  selectedOption: string = 'coupons';

  optionsForNewPackage: OptionViewModel[] = [];
  optionsForPackage: { [key: string]: OptionViewModel[] } = {}

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  couponFields = [
    {label : 'Coupon Code', name: 'couponCode', type: 'text'},
    {label : 'Discount (%)', name: 'discount', type: 'number'},
  ];

  optionFields = [
    {label : 'Name', name: 'name', type: 'text'},
    {label : 'Price (€)', name: 'price', type: 'number'},
  ];

  packageFields = [
    {label : 'Name', name: 'name', type: 'text'},
    {label : 'Options', name: 'options', type: 'text'},
  ];

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

  newPackage: { id: number, name: string, price: number } = {
    id: -1,
    name: '',
    price: 0
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
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      //opcije
    });
  }

  resetForms() {
    this.couponForm.reset();
    this.optionForm.reset();
    this.resetPackageForm();
  }

  resetPackageForm() {
    this.packageForm.reset();
    this.optionsForNewPackage = [];
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

  toggleOptionSelection(option: OptionViewModel) {
    if(this.optionsForNewPackage.includes(option)) {
      this.optionsForNewPackage = this.optionsForNewPackage.filter(o => o !== option);
    }
    else {
      this.optionsForNewPackage.push(option);
    }
  }

  addPackage() {
    if(this.packageForm.valid) {

      this.newPackage.name = this.packageForm.value.name;
      this.newPackage.price = this.optionsForNewPackage.reduce((acc, curr) => acc + curr.price, 0);

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
                for (const option of this.optionsForNewPackage) {
                  this.addOptionToPackage(option, res);
                }
                this.getPackages();
                this.resetPackageForm();
              }
            },
            (error) => {
              console.log('Error adding package:', error);
              this.resetPackageForm();
            }
          ));
        }
      });
    }
  }

  addOptionToPackage(option: OptionViewModel, _package: PackageViewModel) {
    const optionForPackage: OptionForPackageViewModel = {
      option,
      _package: _package
    };
    this.subscriptions.push(this.flightBookingService.addOptionForPackage(optionForPackage).subscribe(
      (res) => {
        if (res) {
          this.getPackages();
          this.resetPackageForm();
        }
      },
      (error) => {
        console.log('Error adding options to package:', error);
        this.resetPackageForm();
      }
    ));
  }

  getOptionsForPackage(_package: PackageViewModel) {
    this.subscriptions.push(this.flightBookingService.getOptionsForPackage(_package).subscribe(res => {
      const optionsGroupedByPackageId = res.content.reduce((acc: { [key: string]: OptionViewModel[] }, curr: OptionForPackageViewModel) => {
        const packageId = curr._package.id;
        if (!acc[packageId]) {
          acc[packageId] = [];
        }
        acc[packageId].push(curr.option);
        return acc;
      }, {});
  
      // Update the optionsForPackage property
      this.optionsForPackage = optionsGroupedByPackageId;
      // If you need to refresh the table or any related UI, trigger it here
    }));
  }

  getOptions() {
    this.subscriptions.push(this.flightBookingService.getOptions().subscribe(res => {
      this.dataSourceOption.data = res.content;
      this.dataSourceOption.paginator = this.paginator;
      this.dataSourceOption.sort = this.sort;
    }));
  }

  getOptionsAsString(packageId: number): string {
    const options = this.optionsForPackage[packageId];
    return options ? options.map(option => option.name).join(', ') : '';
  }

  getPackages() {
    this.subscriptions.push(this.flightBookingService.getPackages().subscribe(res => {
      const packages = res.content;
      this.dataSourcePackage.data = res.content;
      this.dataSourcePackage.paginator = this.paginator;
      this.dataSourcePackage.sort = this.sort;

      for (const _package of packages) {
        this.getOptionsForPackage(_package);
      }
    }));
    
  }

}
