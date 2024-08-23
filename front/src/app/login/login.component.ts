import { CommonModule } from '@angular/common';
import { Component, ElementRef,OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('container') container: ElementRef;

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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required,Validators.minLength(8)]]
    });

    this.signUpForm = this.formBuilder.group({
      firstname: ['',[Validators.required,Validators.minLength(2)]],
      lastname: ['',[Validators.required,Validators.minLength(2)]], 
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required,Validators.minLength(8)]]
    });

    this.loginFailed = false;
    this.signUpFailed = false;
    this.showPassword = false;
  }

  onLoginSubmit() : void {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      const loginEmail = this.loginForm.get('email')?.value;
      const loginPassword = this.loginForm.get('password')?.value;
      

      this.loginFailed = false;
    } else {
      this.loginFailed = true;
    }
  }

  onSignUpSubmit() : void {
    console.log(this.signUpForm.value);
    console.log(this.signUpForm.valid);
    if (this.signUpForm.valid) {
      this.signUpFailed = false;
    } else {
      this.signUpFailed = true;
    }
  }

  togglePasswordVisibility() : void {
    this.showPassword = !this.showPassword
  }

  ngOnDestroy(): void {
      
  }

  signIn() {
    this.container.nativeElement.classList.remove('right-panel-active');
  }

  signUp() {
    this.container.nativeElement.classList.add('right-panel-active');
  }
}
