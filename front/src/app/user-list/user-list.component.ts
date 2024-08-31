import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserRole, UserViewModel } from '../shared/models/user.model';
import { get } from 'http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { LoginComponent } from '../login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
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
  ]
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'roleType', 'ban'];
  dataSource: MatTableDataSource<UserViewModel> = new MatTableDataSource<UserViewModel>([]);
  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  currentRole: string = '';
  generatedPassword: string = '';

  constructor(private dialog: MatDialog, private userService: UserService, private formBuilder: FormBuilder) { }

  managerForm: FormGroup;

  ngOnInit(): void {
    this.currentRole = sessionStorage.getItem('roleType') || localStorage.getItem('roleType') || '';
    this.currentRole === 'ROLE_ADMIN' ? this.getUsers() : this.getClients();
    this.initializeForms();
    this.managerForm.valueChanges.subscribe(() => {
      this.generatePassword();
    });
  }

  initializeForms() {
    this.managerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]

    });

  }

  getUsers() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem('token');

      this.subscriptions.push(this.userService.getUsers().subscribe(res => {
        this.dataSource.data = res.content;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }));
    } else {
      console.error('sessionStorage is not available.');
    }
  }

  getClients() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem('token');

      this.subscriptions.push(this.userService.getClients().subscribe(res => {
        this.dataSource.data = res.content;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }));
    } else {
      console.error('sessionStorage is not available.');
    }
  }

  toggleBan(user: UserViewModel): void {

    this.dialog.open(GenericConfirmDialogComponent, {
      disableClose: true,
      data: {
        title: `${user.banned ? 'Unban' : 'Ban'} "${user.firstName} ${user.lastName}"`,
        message: `Are you sure you want to ${user.banned ? 'unban' : 'ban'} "${user.firstName} ${user.lastName}"?`,
      }
    }).afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.subscriptions.push(this.userService.banUser(user).subscribe(
          (res) => {
            if (res) {
              this.getUsers();
            }
          },
          (error) => {
            console.log(`Error ${user.banned ? 'unbanning' : 'banning'} user:`, error);
          }
        ));
      }
    });

  }

  addManager() {
    if (this.managerForm.valid) {
      const request: UserViewModel = {
        firstName: this.managerForm.value.firstName,
        lastName: this.managerForm.value.lastName,
        email: this.managerForm.value.email,
        roleType: UserRole.Manager,
        banned: false,
        password: this.generatedPassword,
        id: -1,
        token: ''
      };

      this.dialog.open(GenericConfirmDialogComponent, {

        disableClose: true,
        data: {
          title: `Add Manager`,
          message: `Are you sure you want to add a new manager?`,
        }
      }).afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.subscriptions.push(this.userService.addManager(request).subscribe(
            (res) => {
              if (res) {
                this.getUsers();
                this.managerForm.reset();
                this.generatedPassword = '';
              }
            },
            (error) => {
              console.log('Error adding manager:', error);
              this.managerForm.reset();
              this.generatedPassword = '';
            }
          ));
        }
      });
    }
  }

  isAdmin(): boolean {
    return this.currentRole === 'ROLE_ADMIN';
  }

  generatePassword() {
    if (this.managerForm.valid) {
      this.generatedPassword = this.createRandomPassword();
    } else {
      this.generatedPassword = '';
    }
  }

  createRandomPassword(): string {

    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}