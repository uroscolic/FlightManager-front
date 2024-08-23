import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';

export const routes: Routes = [
    {path: '', redirectTo : 'navigation', pathMatch: 'full'},
    {path: 'users', component: UserListComponent},
    {path : 'login' , component: LoginComponent},
    {path : 'navigation', component: NavigationComponent},
    {path: 'airports&planes', component: NavigationComponent},
    {path: '**', redirectTo: 'login', pathMatch: 'full'}
];
