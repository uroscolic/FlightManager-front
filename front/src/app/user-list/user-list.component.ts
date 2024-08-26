import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserViewModel } from '../shared/models/user.model';
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
    NavigationComponent
]
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'roleType', 'ban'];
  dataSource: MatTableDataSource<UserViewModel> = new MatTableDataSource<UserViewModel>([]);
  subscriptions: Subscription[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
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

  



  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}