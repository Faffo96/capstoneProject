import { Component, OnInit } from '@angular/core';
import { AuthData } from '../../models/auth-data.interface';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  user!: AuthData | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: []
    });
  }

  login() {
    if (this.loginForm.valid) {
      console.log('Login form is valid. Attempting to login...');
      this.authService.login(this.loginForm.value).subscribe(
        () => {
          console.log('Login successful. Navigating to home page...');
          this.router.navigate(['/']);
        },
        error => {
          console.error('Login error:', error);
        }
      );
    } else {
      console.log('Login form is invalid.');
    }
  }
}