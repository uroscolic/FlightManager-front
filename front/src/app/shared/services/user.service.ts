import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole, UserViewModel } from '../models/user.model';
import { environment } from '../../../environment/environment';
import { LoginViewModel, SignUpViewModel } from '../models/loginSignUp.model';
import { PageableResponse } from '../models/pageableResponse.model';

const LOGIN = "/login";
const CLIENT = "/client";
const MANAGER = "/manager";
const REGISTER = "/register";
const ALL_USERS = "/admin/all-users";
const BAN = "/ban";


@Injectable({
  providedIn: 'root',
})
export class UserService {

  private url: string = environment.userServiceUrl;
  

  constructor(private http: HttpClient) { }

  getUsers(): Observable<PageableResponse<UserViewModel[]>> {

    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : '';
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.get<PageableResponse<UserViewModel[]>>(
      this.url + ALL_USERS, 
      { headers }
    );
  }

  getClients(): Observable<PageableResponse<UserViewModel[]>> {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : '';
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.get<PageableResponse<UserViewModel[]>>(
      this.url + CLIENT, 
      { headers }
    );
  }

  banUser(request: UserViewModel) {

    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : '';
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    const role = request.roleType === UserRole.Client ? CLIENT : MANAGER;
    console.log(role);
    request.banned = !request.banned;
    console.log(request);
    const a =  this.http.put<UserViewModel>(
      this.url + role + BAN, request,
      { headers }
    );
    console.log(a);
    return a;
    
  }


  login(request: LoginViewModel) {
    return this.http.post<UserViewModel>(
      this.url + LOGIN, request
    )
  }
  signUp(request: SignUpViewModel) {
    return this.http.post<UserViewModel>(
      this.url + CLIENT + REGISTER, request
    )
  }


}