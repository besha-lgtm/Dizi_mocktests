import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// CHANGE: Added User interface to define login data structure
interface User {
  email: string;
  password: string;
  keepSigned: boolean;
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  // CHANGE: Added FormGroup property to hold the reactive form
  loginForm!: FormGroup;
  
  // CHANGE: Added user data model
  user: User = {
  email: 'student@gmail.com',
  password: 'student1234',
  keepSigned: true
};

  // CHANGE: Added password visibility toggle
  showPassword: boolean = false;
  
  // CHANGE: Added form validation messages
  formError: string = '';
  formSuccess: string = '';

  // CHANGE: Added FormBuilder and Router dependency injection
  constructor(private fb: FormBuilder, private router: Router, private location: Location) {}

  // CHANGE: Added ngOnInit lifecycle hook to initialize the form with validators
  ngOnInit() {
    // CHANGE: Created reactive form with validators for email format and password min 8 characters
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email format validation
      password: ['', [Validators.required, Validators.minLength(8)]], // Password min 8 characters
      keepSigned: [false]
    });
  }

  // CHANGE: Added togglePasswordVisibility method to show/hide password
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // CHANGE: Added goToSignUp method for navigation to register page
  goToSignUp(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register']);
  }

  // CHANGE: Added goToForgotPassword method for navigation to forgot password page
  goToForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/forgot-password']);
  }

  // CHANGE: Updated onSubmit() method to handle static credentials for Student, Teacher, and Admin
  onSubmit(): void {
    // Clear previous messages
    this.formError = '';
    this.formSuccess = '';

    const emailValue = this.user.email?.trim().toLowerCase();
    const passwordValue = this.user.password?.trim();

    // Validate email is not empty and is valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailValue && emailRegex.test(emailValue);

    // Validate password is not empty and has minimum 8 characters
    const isPasswordValid = passwordValue && passwordValue.length >= 8;

    // Show error if email or password is invalid
    if (!isEmailValid && !isPasswordValid) {
      this.formError = 'Please fill all required fields';
      return;
    } else if (!isEmailValid) {
      this.formError = 'Please enter a valid email';
      return;
    } else if (!isPasswordValid) {
      this.formError = 'Password must be at least 8 characters long';
      return;
    }

    // Static credentials checking and routing
    if (emailValue === 'student@gmail.com') {
      if (passwordValue === 'student1234') {
        this.formSuccess = 'Student logged in successfully!';
        setTimeout(() => {
          this.router.navigate(['/exam-selection']);
          this.clearForm();
        }, 1200);
      } else {
        this.formError = 'Incorrect password for Student';
      }
    } else if (emailValue === 'teacher@gmail.com') {
      if (passwordValue === 'teacher1234') {
        this.formSuccess = 'Teacher logged in successfully!';
        setTimeout(() => {
          this.router.navigate(['/teacher-dashboard']);
          this.clearForm();
        }, 1200);
      } else {
        this.formError = 'Incorrect password for Teacher';
      }
    } else if (emailValue === 'admin@gmail.com') {
      if (passwordValue === 'admin1234') {
        this.formSuccess = 'Admin logged in successfully!';
        setTimeout(() => {
          this.router.navigate(['/admin-dashboard']);
          this.clearForm();
        }, 1200);
      } else {
        this.formError = 'Incorrect password for Admin';
      }
    } else {
      this.formError = 'Invalid email or password';
    }
  }

  // Helper to clear form states
  private clearForm(): void {
    this.user = { email: '', password: '', keepSigned: false };
    this.formSuccess = '';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
