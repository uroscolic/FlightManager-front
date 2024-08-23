import { CommonModule } from '@angular/common';
import { Component, ElementRef,OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginViewModel } from '../shared/models/loginSignUp.model';
import { UserService } from '../shared/services/user.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('container') container: ElementRef;

  subscriptions: Subscription[] = [];

  loginFailed: boolean = false;
  signUpForm!: FormGroup;
  signUpFailed: boolean = false;
  showPassword: boolean = false;
  loginForm!: FormGroup;
  errorMessages = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Enter a valid email' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' }
    ],
    firstname: [
      { type: 'required', message: 'First name is required' },
      { type: 'minlength', message: 'First name must be at least 2 characters long' }
    ],
    lastname: [
      { type: 'required', message: 'Last name is required' },
      { type: 'minlength', message: 'Last name must be at least 2 characters long' }
    ]
  };
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required,Validators.minLength(8)]]
    });

    this.signUpForm = this.formBuilder.group({
      firstname: ['',[Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z]+$')]],
      lastname: ['',[Validators.required, Validators.minLength(2)]], 
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(8)]]
    });

    this.loginFailed = false;
    this.signUpFailed = false;
    this.showPassword = false;
  }

  onLoginSubmit() : void {
    if (this.loginForm.valid) {
      const loginEmail = this.loginForm.value.email;
      const loginPassword = this.loginForm.value.password;
      const loginPost = <LoginViewModel>{
        email: loginEmail,
        password: loginPassword
      }
      console.log(loginPost);
      this.subscriptions.push(this.userService.login(loginPost)
        .subscribe(
          response => {
            if (response) {
              this.loginFailed = false;
              this.loginForm.reset();
              sessionStorage.setItem('id', response.id.toString());
              sessionStorage.setItem('firstName', response.firstName.toString());
              sessionStorage.setItem('lastName', response.lastName.toString());
              sessionStorage.setItem('email', response.email.toString());
              sessionStorage.setItem('roleType', response.roleType.toString());
              sessionStorage.setItem('token', response.token.toString());

              //this.router.navigate(['/users']);
              console.log('Login successful:', response);
            } else {
              this.loginFailed = true;
            }
          },
          error => {
            console.error('Error during login:', error);
            this.loginFailed = true;
          }
        ));

    } else {
      this.loginFailed = true;
    }
  }

  onSignUpSubmit() : void {
    console.log(this.signUpForm.value);
    console.log(this.signUpForm.valid);
    if (this.signUpForm.valid) {
      this.signUpFailed = false;
      const signUpFirstName = this.signUpForm.value.firstname;
      const signUpLastName = this.signUpForm.value.lastname;
      const signUpEmail = this.signUpForm.value.email;
      const signUpPassword = this.signUpForm.value.password;
      const signUpPost = {
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      }

      this.subscriptions.push(this.userService.signUp(signUpPost)
        .subscribe(
          response => {
            if (response) {
              this.signUpFailed = false;
              this.signUpForm.reset();
              console.log('Sign up successful:', response);
            } else {
              this.signUpFailed = true;
            }
          },
          error => {
            console.error('Error during sign up:', error);
            this.signUpFailed = true;
          }
      ));
    } else {
      this.signUpFailed = true;
    }
  }

  togglePasswordVisibility() : void {
    this.showPassword = !this.showPassword
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }

  signIn() {
    this.container.nativeElement.classList.remove('right-panel-active');
  }

  signUp() {
    this.container.nativeElement.classList.add('right-panel-active');
  }
}
