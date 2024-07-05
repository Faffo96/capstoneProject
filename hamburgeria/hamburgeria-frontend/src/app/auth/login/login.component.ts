import { Component, OnInit } from '@angular/core';
import { AuthData } from '../../models/auth-data.interface';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResponseModalComponent } from '../../Components/response-modal/response-modal.component';
import { ErrorService } from '../../Services/error-service.service';

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
    private router: Router,
    private errorService: ErrorService // Inietta il servizio di gestione degli errori
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
      this.authService.login(this.loginForm.value).subscribe(
        () => {
          this.router.navigate(['/']);
        },
        error => {
          this.errorService.handleError(error); // Utilizza il servizio di gestione degli errori
        }
      );
    } else {
      this.errorService.showErrorModal('❌ Errore nel login', 'Per favore, compila correttamente il modulo di login o registrati');
    }
  }
}