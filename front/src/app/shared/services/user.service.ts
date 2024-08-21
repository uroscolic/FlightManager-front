import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  // private apiUrl = 'http://localhost:8080/api/user';

  // constructor(private http: HttpClient) { }

  // getUsers(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }
  constructor() { }

  getUsers() {
    // Ovde bi trebalo da ide HTTP poziv prema serveru.
    // Ovo je primer statičkih podataka.
    return [
      { id: 1, name: 'John Doe', role: UserRole.Client },
      { id: 2, name: 'Jane Smith', role: UserRole.Manager },
      { id: 3, name: 'Emily White', role: UserRole.Admin },
    ];
  }
}