import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule} from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { CommonModule} from '@angular/common'; 
import { Router } from '@angular/router';

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
  constructor(private router: Router) { }
  
  isCollapsed = true;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  firstName: string = '';
  lastName: string = '';

  adminRoutes = [
    {
      name: 'Dashboard',
      url: '/navigation',
      icon: 'home'
    },
    {
      name: 'Users',
      url: '/users',
      icon: 'group'
    },
    {
      name: 'Airports and Planes',
      url: '/airports&planes',
      icon: 'connecting_airports'
    },
    {
      name: 'Packages, Options and Coupons',
      url: '/packages&options&coupons',
      icon: 'inventory'
    },
    {
      name: 'Flights and Locations',
      url: '/flights&locations',
      icon: 'map'
    },
    {
      name: 'Tickets and Passengers',
      url: '/tickets&passengers',
      icon: 'airplane_ticket'
    },
    
  ];

  userRoutes = [
    {
      name: 'Dashboard',
      url: '/navigation',
      icon: 'home'
    },
    {
      name: 'Users',
      url: '/users',
      icon: 'group'
    },
    
    
  ];

  managerRoutes = [
    {
      name: 'Dashboard',
      url: '/navigation',
      icon: 'home'
    },
    {
      name: 'Users',
      url: '/users',
      icon: 'group'
    },
    {
      name: 'Airports and Planes',
      url: '/airports&planes',
      icon: 'connecting_airports'
    },
    {
      name: 'Packages, Options and Coupons',
      url: '/packages&options&coupons',
      icon: 'inventory'
    },
    {
      name: 'Flights and Locations',
      url: '/flights&locations',
      icon: 'map'
    },
    {
      name: 'Tickets and Passengers',
      url: '/tickets&passengers',
      icon: 'airplane_ticket'
    },
  
  ];

  // ngOnInit() {

  //   const firstName = sessionStorage.getItem('firstName');
  //   const lastName = sessionStorage.getItem('lastName');

  //   this.firstName = firstName ? firstName : '';
  //   this.lastName = lastName ? lastName : '';
  // }

  toggleMenu() {
    if (this.sidenav.opened) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
    this.isCollapsed = !this.isCollapsed;
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  logOut() {  
    sessionStorage.removeItem('roleType');
    sessionStorage.removeItem('lastName');
    sessionStorage.removeItem('firstName');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('id');
    this.router.navigate(['/navigation']);
  }
}