import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  form = {
    fullName: '',
    email: '',
    password: '',
    organizationName: '', // ✅ correct property name
    role: 'Viewer', // default
  };

  roles = ['Viewer', 'Admin', 'Owner']; // ✅ Added
  message = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.loading = true;
    this.message = '';

    this.authService.register(this.form).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = 'Registration successful!';
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err: any) => {
        this.loading = false;
        this.message = err.error?.message || 'Registration failed';
      },
    });
  }
}
