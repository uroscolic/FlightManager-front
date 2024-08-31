import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
import { UserService } from '../shared/services/user.service';
import { UserChangePasswordModel } from '../shared/models/user.model';
import { GenericConfirmDialogComponent } from '../shared/generic-confirm-dialog/generic-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
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
    MatCardModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {

  firstName: string = '';
  changingPasswordFailed: boolean = false;
  changingPasswordSuccess: boolean = false;

  errorMessages = {
    oldPassword: [
      { type: 'required', message: 'Old Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' }
    ],
    newPassword: [
      { type: 'required', message: 'New Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' }
    ],
    confirmPassword: [
      { type: 'required', message: 'Confirm Password is required' },
      { type: 'minlength', message: 'Confirm Password must be at least 8 characters long' }
    ]
  };

  errorMessage!: string;


  constructor(private dialog: MatDialog, private userService: UserService, private formBuilder: FormBuilder) { }

  changePasswordForm: FormGroup;
  subscriptions: Subscription[] = [];


  ngOnInit(): void {
    this.firstName = sessionStorage.getItem('firstName') || localStorage.getItem('firstName') || '';


    this.initializeForms();
    this.changingPasswordFailed = false;
    this.changingPasswordSuccess = false
  }

  initializeForms(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  changePassword(){
    if(this.changePasswordForm.valid){
      const request: UserChangePasswordModel = {
        id: parseInt(sessionStorage.getItem('id') || localStorage.getItem('id') || '-1'),
        oldPassword: this.changePasswordForm.value.oldPassword,
        newPassword: this.changePasswordForm.value.newPassword
      };
      this.dialog.open(GenericConfirmDialogComponent, {
        disableClose: true,
        data: {
          title: `Change Password`,
          message: `Are you sure you want to change your password?`,
        }
      }).afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.subscriptions.push(this.userService.changeManagerPassword(request).subscribe(
            (res) => {
              if (res) {
                this.changePasswordForm.reset();
                this.changingPasswordSuccess = true;
              }
            },
            (error) => {
              console.log('Error changing password:', error);
              this.errorMessage = 'Error changing password. Check your old password and try again.';
              this.changingPasswordFailed = true;
              this.changePasswordForm.reset();
            }
          ));
        }
      });

    }
    
  }

  togglePasswordVisibility(input: HTMLInputElement): void {
    input.type = input.type === 'password' ? 'text' : 'password';
  }

}
