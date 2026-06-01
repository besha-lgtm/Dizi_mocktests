import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
interface User {
  email: string;
  password: string;
  keepSigned: boolean;
}

@Component({
  selector: 'app-teacher-login',
  standalone: false,
  templateUrl: './teacher-login.component.html',
  styleUrl: './teacher-login.component.css'
})
export class TeacherLoginComponent implements OnInit {
  user: User = {
    email: 'teacher@gmail.com',
    password: 'teacher1234',
    keepSigned: true
  };

  showPassword: boolean = false;
  
  formError: string = '';
  formSuccess: string = '';

  constructor(
  private router: Router,
  private location: Location
) {}

  ngOnInit() {
    // Initialization logic if needed
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Navigation to teacher register page
  goToSignUp(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/teacher-register']);
  }

  // Navigation to forgot password page
  goToForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/forgot-password']);
  }

  onSubmit(): void {
    // Clear previous messages
    this.formError = '';
    this.formSuccess = '';

    const emailValue = this.user.email?.trim();
    const passwordValue = this.user.password?.trim();

    // Default static teacher credentials
    const defaultTeacherEmail = 'teacher@gmail.com';
    const defaultPassword = 'teacher1234';

    // Email format validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailValue && emailRegex.test(emailValue);

    // Password validation (min 8 characters)
    const isPasswordValid = passwordValue && passwordValue.length >= 8;

    // Show error if email or password is empty/invalid
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

    // Static credentials checking
    if (emailValue !== defaultTeacherEmail) {
      this.formError = 'Invalid Teacher Email';
      return;
    }

    if (passwordValue !== defaultPassword) {
      this.formError = 'Invalid Password';
      return;
    }

    // Success
    this.formSuccess = 'Teacher logged in successfully!';
    console.log('Teacher Login Data:', {
      email: this.user.email,
      keepSigned: this.user.keepSigned
    });

    // Navigate to teacher dashboard after successful login
    setTimeout(() => {
      this.router.navigate(['/teacher-dashboard']);
      this.user = { email: '', password: '', keepSigned: false };
      this.formSuccess = '';
    }, 1500);
  }
  goBack(): void {
  this.router.navigate(['/']);
}
}
