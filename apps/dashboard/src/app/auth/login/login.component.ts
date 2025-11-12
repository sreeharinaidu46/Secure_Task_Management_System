import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  form = { email: '', password: '' };
  loading = false;
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.loading = true;
    this.message = '';

    this.auth.login(this.form).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.access_token) {
          this.auth.saveUserSession(res.access_token, res.user);
          this.router.navigate(['/tasks']); // ✅ Redirect to tasks page
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.message || 'Invalid credentials';
      },
    });
  }
}
