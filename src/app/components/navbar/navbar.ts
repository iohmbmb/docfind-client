import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  get isSignupPage(): boolean {
    return this.router.url === '/signup';
  }
}
