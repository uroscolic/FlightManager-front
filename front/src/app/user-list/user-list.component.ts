import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserViewModel } from '../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [CommonModule]
})
export class UserListComponent implements OnInit {

  users: UserViewModel[] = [];
  subscriptions: Subscription[] = [];

  constructor(private userService: UserService) { }

  // ovo da ne bude u initu
  ngOnInit(): void {
    this.subscriptions.push(this.userService.getUsers().subscribe(res => {

      this.users = res.content;
    }));

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}