import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';

// User model for the template-driven form
interface User {
  email:      string;
  password:   string;
  keepSigned: boolean;
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  user: User = {
    email:      '',
    password:   '',
    keepSigned: false
  };

  showPassword: boolean = false;
  formError:    string  = '';
  formSuccess:  string  = '';
  isLoading:    boolean = false;

  constructor(
    private fb:          FormBuilder,
    private authService: AuthService,
    private router:      Router,
    private location:    Location
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:      ['', [Validators.required, Validators.email]],
      password:   ['', [Validators.required, Validators.minLength(8)]],
      keepSigned: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToSignUp(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register']);
  }

  goToForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/forgot-password']);
  }

  onSubmit(): void {
    if (this.isLoading) {
      return;
    }
    this.formError   = '';
    this.formSuccess = '';

    const emailValue    = this.user.email?.trim().toLowerCase();
    const passwordValue = this.user.password?.trim();

    // Client-side validation
    const emailRegex   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailValue && emailRegex.test(emailValue);
    const isPassValid  = passwordValue && passwordValue.length >= 8;

    if (!isEmailValid && !isPassValid) {
      this.formError = 'Please fill all required fields';
      return;
    } else if (!isEmailValid) {
      this.formError = 'Please enter a valid email';
      return;
    } else if (!isPassValid) {
      this.formError = 'Password must be at least 8 characters long';
      return;
    }

    // ── Call backend via AuthService ──────────────────────────
    this.isLoading = true;

    this.authService.login({ email: emailValue, password: passwordValue })
      .subscribe({
        next: (res) => {
          this.isLoading = false;

          if (res.success) {
            // Save JWT + user info using service helper
            this.authService.saveSession(
              res.token,
              res.user,
              res.role,
              this.user.keepSigned
            );

            this.formSuccess = res.message;

            setTimeout(() => {
              this.clearForm();
              this.router.navigate([res.redirectTo]);
            }, 1200);
          } else {
            this.formError = res.message || 'Login failed';
          }
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 401) {
            this.formError = err.error?.message || 'Invalid email or password';
          } else if (err.status === 0) {
            this.formError = 'Cannot reach server. Make sure backend is running.';
          } else {
            this.formError = 'Something went wrong. Please try again.';
          }
        }
      });
  }

  private clearForm(): void {
    this.user        = { email: '', password: '', keepSigned: false };
    this.formSuccess = '';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}

