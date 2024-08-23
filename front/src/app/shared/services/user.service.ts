import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole, UserViewModel } from '../models/user.model';
import { environment } from '../../../environment/environment';
import { LoginViewModel, SignUpViewModel } from '../models/loginSignUp.model';
import { PageableResponse } from '../models/pageableResponse.model';

const LOGIN = "/login";
const CLIENT = "/client";
const REGISTER = "/register";


@Injectable({
  providedIn: 'root',
})
export class UserService {

  private url: string = environment.userServiceUrl;
  

  constructor(private http: HttpClient) { }

  getUsers(): Observable<PageableResponse<UserViewModel[]>> {

    console.log('getUsers');
    // onaj init smeta da bi se koristio sessionStorage normalno
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : '';
    console.log('token', token);
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.get<PageableResponse<UserViewModel[]>>(
      this.url + CLIENT, 
      { headers }
    );
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