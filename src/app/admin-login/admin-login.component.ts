import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Admin {
  adminId: string;
  password: string;
  keepSigned: boolean;
}

@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

 admin: Admin = {
  adminId: 'admin@gmail.com',
  password: 'admin1234',
  keepSigned: true
};

  showPassword: boolean = false;

  formError: string = '';
  formSuccess: string = '';

  constructor(private router: Router) {}

  // Toggle Password Visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Forgot Password Navigation
  goToForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/forgot-password']);
  }

  // Submit Login
  // Submit Login
onSubmit(): void {

  this.formError = '';
  this.formSuccess = '';

  const adminIdValue = this.admin.adminId?.trim();
  const passwordValue = this.admin.password?.trim();

  // DEFAULT TEST ADMIN CREDENTIALS
  const defaultAdminId = 'admin@gmail.com';
  const defaultPassword = 'admin1234';

  // EMPTY VALIDATION
  if (!adminIdValue || !passwordValue) {

    this.formError = 'Please fill all required fields';

    return;
  }

  // CHECK ADMIN ID
  if (adminIdValue !== defaultAdminId) {

    this.formError = 'Invalid Admin ID';

    return;
  }

  // CHECK PASSWORD
  if (passwordValue !== defaultPassword) {

    this.formError = 'Invalid Password';

    return;
  }

  // SUCCESS
  this.formSuccess = 'Admin logged in successfully!';

  console.log('Admin Login Data:', {
    adminId: this.admin.adminId,
    keepSigned: this.admin.keepSigned
  });

  // NAVIGATE
  setTimeout(() => {

    this.router.navigate(['/admin-dashboard']);

    this.admin = {
      adminId: '',
      password: '',
      keepSigned: false
    };

    this.formSuccess = '';

  }, 1000);

}
}