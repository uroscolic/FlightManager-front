import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path: '', redirectTo : 'login', pathMatch: 'full'},
    {path: 'users', component: UserListComponent},
    {path : "login" , component: LoginComponent},
];
