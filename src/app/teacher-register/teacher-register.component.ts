import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

@Component({
  selector: 'app-teacher-register',
  standalone: false,
  templateUrl: './teacher-register.component.html',
  styleUrl: './teacher-register.component.css'
})
export class TeacherRegisterComponent implements OnInit {
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    institution: '',
    password: '',
    confirmPassword: '',
    terms: false
  };

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  formError: string = '';
  formSuccess: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize component if needed
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goBack(): void {
    this.router.navigate(['/mock-home']);
  }

  goToSignIn(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/teacher-login']);
  }

  doPasswordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }

  onSubmit(form: NgForm): void {
    // Clear previous messages
    this.formError = '';
    this.formSuccess = '';

    // Validate form
    if (form.invalid) {
      this.formError = 'Please fill all required fields correctly';
      return;
    }

    // Validate passwords match
    if (!this.doPasswordsMatch()) {
      this.formError = 'Passwords do not match';
      return;
    }

    // Validate terms
    if (!this.user.terms) {
      this.formError = 'You must agree to the terms and conditions';
      return;
    }

    // Show success message
    this.formSuccess = 'Teacher account created successfully!';
    console.log('Teacher Form submitted with data:', {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      institution: this.user.institution
    });

    // Reset form and redirect to teacher login after successful submission
    setTimeout(() => {
      form.resetForm();
      this.formSuccess = '';
      this.router.navigate(['/teacher-login']);
    }, 2000);
  }
}
