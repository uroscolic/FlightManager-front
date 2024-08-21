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
  showPassword: boolean = false;
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['',Validators.email],
      password: ['',[Validators.required,Validators.required]]
    });

    this.loginFailed = false;
    this.showPassword = false;
  }

  onLoginSubmit() : void {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.loginFailed = false;
    } else {
      this.loginFailed = true;
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
