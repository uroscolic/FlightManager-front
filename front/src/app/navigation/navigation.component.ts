import { Component, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GenericConfirmDialogComponent } from '../shared/generic-confirm-dialog/generic-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private dialog: MatDialog,) { }

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  firstName: string = '';
  lastName: string = '';
  roleType: string = '';
  roleString: string = '';

  adminRoutes = [
    { name: 'Home Page', url: '/navigation', icon: 'home' },
    { name: 'Users', url: '/users', icon: 'group' },
    { name: 'Airports and Planes', url: '/airports&planes', icon: 'connecting_airports' },
    { name: 'Packages, Options and Coupons', url: '/packages&options&coupons', icon: 'inventory' },
    { name: 'Flights and Locations', url: '/flights&locations', icon: 'map' },
    { name: 'Tickets and Passengers', url: '/tickets&passengers', icon: 'airplane_ticket' },
  ];

  userRoutes = [
    { name: 'Home Page', url: '/navigation', icon: 'home' },
    { name: 'My Tickets', url: '/tickets', icon: 'wallet' },
  ];

  notLoggedInRoutes = [
    { name: 'Home Page', url: '/navigation', icon: 'home' },
  ];

  managerRoutes = [
    { name: 'Home Page', url: '/navigation', icon: 'home' },
    { name: 'Users', url: '/users', icon: 'group' },
    { name: 'Airports and Planes', url: '/airports&planes', icon: 'connecting_airports' },
    { name: 'Packages, Options and Coupons', url: '/packages&options&coupons', icon: 'inventory' },
    { name: 'Flights and Locations', url: '/flights&locations', icon: 'map' },
    { name: 'Tickets and Passengers', url: '/tickets&passengers', icon: 'airplane_ticket' },
    { name: 'Change Password', url: '/change-password', icon: 'lock' }
  ];

  login = {
    name: 'Log in',
    url: '/login',
    icon: 'login'
  };

  routes: any[] = this.userRoutes;

  get loggedIn(): boolean {
    if (this.rememberMeChecked) {
      return this.firstName !== '' && this.lastName !== '' && !!localStorage.getItem('token');
    }
    return this.firstName !== '' && this.lastName !== '' && !!sessionStorage.getItem('token');
  }

  get rememberMeChecked(): boolean {
    return !!localStorage.getItem('rememberMe');
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.rememberMeChecked) {
        this.firstName = sessionStorage.getItem('firstName') || '';
        this.lastName = sessionStorage.getItem('lastName') || '';
        this.roleType = sessionStorage.getItem('roleType') || '';
      }
      else {
        this.firstName = localStorage.getItem('firstName') || '';
        this.lastName = localStorage.getItem('lastName') || '';
        this.roleType = localStorage.getItem('roleType') || '';
      }

      this.setRoutesAndRoleString();
    }
  }

  setRoutesAndRoleString() {

    switch (this.roleType) {
      case 'ROLE_ADMIN':
        this.roleString = '(Admin)';
        this.routes = this.adminRoutes;
        break;
      case 'ROLE_MANAGER':
        this.roleString = '(Manager)';
        this.routes = this.managerRoutes;
        break;
      case 'ROLE_CLIENT':
        this.roleString = '';
        this.routes = this.userRoutes;
        break;
      default:
        this.routes = this.notLoggedInRoutes;
        break;
    }
  }

  toggleMenu() {
    this.sidenav.opened ? this.sidenav.close() : this.sidenav.open();
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  logOut() {

    this.dialog.open(GenericConfirmDialogComponent, {
      disableClose: true,
      data: {
        title: 'Log out',
        message: 'Are you sure you want to log out?'
      }
    }).afterClosed().subscribe((confirmed) => {

      if (confirmed) {
        if (!this.rememberMeChecked) {
          sessionStorage.removeItem('roleType');
          sessionStorage.removeItem('lastName');
          sessionStorage.removeItem('firstName');
          sessionStorage.removeItem('email');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('id');
          this.firstName = '';
          this.lastName = '';
          this.roleType = '';
          this.routes = this.notLoggedInRoutes;
          this.router.navigate(['/home']);
        }
        else {
          localStorage.removeItem('roleType');
          localStorage.removeItem('lastName');
          localStorage.removeItem('firstName');
          localStorage.removeItem('email');
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          localStorage.removeItem('rememberMe');
          this.firstName = '';
          this.lastName = '';
          this.roleType = '';
          this.routes = this.notLoggedInRoutes;
          this.router.navigate(['/home']);
        }
      }
    });

  }

}