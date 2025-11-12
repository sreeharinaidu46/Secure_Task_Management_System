import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.auth.getToken();
    if (token) {
      return true; // ✅ Allow access
    } else {
      this.router.navigate(['/login']); // 🚫 Redirect if not logged in
      return false;
    }
  }
}
