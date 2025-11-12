import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule], // 👈 enables <router-outlet> & routerLink
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {}
