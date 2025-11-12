import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  username = '';

  constructor(private auth: AuthService, private router: Router) {
    const token = this.auth.getToken(); // ✅ call the method instead of accessing property
    this.username = token ? 'User' : 'Guest';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
