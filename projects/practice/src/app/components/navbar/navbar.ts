import {AuthService} from '@shared/services/auth.service';
import {environment} from '../../../../../../src/environments/environment.development';
import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  public authService = inject(AuthService);
  public patientPortalUrl = environment.patientPortalUrl;

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  get isSignupPage(): boolean {
    return this.router.url === '/signup';
  }

  public async onSubmit() : Promise<void> {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  public async onSettings() : Promise<void> {
    this.router.navigate(['/preferences']);
  }

  public async onSubmitToRegister() : Promise<void> {
    this.authService.logout();
    this.router.navigate(['/signup']);
  }
}
