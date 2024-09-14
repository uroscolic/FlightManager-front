import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
  showSignUpPassword: boolean = false;
  showPassword: boolean = false;
  loginForm!: FormGroup;
  rememberMe: boolean = false;
  loginAndRememberMe: boolean = false;

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
  errorMessageSignUp!: string;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.signUpForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z]+$')]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.resetData();
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const loginEmail = this.loginForm.value.email;
      const loginPassword = this.loginForm.value.password;
      const loginPost: LoginViewModel = {
        email: loginEmail,
        password: loginPassword
      };

      this.subscriptions.push(this.userService.login(loginPost)
        .subscribe(
          response => {
            if (response) {
              this.loginFailed = false;
              this.loginForm.reset();

              sessionStorage.clear();

              if (this.rememberMe) {
                this.saveUserDataToLocalStorage(response);
              } else {
                this.saveUserDataToSessionStorage(response);
              }

              this.router.navigate(['/navigation']);
            } else {
              this.loginFailed = true;
            }
          },
          error => {
            console.error('Error during login:', error);
            if (error.status === 500) {
              this.errorMessage = 'Invalid email or password. Please try again.';
            } else {
              this.errorMessage = 'An error occurred during log in. Please try again.';
            }
            this.loginFailed = true;
          }
        ));
    } else {
      this.loginFailed = true;
    }
  }
  onSignUpSubmit(): void {
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
      };

      this.subscriptions.push(this.userService.signUp(signUpPost).subscribe(
        response => {
          if (response) {
            this.signUpFailed = false;
            this.signUpForm.reset();
            console.log('Sign up successful:', response);

            // Check if loginAndRememberMe is selected
            if (this.loginAndRememberMe) {
              // Automatski login nakon registracije
              const loginPost: LoginViewModel = {
                email: signUpEmail,
                password: signUpPassword
              };

              this.subscriptions.push(this.userService.login(loginPost).subscribe(
                loginResponse => {
                  if (loginResponse) {
                    this.loginFailed = false;

                    this.saveUserDataToLocalStorage(loginResponse);

                    this.router.navigate(['/navigation']);
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
              console.log('User signed up but opted not to log in immediately.');
            }
          } else {
            this.signUpFailed = true;
          }
        },
        error => {

          console.error('Error during sign up:', error);
          if (error.status === 500) {
            this.errorMessageSignUp = 'Email is already registered. Please use a different email.';
          } else {
            this.errorMessageSignUp = 'An error occurred during sign up. Please try again.';
          }
          this.signUpFailed = true;
        }
      ));
    } else {
      this.signUpFailed = true;
    }
  }

  saveUserDataToLocalStorage(response: any) {
    localStorage.setItem('id', response.id.toString());
    localStorage.setItem('firstName', response.firstName.toString());
    localStorage.setItem('lastName', response.lastName.toString());
    localStorage.setItem('email', response.email.toString());
    localStorage.setItem('roleType', response.roleType.toString());
    localStorage.setItem('token', response.token.toString());
    localStorage.setItem('rememberMe', 'true');
  }

  saveUserDataToSessionStorage(response: any) {
    sessionStorage.setItem('id', response.id.toString());
    sessionStorage.setItem('firstName', response.firstName.toString());
    sessionStorage.setItem('lastName', response.lastName.toString());
    sessionStorage.setItem('email', response.email.toString());
    sessionStorage.setItem('roleType', response.roleType.toString());
    sessionStorage.setItem('token', response.token.toString());
  }

  resetData() {
    this.loginFailed = false;
    this.signUpFailed = false;
    this.showPassword = false;
    this.showSignUpPassword = false;
    this.loginAndRememberMe = false;
    this.rememberMe = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }
  toggleSignUpPasswordVisibility(): void {
    this.showSignUpPassword = !this.showSignUpPassword
  }

  toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  toggleLoginAndRememberMe(): void {
    this.loginAndRememberMe = !this.loginAndRememberMe;
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
