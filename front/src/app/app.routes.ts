import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PackagesOptionsCouponsComponent } from './packages-options-coupons/packages-options-coupons.component';
import { AirportsPlanesComponent } from './airports-planes/airports-planes.component';
import { TicketsPassengersComponent } from './tickets-passengers/tickets-passengers.component';
import { FlightsLocationsComponent } from './flights-locations/flights-locations.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyTicketsComponent } from './my-tickets/my-tickets.component';
import { EditAirportComponent } from './edit-airport/edit-airport.component';
import { EditFlightComponent } from './edit-flight/edit-flight.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BookingPageComponent } from './booking-page/booking-page.component';

export const routes: Routes = [
    {path: '', redirectTo : 'home', pathMatch: 'full'},
    {path: 'users', component: UserListComponent},
    {path : 'login' , component: LoginComponent},
    {path : 'home', component: HomePageComponent},
    {path: 'packages&options&coupons', component: PackagesOptionsCouponsComponent},
    {path: 'airports&planes', component: AirportsPlanesComponent},
    {path: 'edit-airport/:id', component: EditAirportComponent},
    {path: 'tickets&passengers', component: TicketsPassengersComponent},
    {path: 'flights&locations', component: FlightsLocationsComponent},
    {path: 'edit-flight/:id', component: EditFlightComponent},
    {path: 'change-password', component: ChangePasswordComponent},
    {path: 'tickets', component: MyTicketsComponent},
    {path: 'book-flight', component: BookingPageComponent},
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
];
