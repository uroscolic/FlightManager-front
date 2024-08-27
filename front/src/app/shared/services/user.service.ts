import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole, UserViewModel } from '../models/user.model';
import { environment } from '../../../environment/environment';
import { LoginViewModel, SignUpViewModel } from '../models/loginSignUp.model';
import { PageableResponse } from '../models/pageableResponse.model';
import { UtilityService } from './utility.service';

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
  
  constructor(private http: HttpClient, private utilityService: UtilityService) { }

  getUsers(): Observable<PageableResponse<UserViewModel[]>> {

    const headers = this.utilityService.getHeaders();
    return this.http.get<PageableResponse<UserViewModel[]>>(
      this.url + ALL_USERS, 
      { headers }
    );
  }

  getClients(): Observable<PageableResponse<UserViewModel[]>> {
    const headers = this.utilityService.getHeaders();
    return this.http.get<PageableResponse<UserViewModel[]>>(
      this.url + CLIENT, 
      { headers }
    );
  }

  banUser(request: UserViewModel) {

    const headers = this.utilityService.getHeaders();

    const role = request.roleType === UserRole.Client ? CLIENT : MANAGER;
    request.banned = !request.banned;
    return this.http.put<UserViewModel>(
      this.url + role + BAN, request,
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